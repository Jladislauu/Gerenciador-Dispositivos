// src/services/socket.ts
import { io, Socket } from 'socket.io-client'
import type { Device } from '../types/device'

class SocketService {
  private socket: Socket

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
    })
  }

  onDeviceCreated(callback: (device: Device) => void) {
    this.socket.on('device:created', callback)
  }

  onStatusChanged(callback: (data: { id: number; status: Device['status'] }) => void) {
    this.socket.on('device:status', callback)
  }

  disconnect() {
    this.socket.disconnect()
  }
}

export const socketService = new SocketService()