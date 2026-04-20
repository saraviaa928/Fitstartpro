const BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();

  if (!data.access_token) {
    console.error("TOKEN ERROR:", data);
    throw new Error("No se pudo obtener token");
  }

  return data.access_token;
}

export async function createSubscription(planId: string) {
  const token = await getAccessToken();

  const res = await fetch(`${BASE}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("PAYPAL ERROR:", data);
    throw new Error("Error creando suscripción");
  }

  return data;
}