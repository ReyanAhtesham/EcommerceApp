import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { cartItems } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.qty,
    })),
    success_url: `${process.env.FRONTEND_URL}/order-success`,
    cancel_url: `${process.env.FRONTEND_URL}/cart`,
  });

  res.json({ url: session.url });
};
