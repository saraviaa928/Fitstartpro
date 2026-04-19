import { NextResponse } from "next/server";
import { createSubscription } from "@/lib/paypal";

export async function POST(req: Request) {
  const { uid } = await req.json();

  const sub = await createSubscription(
    process.env.PAYPAL_PLAN_ID!,
    uid
  );

  return NextResponse.json({
    id: sub.id,
    approve: sub.links.find((l: any) => l.rel === "approve")?.href,
  });
}