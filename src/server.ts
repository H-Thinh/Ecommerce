import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
// import initSocket from "./socket/index";
import apiRouter from "./routes/api";
import dotenv from "dotenv";

import { initRabbitMQ } from "./services/rabbitmq/connection";
import productConsumer from "./services/rabbitmq/product/product.consumer";
import { initCronJobs } from "./cron";

dotenv.config();

const app = express();
const server = http.createServer(app);

// initSocket(server);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api", apiRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

server.listen(process.env.PORT, () => {
  console.log(`✅ Server chạy tại: http://localhost:${process.env.PORT}`);
  initCronJobs();
});

async function bootstrap() {
  await initRabbitMQ();

  await productConsumer.startUpdateProductStatus();
}

bootstrap();
