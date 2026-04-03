# 🛍️ Fashion E-commerce Backend API

A RESTful backend for a fashion e-commerce platform built with **Node.js**, **TypeScript**, and **Express.js**. Features a full order lifecycle, VNPay payment integration, AI-powered chatbot, and automated reporting.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express.js v5 |
| ORM | Prisma |
| Database | MySQL |
| Cache | Redis (ioredis) |
| Message Queue | RabbitMQ (amqplib) |
| AI | Groq SDK (LLaMA 3.3 70B) |
| Payment | VNPay |
| Storage | Cloudinary |
| Auth | JWT + Cookie |
| Email | Nodemailer |
| Scheduler | node-cron |

---

## Features

### Authentication & Authorization
- JWT-based auth stored in HTTP-only cookies
- Role-Based Access Control (RBAC) with permission groups
- Separate auth flows for customers and admin accounts

### Product Management
- Products with variants (color × size combinations)
- Category and gender classification
- Sale/discount system (percent or fixed amount)
- Product status management
- Size guide with measurement types (bust, waist, hip, height, weight)

### Shopping & Orders
- Cart management per user
- Full order lifecycle: pending → processing → shipped → delivered → completed
- Voucher/coupon support
- Loyalty points system (earn & redeem)
- Shipping fee and delivery tracking

### Payment
- **VNPay** integration with HMAC-SHA512 signature verification and IPN callback
- **COD** (Cash on Delivery) with admin confirmation
- Payment status tracking (pending, processing, success, failed, refunded)

### Returns & Refunds
- Customer return request with image proof
- Admin approval/rejection workflow
- Refund processing with transaction reference tracking

### AI Chatbot
- Intent classification using **Groq LLaMA 3.3 70B**:
  - `search_product` — natural language product search
  - `size_advice` — size recommendation based on measurements
  - `order_status` — order tracking by conversation
  - `refund_support` — return eligibility check
- Conversation history persisted in **Redis** (2-hour TTL, last 20 messages)

### Reviews
- Post-purchase reviews with images and rating
- Admin moderation (approve/reject)
- Shop reply system

### Reporting
- Automated **daily reports** via cron (runs at midnight)
- Automated **monthly reports** via cron (runs on 1st of each month)
- Metrics: total orders, total revenue, new users

### Async Processing
- RabbitMQ consumer for async product status updates

---

## Project Structure

```
src/
├── config/          # Redis, Cloudinary config
├── controllers/     # Route handlers
├── cron/            # Scheduled jobs
├── middlewares/     # Auth, permission, upload
├── models/          # Prisma query layer
├── routes/
│   ├── admin/       # Admin-only routes
│   └── public/      # Customer-facing routes
├── services/
│   ├── ai/          # Intent detection + chat handlers
│   ├── mail/        # Email service
│   ├── cloudinary/  # Image upload
│   └── rabbitmq/    # Queue connection + consumers
├── types/           # TypeScript types
├── utils/           # Helpers
├── validation/      # Input validation
└── server.ts        # Entry point
```

---

## API Overview

### Public (`/api/*`)

| Prefix | Description |
|---|---|
| `/auths` | Register, login, logout |
| `/products` | Browse products |
| `/categories` | Category listing |
| `/genders` | Gender listing |
| `/orders` | Place and view orders |
| `/carts` | Cart CRUD |
| `/payments` | VNPay URL, COD, callback |
| `/reviews` | Submit reviews |
| `/vouchers` | Validate vouchers |
| `/users` | User profile |
| `/bank-accounts` | User bank accounts for refund |
| `/ai` | AI chatbot |

### Admin (`/api/admin/*`)

| Prefix | Description |
|---|---|
| `/products` | Product CRUD |
| `/orders` | Order management |
| `/returns` | Return approval |
| `/refunds` | Refund processing |
| `/payments` | Revenue, COD confirmation |
| `/accounts` | Admin account management |
| `/roles` | Role management |
| `/permissions` | Permission management |
| `/permission-groups` | Permission group management |
| `/role-permission-groups` | Assign permissions to roles |
| `/sales` | Sale/discount management |
| `/vouchers` | Voucher management |
| `/point-rules` | Loyalty point rules |
| `/size-guides` | Size guide management |
| `/measurements` | Measurement types |
| `/daily-reports` | Daily report data |
| `/reviews` | Review moderation |
| `/product-statuses` | Product status management |

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MySQL
- Redis
- RabbitMQ

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
PORT=3002
DATABASE_URL=mysql://user:password@localhost:3306/ecommerce
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
GROQ_API_KEY=your_groq_api_key
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Database Setup

```bash
npm run prisma:migrate
npm run prisma:generate
```

### Run

```bash
npm start
```
