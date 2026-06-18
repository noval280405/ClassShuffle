<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-100 dark:bg-slate-950">
    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
      
      <button @click="isDarkMode = !isDarkMode" class="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-amber-400">
        <i :class="isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
      </button>

      <div class="text-center mb-6">
        <i class="fa-solid fa-shuffle text-4xl text-indigo-600 dark:text-indigo-400 mb-2"></i>
        <h2 class="text-2xl font-black text-slate-950 dark:text-white">Kelompokin Pro</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Masuk untuk mengelola kelas Anda</p>
      </div>

      <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 border border-rose-200 text-xs mb-4 flex items-center gap-2">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Email Institusi / Dosen</label>
          <input v-model="email" type="email" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 dark:text-slate-100" placeholder="nama@dosen.ac.id" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Kata Sandi</label>
          <input v-model="password" type="password" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 dark:text-slate-100" placeholder="••••••••" />
        </div>
        <button type="submit" :disabled="isSubmitting" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
          <i v-if="isSubmitting" class="fa-solid fa-spinner animate-spin"></i>
          Masuk Aplikasi
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs space-y-2">
        <div>
          <span class="text-slate-400">Belum punya akun? </span>
          <NuxtLink to="/register" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Daftar Akun Dosen</NuxtLink>
        </div>
        <div>
          <NuxtLink to="/forgot-password" class="text-slate-500 dark:text-slate-400 hover:underline">Lupa kata sandi Anda?</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { signInWithEmailAndPassword } from 'firebase/auth'

const { $auth } = useNuxtApp()
const isDarkMode = inject('isDarkMode')

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const handleLogin = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    await signInWithEmailAndPassword($auth, email.value, password.value)
    navigateTo('/')
  } catch (error) {
    errorMessage.value = error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' 
      ? 'Email atau kata sandi salah.' 
      : 'Gagal login. Periksa koneksi internet Anda.'
  } finally {
    isSubmitting.value = false
  }
}
</script>