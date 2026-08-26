// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon' // <-- Tambahkan ini
  ],
  // Masukkan konfigurasi Tailwind langsung di sini agar Nuxt tidak bingung
  tailwindcss: {
    config: {
      darkMode: 'class'
    }
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        }
      ],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          name: 'theme-color',
          content: '#4f46e5'
        }
      ]
    }
  }
})
