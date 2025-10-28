// tests/integration/device.integration.test.ts
import request from "supertest";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { AppDataSource } from "../../ormconfig";
import deviceRoutes from "../../src/routes/deviceRoutes";
import { IOMock } from "../mocks/socketMock";

describe("Rotas de Dispositivos - Integração", () => {
  let app: express.Application;
  let server: http.Server;
  let io: IOMock;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    server = http.createServer(app);
    const socketServer = new Server(server, { cors: { origin: "*" } });
    io = new IOMock();
    (global as any).io = io;

    app.use("/api/devices", deviceRoutes(io as any));
  });

  afterEach(() => {
    io.clear();
  });

  afterAll((done) => {
    server.close(done);
  });

  it("POST /api/devices - cria dispositivo e emite device:created", async () => {
    const res = await request(app)
      .post("/api/devices")
      .send({ name: "Sensor A", mac: "00:11:22:33:44:55" })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Sensor A");
    expect(res.body.status).toBe("ATIVO");

    // Verifica evento WebSocket
    expect(io.socket.emitted).toContainEqual({
      event: "device:created",
      data: expect.objectContaining({ name: "Sensor A" }),
    });
  });

  it("GET /api/devices - lista dispositivos", async () => {
    await AppDataSource.getRepository("Device").save({
      name: "Teste",
      mac: "99:88:77:66:55:44",
      status: "ATIVO",
    });

    const res = await request(app).get("/api/devices").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("PATCH /api/devices/:id/status - alterna status e emite device:status", async () => {
    const device = await AppDataSource.getRepository("Device").save({
      name: "Toggle",
      mac: "11:22:33:44:55:66",
      status: "ATIVO",
    });

    const res = await request(app)
      .patch(`/api/devices/${device.id}/status`)
      .send({ status: "INATIVO" })
      .expect(200);

    expect(res.body.status).toBe("INATIVO");

    expect(io.socket.emitted).toContainEqual({
      event: "device:status",
      data: { id: device.id, status: "INATIVO" },
    });
  });
});