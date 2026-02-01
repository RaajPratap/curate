const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.put("/items/:itemId", cartController.updateItem);
router.delete("/items/:itemId", cartController.removeItem);
// Alternative route for removing items (for clients that can't send DELETE with body)
router.post("/items/:itemId/remove", cartController.removeItem);
router.delete("/", cartController.clearCart);
// Alternative route for clearing cart (for clients that can't send DELETE with body)
router.post("/clear", cartController.clearCart);

module.exports = router;
