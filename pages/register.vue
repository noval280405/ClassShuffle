<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-100 dark:bg-slate-950">
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
      
      <button @click="isDarkMode = !isDarkMode" class="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-amber-400">
        <i :class="isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
      </button>

      <div class="text-center mb-6">
        <i class="fa-solid fa-user-plus text-4xl text-purple-600 dark:text-purple-400 mb-2"></i>
        <h2 class="text-2xl font-black text-slate-950 dark:text-white">Daftar Akun</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Buat akun untuk sinkronisasi cloud kelompok mahasiswa</p>
      </div>

      <div v-if="message.text" :class="message.isError ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'" class="p-3 rounded-xl border text-xs mb-4 flex items-center gap-2">
        <span class="font-medium">{{ message.text }}</span>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email Resmi</label>
          <input v-model="email" type="email" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 dark:text-slate-100" placeholder="nama@dosen.ac.id" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Kata Sandi (Min 6 Karakter)</label>
          <input v-model="password" type="password" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 dark:text-slate-100" placeholder="••••••••" />
        </div>
        <button type="submit" :disabled="isSubmitting" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
          <i v-if="isSubmitting" class="fa-solid fa-spinner animate-spin"></i>
          Daftar Sekarang
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs">
        <span class="text-slate-400">Sudah punya akun? </span>
        <NuxtLink to="/login" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Kembali Login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createUserWithEmailAndPassword } from 'firebase/auth'

const { $auth } = useNuxtApp()
const isDarkMode = inject('isDarkMode')

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const message = ref({ text: '', isError: false })

const handleRegister = async () => {
  isSubmitting.value = true
  message.value = { text: '', isError: false }
  try {
    await createUserWithEmailAndPassword($auth, email.value, password.value)
    message.value = { text: 'Pendaftaran sukses! Mengalihkan halaman...', isError: false }
    setTimeout(() => navigateTo('/'), 1500)
  } catch (error) {
    let msg = 'Gagal membuat akun.'
    if (error.code === 'auth/email-already-in-use') msg = 'Email sudah digunakan oleh dosen lain.'
    if (error.code === 'auth/weak-password') msg = 'Kata sandi terlalu lemah (minimal 6 karakter).'
    message.value = { text: msg, isError: true }
  } finally {
    isSubmitting.value = false
  }
}
</script>