import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js"; // Adjust path as needed

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a checkout session for Stripe
export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const orderId = req.params.id; // Get orderId from URL params

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: "Invalid cart items." });
    }

    // Find the order to ensure it exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      })),
      metadata: {
        orderId: orderId, // Store orderId in metadata
      },
      success_url: `${process.env.FRONTEND_URL}/order/${orderId}?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/${orderId}?payment_canceled=true`,
    });

    console.log("Stripe session created:", session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Verify payment status from Stripe
export const verifyStripePayment = async (req, res) => {
  const { sessionId } = req.body;
  const orderId = req.params.id;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Verify that this session is for this order
    if (session.metadata.orderId !== orderId) {
      return res.status(400).json({ 
        message: "Session ID does not match this order" 
      });
    }

    if (session.payment_status === "paid") {
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Only update if not already paid
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentMethod = "Stripe";
        order.paymentResult = {
          id: session.id,
          status: session.payment_status,
          update_time: new Date(session.created * 1000).toISOString(),
          email_address: session.customer_details?.email || "",
        };

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
      } else {
        res.status(200).json(order);
      }
    } else {
      res.status(400).json({ 
        message: "Payment not completed" 
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ message: error.message });
  }
};