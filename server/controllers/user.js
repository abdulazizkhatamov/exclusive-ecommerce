const User = require("../models/user-schema");
const Order = require("../models/order-schema");
const { stripe } = require("../utils/payment-methods");

exports.getUser = async (req, res) => {
  try {
    // Find the user by ID and populate all fields
    // Find the user by ID and populate the `cart`, `product`, and `variant` data
    const user = await User.findById(req.user._id)
      .populate({
        path: "cart.product", // Path to the product in the cart
        model: "Product", // Model name for the product
      })
      .populate({
        path: "cart.variant", // Path to the variant in the cart
        model: "Variant", // Model name for the variant
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the password field before sending the response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.postAddToCart = async (req, res) => {
  try {
    const { product, variant, quantity } = req.body; // Extract item details from the request body
    const user = req.user; // Extract the logged-in user

    // Fetch the user from the database
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the cart already contains the item with the same variant
    const existingItemIndex = dbUser.cart.findIndex(
      (item) => item.variant.toString() === variant._id.toString(),
    );

    if (existingItemIndex >= 0) {
      // Update the quantity of the existing item
      dbUser.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add the new item to the cart
      dbUser.cart.push({
        product: product,
        variant: variant._id, // Ensure correct ObjectId
        quantity,
      });
    }

    // Save the updated user document
    await dbUser.save();

    // Populate the cart with product and variant details
    const populatedCart = await User.findById(user._id)
      .populate({
        path: "cart.product", // Populate the product field in the cart
        model: "Product",
      })
      .populate({
        path: "cart.variant", // Populate the variant field in the cart
        model: "Variant",
      });

    // Respond with the updated cart
    res.status(200).json({
      message: "Item added to cart successfully.",
      cart: populatedCart.cart, // Only send the cart array
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res
      .status(500)
      .json({ message: "Failed to add item to cart.", error: error.message });
  }
};

exports.putUpdateCartItemQty = async (req, res) => {
  const { id, quantity } = req.body; // Assuming `id` is the product's ObjectId
  const { _id } = req.user; // Extract user ID from the authenticated user

  if (!id || !quantity) {
    return res
      .status(400)
      .json({ message: "Product ID and quantity are required" });
  }

  try {
    // Fetch user and their cart
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the cart item
    const cartItem = user.cart.find((item) => item._id.toString() === id);

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the quantity
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    cartItem.quantity = quantity;

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Cart item quantity updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteDeleteCartItem = async (req, res) => {
  const { _id: cartItemId } = req.params; // Extract cart item ID from request params
  const { _id: userId } = req.user; // Extract user ID from the authenticated user

  if (!cartItemId) {
    return res.status(400).json({ message: "Cart item ID is required" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the cart item to delete
    const initialCartLength = user.cart.length;
    user.cart = user.cart.filter((item) => item._id.toString() !== cartItemId);

    if (user.cart.length === initialCartLength) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Cart item deleted successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.postCreateAddress = async (req, res) => {
  const { fullName, street, apartment, state, city, postalCode, phone } =
    req.body;
  const { _id } = req.user;

  try {
    // Find the user by ID
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new address object
    const addressToAdd = {
      fullName,
      street,
      apartment,
      state,
      city,
      postalCode,
      phone,
    };

    // Add the new address to the user's addresses array
    user.addresses.push(addressToAdd);

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteDeleteAddress = async (req, res) => {
  const { _id: addressId } = req.params; // Extract address ID from request params
  const { _id: userId } = req.user; // Extract user ID from authenticated user

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the address exists in the user's addresses
    const addressIndex = user.addresses.findIndex(
      (address) => address._id.toString() === addressId,
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Remove the address from the user's addresses array
    user.addresses.splice(addressIndex, 1);

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getOrdersByUserID = async (req, res) => {
  const { _id: userId } = req.params;

  try {
    const dbOrders = await Order.find({ user: userId })
      .populate("user")
      .populate("products.product")
      .populate("products.variant");

    return res.status(200).json({
      message: "Orders found",
      orders: dbOrders,
    });
  } catch (error) {
    console.error("Error getting orders by user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.postCreateOrder = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract information from req.body and req.user
    const { products, billingDetails, paymentMethod, totalAmount } = req.body;
    const userId = req.user._id;

    console.log(products);

    // Validate the products in the order
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in the order" });
    }

    const cleanedProducts = products.map(({ _id, ...rest }) => rest);
    const newOrder = new Order({
      user: userId,
      products: cleanedProducts,
      billingDetails,
      paymentMethod,
      totalAmount,
      paymentStatus: "Pending", // You can modify this based on the payment system you're using
      orderStatus: "Placed", // Initial status
    });

    // Save the order to the database
    await newOrder.save();

    // Update the user's order history and clear the cart
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { orderHistory: newOrder._id },
        $set: { cart: [] }, // Clear the user's cart
      },
      { new: true },
    );

    // Populate product and variant data
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("products.product") // Populate product field
      .populate("products.variant"); // Populate variant field

    populatedOrder.paymentUrl = await stripe({
      email: updatedUser.email,
      items: populatedOrder.products,
      orderId: populatedOrder._id.toString(),
    });
    await populatedOrder.save();

    // Return a successful response with populated order details
    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
      cart: updatedUser.cart, // Optional: Return the updated cart (should be empty)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
