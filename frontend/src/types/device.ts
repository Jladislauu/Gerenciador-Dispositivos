// src/types/device.ts
export enum DeviceStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export interface Device {
  id: number
  name: string
  mac: string
  status: DeviceStatus
  createdAt: string
}