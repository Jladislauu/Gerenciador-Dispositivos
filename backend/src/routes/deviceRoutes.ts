import { Router } from "express";
import {
  createDevice,
  listDevices,
  toggleStatus,
} from "../controllers/deviceController";
import { validate } from "../middlewares/validate";
import { createDeviceSchema } from "../services/validationSchema";
import { Server } from "socket.io";

const deviceRoutes = (io: Server) => {
  const router = Router();

  router.post("/", validate(createDeviceSchema), (req, res) =>
    createDevice(req, res, io)
  );
  router.get("/", listDevices);
  router.patch("/:id/status", (req, res) => toggleStatus(req, res, io));

  return router;
};

export default deviceRoutes;