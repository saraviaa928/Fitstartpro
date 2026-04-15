import Stripe from "stripe";
import { db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

//////////////////////////////////////////////////////
// 🔐 CONFIG STRIPE
//////////////////////////////////////////////////////
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

//////////////////////////////////////////////////////
// 🚀 WEBHOOK
//////////////////////////////////////////////////////
export async function POST(req: Request) {
  const body = await req.text();

  // 🔥 USAR HEADERS CORRECTAMENTE
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("❌ Error verificando webhook:", err);
    return new Response("Webhook error", { status: 400 });
  }

  //////////////////////////////////////////////////////
  // 💳 PAGO COMPLETADO
  //////////////////////////////////////////////////////
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;

    if (!userId) {
      console.warn("⚠️ No viene userId");
      return new Response("No userId", { status: 200 });
    }

    try {
      await setDoc(
        doc(db, "usuarios", userId),
        {
          pro: true,
          proSince: new Date().toISOString(),
        },
        { merge: true }
      );

      console.log("✅ Usuario PRO activado:", userId);
    } catch (error) {
      console.error("❌ Error Firebase:", error);
      return new Response("DB error", { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}