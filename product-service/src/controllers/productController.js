require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const redis = require("../config/redis");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const clearProductCache = async () => {
  const keys = await redis.keys("products:*");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      sortBy = "createdAt",
      order = "desc",
      minPrice,
      maxPrice,
      inStock
    } = req.query;

    const cacheKey = `products:${JSON.stringify(req.query)}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      isActive: true,

      ...(search && {
        name: {
          contains: search,
          mode: "insensitive"
        }
      }),

      ...(category && {
        category: {
          slug: category
        }
      }),

      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && {
            gte: parseFloat(minPrice)
          }),
          ...(maxPrice && {
            lte: parseFloat(maxPrice)
          })
        }
      }),

      ...(inStock === "true" && {
        stock: {
          gt: 0
        }
      })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,

        include: {
          category: {
            select: {
              name: true,
              slug: true
            }
          }
        },

        orderBy: {
          [sortBy]: order
        },

        skip,
        take: parseInt(limit)
      }),

      prisma.product.count({ where })
    ]);

    const response = {
      success: true,
      data: products,

      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    };
    await redis.set(
      cacheKey,
      JSON.stringify(response),
      "EX",
      300
    );

    res.json(response);

  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id)
      },

      include: {
        category: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      stock,
      imageUrl,
      categoryId
    } = req.body;

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price,
        description,
        stock,
        imageUrl,
        categoryId
      },

      include: {
        category: true
      }
    });
    await clearProductCache();

    res.status(201).json({
      success: true,
      data: product,
      message: "Tạo sản phẩm thành công"
    });

  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: {
        id: parseInt(req.params.id)
      },

      data: req.body,

      include: {
        category: true
      }
    });

    await clearProductCache();

    res.json({
      success: true,
      data: product,
      message: "Cập nhật thành công"
    });

  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.update({
      where: {
        id: parseInt(req.params.id)
      },

      data: {
        isActive: false
      }
    });
    
    await clearProductCache();

    res.json({
      success: true,
      message: "Đã ẩn sản phẩm thành công"
    });

  } catch (error) {
    next(error);
  }
};

// POST /api/products/:id/image
const uploadProductImage = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Chưa chọn ảnh để upload"
      });
    }

    const product = await prisma.product.update({
      where: {
        id: productId
      },

      data: {
        imageUrl: req.file.path
      },

      include: {
        category: true
      }
    });

    await clearProductCache();

    res.json({
      success: true,
      data: product,
      message: "Upload ảnh sản phẩm thành công"
    });

  } catch (error) {
    next(error);
  }
};

// Export các controller
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};