const router = require("express").Router();

const {
  createOrder,
  getOrdersByCustomer,
  updateOrderStatus
} = require("../controllers/orderController");

// POST /api/orders
router.post("/", createOrder);

// GET /api/orders/customer/:customerId
router.get("/customer/:customerId", getOrdersByCustomer);

// PATCH /api/orders/:id/status
router.patch("/:id/status", updateOrderStatus);

module.exports = router;