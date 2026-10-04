# N23DCPT012_LeThiBaoDiep_Web_Prac2a

Lab 2a - Backend với Node.js Microservices

## Overview

Project xây dựng hệ thống backend theo kiến trúc Microservices với Node.js và Express.

Hệ thống gồm 4 service chính:

- API Gateway
- Product Service
- Order Service
- Auth Service

Ngoài ra project sử dụng PostgreSQL, MongoDB, Redis, Cloudinary, Swagger, Docker và Railway.

## Services

| Service | Port | Description |
|---|---:|---|
| API Gateway | 3000 | Route request tới các service và xác thực JWT cho protected routes |
| Product Service | 3001 | Quản lý sản phẩm, PostgreSQL + Prisma, Redis cache, Cloudinary upload |
| Order Service | 3002 | Quản lý đơn hàng, MongoDB + Mongoose, Swagger API docs |
| Auth Service | 3003 | Đăng ký, đăng nhập, refresh token và xác thực JWT |

## Main Features

### API Gateway
- Proxy request tới Product Service và Order Service
- JWT authentication middleware
- Protected `/api/orders` routes
- Rate limiting
- CORS và Helmet

### Product Service
- CRUD sản phẩm
- Pagination, filtering, searching và sorting
- PostgreSQL với Prisma ORM
- Upload ảnh sản phẩm lên Cloudinary
- Redis cache cho `GET /api/products`
- Tự động clear cache khi dữ liệu sản phẩm thay đổi
- Swagger UI

### Order Service
- Tạo đơn hàng
- Lấy đơn hàng theo customer
- Cập nhật trạng thái đơn hàng
- MongoDB với Mongoose
- Swagger/OpenAPI documentation
- Bearer authentication documentation

### Auth Service
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- Password hashing với bcryptjs
- JWT access token
- JWT refresh token
- PostgreSQL với Prisma

## Technologies

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- MongoDB
- Mongoose
- Redis
- ioredis
- Cloudinary
- Multer
- JWT
- bcryptjs
- Swagger / OpenAPI
- Docker
- Docker Compose
- Railway
- Postman

## Project Structure

```text
lab02a/
├── api-gateway/
├── product-service/
├── order-service/
├── auth-service/
├── postman/
├── docker-compose.yml
└── README.md
```

## Environment Variables

Mỗi service sử dụng file `.env` riêng hoặc Railway Variables.

Không commit `.env` hoặc secret lên GitHub.

Ví dụ các biến cần thiết:

### API Gateway

```env
PORT=3000
PRODUCT_SERVICE_URL=...
ORDER_SERVICE_URL=...
JWT_SECRET=...
ALLOWED_ORIGINS=...
```

### Product Service

```env
PORT=3001
DATABASE_URL=...
REDIS_URL=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Order Service

```env
PORT=3002
MONGODB_URI=...
```

### Auth Service

```env
PORT=3003
DATABASE_URL=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
SERVICE_NAME=auth-service
```

## Run with Docker

Từ thư mục root của project:

```bash
docker compose up -d --build
```

Kiểm tra container:

```bash
docker compose ps
```

Xem logs:

```bash
docker compose logs -f
```

Dừng toàn bộ service:

```bash
docker compose down
```

## Local URLs

```text
API Gateway:
http://localhost:3000

Product Service:
http://localhost:3001

Product Swagger:
http://localhost:3001/api-docs

Order Service:
http://localhost:3002

Order Swagger:
http://localhost:3002/api-docs

Auth Service:
http://localhost:3003
```

## Authentication Flow

```text
Client
  ↓
POST /api/auth/login
  ↓
Auth Service
  ↓
accessToken
  ↓
Client sends Bearer token
  ↓
API Gateway verifies JWT
  ↓
Protected Order Service route
```

Ví dụ:

```http
GET /api/orders/customer/1
Authorization: Bearer <accessToken>
```

Nếu không có token hợp lệ, API Gateway trả về `401 Unauthorized`.

## Product Image Upload

Endpoint:

```http
POST /api/products/:id/image
```

Body sử dụng `multipart/form-data`:

```text
image: <file>
```

Ảnh được upload lên Cloudinary và URL được lưu vào field `imageUrl` của Product.

## Redis Cache

`GET /api/products` được cache trong Redis trong 5 phút.

Cache được xóa khi thực hiện:

- POST Product
- PUT Product
- DELETE Product
- Upload Product Image

## Swagger

Order Service Swagger:

```text
http://localhost:3002/api-docs
```

Các endpoint chính:

```text
POST  /api/orders
GET   /api/orders/customer/{customerId}
PATCH /api/orders/{id}/status
```

## Postman

Postman Collection:

```text
postman/Lab2.postman_collection.json
```

Collection gồm các folder:

- Products
- Orders
- Auth

Các collection variables chính:

```text
base_url
order_url
auth_url
gateway_url
access_token
refresh_token
order_id
```

## Deployment

Các service được deploy trên Railway.

Production environment sử dụng Railway Variables cho database URLs, JWT secrets, Redis và Cloudinary credentials.

## Author

Le Thi Bao Diep  
Student ID: N23DCPT012
