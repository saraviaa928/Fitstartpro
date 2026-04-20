import { NextResponse } from "next/server";
import { createSubscription } from "@/lib/paypal";

export async function POST() {
  try {
    const data = await createSubscription(
      process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID!
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creando suscripción" });
  }
}