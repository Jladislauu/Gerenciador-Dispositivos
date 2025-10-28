<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Gerenciador de Dispositivos IoT</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <DeviceForm @created="loadDevices" />
        </div>

        <div class="lg:col-span-2">
          <DeviceTable
            :devices="devices"
            @status-updated="loadDevices"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DeviceForm from './components/DeviceForm.vue'
import DeviceTable from './components/DeviceTable.vue'
import { getDevices } from './services/api'
import { socketService } from './services/socket'
import type { Device } from './types/device'

const devices = ref<Device[]>([])

const loadDevices = async () => {
  try {
    const res = await getDevices()
    devices.value = res.data
  } catch (err) {
    console.error('Erro ao carregar dispositivos')
  }
}

// WebSocket: novo dispositivo
socketService.onDeviceCreated((device) => {
  devices.value.push(device)
})

// WebSocket: status alterado
socketService.onStatusChanged(({ id, status }) => {
  const device = devices.value.find((d) => d.id === id)
  if (device) device.status = status
})

onMounted(() => {
  loadDevices()
})

onUnmounted(() => {
  socketService.disconnect()
})
</script>

<style>
/* Tailwind já incluído via CDN no index.html */
</style>