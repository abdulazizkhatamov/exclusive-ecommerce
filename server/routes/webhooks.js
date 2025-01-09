const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const bodyParser = require("body-parser");

const router = express.Router();

const User = require("../models/user-schema");
const Order = require("../models/order-schema");

router.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }), // Raw body specifically for Stripe
  async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error("Stripe Webhook Secret is not defined.");
      return res.status(500).send("Webhook secret is missing.");
    }

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Payment successful:", session);

        const orderId = session.metadata.orderId; // Metadata to identify the order
        console.log(`Order ID: ${orderId}`);

        // Find the order by ID
        try {
          const order = await Order.findById(orderId);

          if (!order) {
            console.error("Order not found.");
            return res.status(404).send("Order not found.");
          }

          // Mark the order as paid and update payment details
          order.paymentStatus = "Completed";
          order.paymentUrl = session.url; // Optionally save the Stripe checkout session URL
          order.totalAmount = session.amount_total / 100; // Convert cents to dollars (adjust as needed)

          // Optionally, update the order status (e.g., "Processing")
          order.orderStatus = "Processing";

          await order.save();

          console.log(`Order ${orderId} updated successfully.`);

          // You can also update user's order history if needed
          const user = await User.findById(order.user);
          if (user) {
            user.orderHistory.push(order._id);
            await user.save();
          }
        } catch (error) {
          console.error("Error updating order:", error);
          return res.status(500).send("Error updating order.");
        }

        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  },
);

module.exports = router;
