import dotenv from "dotenv";

dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
// import initSocket from "./socket/index";
import apiRouter from "./routes/api";

import { initRabbitMQ } from "./services/rabbitmq/connection";
import orderConsumer from "./services/rabbitmq/order/order.consumer";
import { initCronJobs } from "./cron";
import { globalLimiter } from "./config/rateLimiter.config";
import userConsumer from "./services/rabbitmq/user/user.consumer";

const app = express();
const server = http.createServer(app);

// initSocket(server);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
  }),
);

app.use("/api", globalLimiter, apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

server.listen(process.env.PORT, () => {
  console.log(`✅ Server chạy tại: http://localhost:${process.env.PORT}`);
  initCronJobs();
});

async function bootstrap() {
  await initRabbitMQ();

  await orderConsumer.startOrderConfirmationEmailConsumer();
  await orderConsumer.startOrderStatusUpdateEmailConsumer();
  await userConsumer.startVerifyEmailConsumer();
}

bootstrap();
