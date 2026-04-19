import { NextResponse } from "next/server";
import { createSubscription } from "@/lib/paypal";

export async function POST() {
  try {
    const approveUrl = await createSubscription();

    return NextResponse.json({ approveUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando suscripción" },
      { status: 500 }
    );
  }
}