export async function POST(req: Request) {
  const { userId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    metadata: {
      userId, // 🔥 clave para webhook
    },

    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "FitStartPro PRO",
          },
          unit_amount: 500,
        },
        quantity: 1,
      },
    ],

    success_url: "https://TU-APP.vercel.app",
    cancel_url: "https://TU-APP.vercel.app",
  });

  return Response.json({ url: session.url });
}