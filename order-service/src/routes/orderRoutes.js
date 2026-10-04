const router = require("express").Router();

const {
  createOrder,
  getOrdersByCustomer,
  updateOrderStatus
} = require("../controllers/orderController");

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - productName
 *         - price
 *         - quantity
 *         - subtotal
 *       properties:
 *         productId:
 *           type: integer
 *           example: 1
 *         productName:
 *           type: string
 *           example: iPhone 15
 *         price:
 *           type: number
 *           example: 20000000
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *         subtotal:
 *           type: number
 *           example: 40000000
 *
 *     ShippingAddress:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           example: 123 Nguyen Hue
 *         city:
 *           type: string
 *           example: Ho Chi Minh City
 *         district:
 *           type: string
 *           example: District 1
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 66f123456789abcdef123456
 *         orderCode:
 *           type: string
 *           example: ORD-20261004-0001
 *         customerId:
 *           type: integer
 *           example: 1
 *         customerName:
 *           type: string
 *           example: Nguyen Van A
 *         customerEmail:
 *           type: string
 *           format: email
 *           example: nguyenvana@example.com
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/OrderItem"
 *         totalAmount:
 *           type: number
 *           example: 40000000
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - confirmed
 *             - shipping
 *             - delivered
 *             - cancelled
 *           example: pending
 *         shippingAddress:
 *           $ref: "#/components/schemas/ShippingAddress"
 *         note:
 *           type: string
 *           example: Giao hàng giờ hành chính
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - customerName
 *               - customerEmail
 *               - items
 *               - totalAmount
 *             properties:
 *               customerId:
 *                 type: integer
 *                 example: 1
 *               customerName:
 *                 type: string
 *                 example: Nguyen Van A
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 example: nguyenvana@example.com
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: "#/components/schemas/OrderItem"
 *               totalAmount:
 *                 type: number
 *                 example: 40000000
 *               shippingAddress:
 *                 $ref: "#/components/schemas/ShippingAddress"
 *               note:
 *                 type: string
 *                 example: Giao hàng giờ hành chính
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Order"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       500:
 *         description: Lỗi server
 */

router.post("/", createOrder);

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Lấy danh sách đơn hàng theo khách hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID khách hàng
 *         example: 1
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Order"
 *       400:
 *         description: customerId không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.get("/customer/:customerId", getOrdersByCustomer);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của đơn hàng
 *         example: 66f123456789abcdef123456
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - confirmed
 *                   - shipping
 *                   - delivered
 *                   - cancelled
 *                 example: shipping
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Order"
 *       400:
 *         description: Trạng thái hoặc ID không hợp lệ
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */
router.patch("/:id/status", updateOrderStatus);

module.exports = router;