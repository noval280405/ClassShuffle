<template>
  <div :class="{ 'dark': isDarkMode }">
    <div class="app-shell min-h-screen text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      <div v-if="isAuthLoading" class="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <i class="fa-solid fa-circle-notch animate-spin text-4xl text-indigo-500 mb-4"></i>
        <p class="text-sm font-semibold tracking-wide text-slate-400">Memeriksa Enkripsi Sesi Dosen...</p>
      </div>

      <NuxtPage v-else />
      <AppNotifications />
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
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

watch(isDarkMode, (value) => {
  if (process.client) localStorage.setItem('kelompokin_darkmode', JSON.stringify(value))
})

// Menyediakan state dark mode agar bisa diubah dari halaman mana saja
provide('isDarkMode', isDarkMode)
</script>

<style>
:root {
  color-scheme: light;
  --brand: #4f46e5;
  --brand-strong: #4338ca;
}

.dark { color-scheme: dark; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  min-width: 320px;
  -webkit-font-smoothing: antialiased;
}

.app-shell {
  background:
    radial-gradient(circle at 8% 4%, rgba(99, 102, 241, .13), transparent 26rem),
    radial-gradient(circle at 92% 20%, rgba(236, 72, 153, .10), transparent 24rem),
    #f8fafc;
}

.dark .app-shell {
  background:
    radial-gradient(circle at 8% 4%, rgba(99, 102, 241, .16), transparent 28rem),
    radial-gradient(circle at 92% 20%, rgba(168, 85, 247, .12), transparent 26rem),
    #0f172a;
}

button, a, input, select, textarea { -webkit-tap-highlight-color: transparent; }

button, [role="button"] { touch-action: manipulation; }

button:focus-visible, a:focus-visible, input:focus-visible,
select:focus-visible, textarea:focus-visible {
  outline: 3px solid rgba(99, 102, 241, .32) !important;
  outline-offset: 2px;
}

button:disabled { opacity: .62; box-shadow: none !important; }

input, select, textarea { min-height: 44px; }

@media (max-width: 640px) {
  button:not(.inline-action), a.rounded-xl { min-height: 44px; }
  input, select, textarea { font-size: 16px !important; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}
</style>
