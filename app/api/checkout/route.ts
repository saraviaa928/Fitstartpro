import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "FitStartPro Premium",
          },
          unit_amount: 500, // $5
        },
        quantity: 1,
      },
    ],
    success_url: "https://TU-APP.vercel.app/success",
    cancel_url: "https://TU-APP.vercel.app",
  });

  return Response.json({ url: session.url });
}