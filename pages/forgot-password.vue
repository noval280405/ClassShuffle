<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-100 dark:bg-slate-950">
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
      
      <button @click="isDarkMode = !isDarkMode" class="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-amber-400">
        <i :class="isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
      </button>

      <div class="text-center mb-6">
        <i class="fa-solid fa-key text-4xl text-amber-500 mb-2"></i>
        <h2 class="text-2xl font-black text-slate-950 dark:text-white">Lupa Sandi</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Kami akan kirimkan link pemulihan kata sandi ke email Anda</p>
      </div>

      <div v-if="message.text" :class="message.isError ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'" class="p-3 rounded-xl border text-xs mb-4 flex items-center gap-2">
        <span class="font-medium">{{ message.text }}</span>
      </div>

      <form @submit.prevent="handleReset" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email Terdaftar</label>
          <input v-model="email" type="email" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 dark:text-slate-100" placeholder="nama@dosen.ac.id" />
        </div>
        <button type="submit" :disabled="isSubmitting" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
          <i v-if="isSubmitting" class="fa-solid fa-spinner animate-spin"></i>
          Kirim Link Reset
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs">
        <NuxtLink to="/login" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Kembali ke Halaman Login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { sendPasswordResetEmail } from 'firebase/auth'

const { $auth } = useNuxtApp()
const isDarkMode = inject('isDarkMode')

const email = ref('')
const isSubmitting = ref(false)
const message = ref({ text: '', isError: false })

const handleReset = async () => {
  isSubmitting.value = true
  message.value = { text: '', isError: false }
  try {
    await sendPasswordResetEmail($auth, email.value)
    message.value = { text: 'Link reset berhasil dikirim! Silakan periksa inbox atau folder spam email Anda.', isError: false }
  } catch (error) {
    message.value = { text: 'Email tidak ditemukan atau terjadi gangguan jaringan.', isError: true }
  } finally {
    isSubmitting.value = false
  }
}
</script>