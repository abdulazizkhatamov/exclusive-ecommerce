const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/admin");
const upload = require("../config/multer");

const authenticate = require("../middlewares/admin-auth");

router.get("/", authenticate, controller.getAdmin);

router.get("/all-categories", authenticate, controller.getAllCategories);

router.get("/categories", authenticate, controller.getCategories);

router.get("/subcategories", authenticate, controller.getSubcategories);

router.get(
  "/subcategories/:_id",
  authenticate,
  controller.getSubcategoriesByParent,
);

router.post("/categories", authenticate, controller.postCreateCategory);

router.put(`/categories`, authenticate, controller.putUpdateCategory);

router.delete(
  `/categories/:_id`,
  authenticate,
  controller.deleteDeleteCategory,
);

router.get("/products", authenticate, controller.getProducts);

router.get("/products/category/:categoryId", controller.getCategoryProducts);

router.get("/products/:_id", authenticate, controller.getProduct);

// Upload images and create product
router.post(
  "/products",
  authenticate,
  (req, res, next) => {
    upload.array("image", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors (e.g., file size limit exceeded)
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Handle general errors (e.g., other unexpected errors)
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
      next(); // Proceed to the next middleware if no error
    });
  },

  // Validate required fields
  (req, res, next) => {
    const { name, description, category, price, attributes } = req.body;

    if (!name || !description || !category || !price || !attributes) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    next();
  },

  // Controller to handle product creation
  controller.postCreateProduct,
);

router.put(
  "/products/:_id",
  authenticate,
  (req, res, next) => {
    upload.array("image", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors (e.g., file size limit exceeded)
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Handle general errors (e.g., other unexpected errors)
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
      next(); // Proceed to the next middleware if no error
    });
  },
  controller.putUpdateProduct,
);

router.delete("/products/:_id", authenticate, controller.deleteDeleteProduct);

router.get("/variants/:product", authenticate, controller.getProductVariants);

router.post(
  "/variants",
  authenticate,
  // Multer image upload middleware
  (req, res, next) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors (e.g., file size limit exceeded)
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Handle general errors (e.g., other unexpected errors)
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
      next(); // Proceed to the next middleware if no error
    });
  },
  controller.postCreateVariant,
);

router.put(
  "/variants",
  authenticate,
  (req, res, next) => {
    upload.array("images", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors (e.g., file size limit exceeded)
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Handle general errors (e.g., other unexpected errors)
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
      next(); // Proceed to the next middleware if no error
    });
  },
  controller.putUpdateVariant,
);

router.delete("/variants/:_id", authenticate, controller.deleteDeleteVariant);

router.get("/orders", authenticate, controller.getOrders);

router.put("/orders/:_id", authenticate, controller.putUpdateOrderStatus);

router.get("/mail/accounts", authenticate, controller.getMailAccounts);

router.post("/mail/accounts", authenticate, controller.postCreateMailAccount);

router.delete("/mail/accounts", authenticate, controller.postDeleteMailAccount);

router.get("/mails/inbox", authenticate, controller.getInboxMails);

router.get("/mails/trash", authenticate, controller.getTrashMails);

router.put("/mail/status/:_id", authenticate, controller.putUpdateMsgStatus);

router.delete(
  "/mail/delete/:_id",
  authenticate,
  controller.deleteDeleteMailMsg,
);

router.post("/mail/message", authenticate, controller.postSendMessage);

router.get("/chat/accounts", authenticate, controller.getChatAccounts);

router.post(
  "/chat/accounts",
  authenticate,
  (req, res, next) => {
    upload.array("image", 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors (e.g., file size limit exceeded)
        return res.status(400).json({ message: err.message });
      } else if (err) {
        // Handle general errors (e.g., other unexpected errors)
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: err.message });
      }
      next(); // Proceed to the next middleware if no error
    });
  },
  controller.postCreateChatAccount,
);

router.delete(
  "/chat/accounts/",
  authenticate,
  controller.deleteDeleteChatAccount,
);

router.get("/chats", authenticate, controller.getChats);

router.post("/chat/messages", authenticate, controller.postChatMessage);

router.delete("/chat/messages", authenticate, controller.deleteChatMessage);

module.exports = router;
