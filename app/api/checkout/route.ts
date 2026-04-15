import Stripe from "stripe";

//////////////////////////////////////////////////////
// 🔐 CONFIGURAR STRIPE
//////////////////////////////////////////////////////
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

//////////////////////////////////////////////////////
// 💳 CREAR CHECKOUT
//////////////////////////////////////////////////////
export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      // 🔥 IMPORTANTE PARA WEBHOOK
      metadata: {
        userId,
      },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "FitStartPro PRO",
            },
            unit_amount: 500, // $5
          },
          quantity: 1,
        },
      ],

      success_url: "https://fitstartpro.vercel.app",
      cancel_url: "https://TU-APP.vercel.app",
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error creando checkout:", error);
    return new Response("Error", { status: 500 });
  }
}