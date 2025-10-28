// src/services/api.ts
import axios from 'axios'
import type { Device } from '../types/device'

const api = axios.create({
  baseURL: '/api',
})

export const createDevice = (data: { name: string; mac: string }) =>
  api.post<Device>('/devices', data)

export const getDevices = () => api.get<Device[]>('/devices')

export const updateDeviceStatus = (id: number, status: 'ATIVO' | 'INATIVO') =>
  api.patch<Device>(`/devices/${id}/status`, { status })