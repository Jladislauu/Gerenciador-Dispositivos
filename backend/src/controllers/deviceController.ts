import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { Device, DeviceStatus } from "../entities/Device";
import { Server } from "socket.io";

const deviceRepo = AppDataSource.getRepository(Device);

export const createDevice = async (req: Request, res: Response, io: Server) => {
  const { name, mac } = req.body;

  const exists = await deviceRepo.findOneBy({ mac });
  if (exists) {
    return res.status(400).json({ message: "MAC já cadastrado" });
  }

  const device = deviceRepo.create({
    name,
    mac,
    status: DeviceStatus.ATIVO,
  });

  await deviceRepo.save(device);

  // Emite evento global
  io.emit("device:created", device);

  return res.status(201).json(device);
};

export const listDevices = async (req: Request, res: Response) => {
  const devices = await deviceRepo.find();
  return res.json(devices);
};

export const toggleStatus = async (req: Request, res: Response, io: Server) => {
  const { id } = req.params;

  const device = await deviceRepo.findOneBy({ id: Number(id) });
  if (!device) {
    return res.status(404).json({ message: "Dispositivo não encontrado" });
  }

  device.status =
    device.status === DeviceStatus.ATIVO ? DeviceStatus.INATIVO : DeviceStatus.ATIVO;

  await deviceRepo.save(device);

  io.emit("device:status", { id: device.id, status: device.status });

  return res.json(device);
};