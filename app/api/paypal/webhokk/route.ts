import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const body = await req.json();

  const event = body.event_type;
  const resource = body.resource;
  const uid = resource?.custom_id;

  if (!uid) return NextResponse.json({ ok: true });

  const ref = doc(db, "usuarios", uid);

  // 🔥 ACTIVAR
  if (event === "BILLING.SUBSCRIPTION.ACTIVATED") {
    await updateDoc(ref, {
      premium: true,
      plan: "pro",
      status: "active",
      subscriptionId: resource.id,
      premiumSince: serverTimestamp(),
    });
  }

  // 🔴 CANCELAR
  if (event === "BILLING.SUBSCRIPTION.CANCELLED") {
    await updateDoc(ref, {
      premium: false,
      status: "cancelled",
    });
  }

  return NextResponse.json({ received: true });
}
