<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
      <h3 class="text-lg font-bold text-gray-900 mb-2">📢 Bagikan Hasil Kelompok</h3>
      <p class="text-sm text-gray-600 mb-4">Salin tautan di bawah ini dan bagikan ke grup WhatsApp agar siswa bisa melihat kelompok mereka.</p>
      
      <div class="flex gap-2 mb-4">
        <input 
          type="text" 
          readonly 
          :value="shareUrl" 
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 focus:outline-none"
        />
        <button 
          @click="copyToClipboard" 
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          {{ copied ? 'Tersalin!' : 'Salin' }}
        </button>
      </div>

      <div class="flex justify-end">
        <button @click="$emit('close')" class="text-sm font-medium text-gray-500 hover:text-gray-700">
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  shareUrl: String
})

defineEmits(['close'])

const copied = ref(false)

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.shareUrl)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>