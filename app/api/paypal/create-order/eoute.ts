import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);

const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req: Request) {
  try {
    const { value } = await req.json();

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: value,
          },
        },
      ],
    });

    const order = await client.execute(request);

    return NextResponse.json({
      id: order.result.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creando orden PayPal" },
      { status: 500 }
    );
  }
}