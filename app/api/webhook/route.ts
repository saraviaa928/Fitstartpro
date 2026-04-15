import Stripe from "stripe";
import { headers } from "next/headers";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }

  //////////////////////////////////////////
  // 🎯 EVENTO DE PAGO EXITOSO
  //////////////////////////////////////////
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;

    if (userId) {
      await setDoc(
        doc(db, "usuarios", userId),
        { pro: true },
        { merge: true }
      );
    }
  }

  return new Response("ok", { status: 200 });
}