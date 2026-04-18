import { NextResponse } from "next/server";
import { createOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  const { value } = await req.json();

  const order = await createOrder(value);

  return NextResponse.json({
    id: order.id,
  });
}