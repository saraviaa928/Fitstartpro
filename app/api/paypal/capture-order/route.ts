import { NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  const { orderId } = await req.json();
  const result = await captureOrder(orderId);
  return NextResponse.json(result);
}