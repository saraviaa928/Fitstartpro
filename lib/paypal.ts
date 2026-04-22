const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;
const BASE = "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

// 🔥 CREAR SUSCRIPCIÓN REAL
export async function createSubscription() {
  const accessToken = await getAccessToken();

  const res = await fetch(`${BASE}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      plan_id: process.env.PAYPAL_PLAN_ID, // 👈 IMPORTANTE
      application_context: {
        brand_name: "FitStartPro",
        user_action: "SUBSCRIBE_NOW",
        return_url: "https://fitstartpro.vercel.app/succes",
        cancel_url: "https://fitstartpro.vercel.app",
      },
    }),
  });

  const data = await res.json();

  console.log("PAYPAL BACK RESPONSE:", data); // 👈 CLAVE

  return data;
}