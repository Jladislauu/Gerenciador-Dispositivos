<!-- src/components/DeviceTable.vue -->
<template>
  <div class="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAC</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="device in devices" :key="device.id">
          <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{{ device.id }}</td>
          <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{{ device.name }}</td>
          <td class="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-500">{{ device.mac }}</td>
          <td class="whitespace-nowrap px-6 py-4">
            <span
              :class="[
                'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                device.status === 'ATIVO'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800',
              ]"
            >
              {{ device.status }}
            </span>
          </td>
          <td class="whitespace-nowrap px-6 py-4 text-sm">
            <button
              @click="toggleStatus(device)"
              :disabled="toggling.has(device.id)"
              class="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
            >
              {{ toggling.has(device.id) ? '...' : 'Alternar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="devices.length === 0" class="text-center py-8 text-gray-500">
      Nenhum dispositivo cadastrado.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Device } from '../types/device'
import { updateDeviceStatus } from '../services/api'

const props = defineProps<{
  devices: Device[]
}>()

const emit = defineEmits<{
  (e: 'status-updated'): void
}>()

const toggling = ref<Set<number>>(new Set())

const toggleStatus = async (device: Device) => {
  const newStatus = device.status === 'ATIVO' ? 'INATIVO' : 'ATIVO'
  toggling.value.add(device.id)

  try {
    await updateDeviceStatus(device.id, newStatus)
    emit('status-updated')
  } catch (err) {
    alert('Erro ao alternar status')
  } finally {
    toggling.value.delete(device.id)
  }
}
</script>