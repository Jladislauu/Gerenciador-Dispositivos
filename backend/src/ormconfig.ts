import "reflect-metadata";
import { DataSource } from "typeorm";
import { Device } from "./entities/Device";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,               // Cria tabelas automaticamente (dev)
  logging: false,
  entities: [Device],
  migrations: [],
  subscribers: [],
});