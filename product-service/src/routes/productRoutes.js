const router = require("express").Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require("../controllers/productController");

const {
  productValidation
} = require("../middleware/validate");

const upload = require("../middleware/upload");

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số bản ghi mỗi trang
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo slug danh mục
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt]
 *           default: createdAt
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PaginatedProducts"
 */


// GET /api/products
router.get("/", getProducts);

// POST /api/products
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       422:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", productValidation, createProduct);

// GET /api/products/:id
router.get("/:id", getProductById);

// PUT /api/products/:id
router.put("/:id", updateProduct);

// DELETE /api/products/:id
router.delete("/:id", deleteProduct);

// POST /api/products/:id/images
router.post("/:id/image",upload.single("image"), uploadProductImage);

module.exports = router;