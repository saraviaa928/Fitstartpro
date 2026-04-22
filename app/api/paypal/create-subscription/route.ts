import { NextResponse } from "next/server";
import { createSubscription } from "@/lib/paypal";

export async function POST() {
  try {
    const data = await createSubscription();

    return NextResponse.json(data);
  } catch (error) {
    console.error("ERROR API:", error);
    return NextResponse.json({ error: "Error creando suscripción" });
  }
}