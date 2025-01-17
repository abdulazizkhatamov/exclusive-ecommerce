const stripe = require("stripe")(process.env.STRIPE_KEY || "STRIPE_KEY");

module.exports = {
  stripe: async ({ email, items, orderId }) => {
    try {
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd", // Change this to your currency
          product_data: {
            name: item.product.name,
            description: item.product.description,
          },
          unit_amount: item.variant.price * 100, // Stripe expects the price in cents
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `http://localhost:5173/account/orders?id=${orderId}`,
        customer_email: email,
        metadata: {
          orderId,
        },
      });

      return session.url;
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      throw new Error("Failed to create payment session");
    }
  },
};
