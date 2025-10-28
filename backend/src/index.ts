import "reflect-metadata";
import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { AppDataSource } from "./ormconfig";
import deviceRoutes from "./routes/deviceRoutes";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  // Inicializa DB
  await AppDataSource.initialize();
  console.log("MySQL conectado com TypeORM");

  const app = express();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Rotas
  app.use("/api/devices", deviceRoutes(io));

  // Health check
  app.get("/", (req, res) => res.send("Backend rodando"));

  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

  // Exporta io para uso nos controllers
  (global as any).io = io;
}

bootstrap().catch((err) => {
  console.error("Erro ao iniciar:", err);
});