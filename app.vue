<template>
  <div :class="{ 'dark': isDarkMode }">
    <div class="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      <div v-if="isAuthLoading" class="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <i class="fa-solid fa-circle-notch animate-spin text-4xl text-indigo-500 mb-4"></i>
        <p class="text-sm font-semibold tracking-wide text-slate-400">Memeriksa Enkripsi Sesi Dosen...</p>
      </div>

      <NuxtPage v-else />
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'

const { $auth } = useNuxtApp()
const isDarkMode = ref(true)
const isAuthLoading = ref(true)

onMounted(() => {
  const savedDarkMode = localStorage.getItem('kelompokin_darkmode')
  if (savedDarkMode !== null) isDarkMode.value = JSON.parse(savedDarkMode)

  // Middleware Global: Cek status login
  onAuthStateChanged($auth, (user) => {
    const route = useRoute()
    isAuthLoading.value = false

    if (!user) {
      // Jika belum login dan tidak di halaman auth, paksa ke halaman login
      if (route.path !== '/login' && route.path !== '/register' && route.path !== '/forgot-password') {
        navigateTo('/login')
      }
    } else {
      // Jika sudah login tapi malah buka halaman auth, arahkan ke dashboard utama
      if (route.path === '/login' || route.path === '/register' || route.path === '/forgot-password') {
        navigateTo('/')
      }
    }
  })
})

// Menyediakan state dark mode agar bisa diubah dari halaman mana saja
provide('isDarkMode', isDarkMode)
</script>