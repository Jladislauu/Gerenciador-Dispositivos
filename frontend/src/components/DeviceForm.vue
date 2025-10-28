<!-- src/components/DeviceForm.vue -->
<template>
  <form @submit.prevent="submit" class="space-y-4 p-6 bg-white rounded-lg shadow">
    <h3 class="text-lg font-semibold">Cadastrar Dispositivo</h3>

    <div>
      <label class="block text-sm font-medium">Nome *</label>
      <input
        v-model="form.name"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Sensor de Temperatura"
      />
    </div>

    <div>
      <label class="block text-sm font-medium">MAC Address *</label>
      <input
        v-model="form.mac"
        type="text"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="AA:BB:CC:DD:EE:FF"
      />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      <span v-if="loading">Cadastrando...</span>
      <span v-else>Cadastrar</span>
    </button>

    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
    <p v-if="success" class="mt-2 text-sm text-green-600">{{ success }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createDevice } from '../services/api'

const emit = defineEmits<{
  (e: 'created'): void
}>()

const form = ref({
  name: '',
  mac: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const submit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await createDevice(form.value)
    success.value = 'Dispositivo cadastrado!'
    form.value.name = ''
    form.value.mac = ''
    emit('created')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao cadastrar'
  } finally {
    loading.value = false
    setTimeout(() => {
      success.value = ''
      error.value = ''
    }, 3000)
  }
}
</script>