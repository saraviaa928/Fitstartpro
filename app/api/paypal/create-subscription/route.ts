import { NextResponse } from "next/server";
import { createSubscription } from "@/lib/paypal";

export async function POST(req: Request) {
  const { uid } = await req.json();

  const data = await createSubscription(uid);

  return NextResponse.json(data);
}