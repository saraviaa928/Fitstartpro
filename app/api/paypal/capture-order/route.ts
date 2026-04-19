import { NextResponse } from "next/server";
import { captureOrder } from "@/paypal";
import { db } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const { orderId, uid } = await req.json();

  const result = await captureOrder(orderId);

  if (result.status === "COMPLETED") {
    const ref = doc(db, "usuarios", uid);

    await updateDoc(ref, {
      premium: true,
      plan: "pro",
      premiumSince: serverTimestamp(),
    });
  }

  return NextResponse.json(result);
}