

const CLIENT = process.env.PAYPAL_CLIENT_ID!;
const SECRET = process.env.PAYPAL_SECRET!;

async function getAccessToken() {
  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(CLIENT + ":" + SECRET).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function createSubscription(uid: string) {
  const token = await getAccessToken();

  const res = await fetch(
    "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: process.env.PAYPAL_PLAN_ID,
        custom_id: uid,
        application_context: {
          return_url: "https://TU-DOMINIO.vercel.app/success",
          cancel_url: "https://TU-DOMINIO.vercel.app/",
        },
      }),
    }
  );

  return res.json();
}