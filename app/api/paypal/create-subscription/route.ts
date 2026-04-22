import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 🔐 Obtener token de PayPal
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const tokenData = await tokenRes.json();

    console.log("TOKEN:", tokenData);

    const accessToken = tokenData.access_token;

    // 🔥 CREAR SUSCRIPCIÓN
    const subRes = await fetch(
      "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: process.env.PAYPAL_PLAN_ID, // 👈 IMPORTANTE
          application_context: {
            brand_name: "FitStartPro",
            user_action: "SUBSCRIBE_NOW",
            return_url: "https://fitstartpro.vercel.app/succes",
            cancel_url: "https://fitstartpro.vercel.app/",
          },
        }),
      }
    );

    const data = await subRes.json();

    // 🔥 LOG REAL
    console.log("PAYPAL RAW RESPONSE:", data);

    // 🔴 DEVOLVER TODO (clave para debug)
    return NextResponse.json(data);

  } catch (error) {
    console.error("ERROR BACKEND:", error);

    return NextResponse.json({
      error: "Error interno",
    });
  }
}