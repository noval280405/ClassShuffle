<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl transition-colors duration-300"
    >
      <div class="flex items-center gap-2 text-slate-950 dark:text-white mb-2">
        <i class="fa-solid fa-bullhorn text-emerald-500 text-lg"></i>
        <h3 class="text-lg font-bold">Bagikan Hasil Kelompok</h3>
      </div>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Salin tautan di bawah ini dan bagikan ke grup WhatsApp agar siswa bisa
        melihat kelompok mereka.
      </p>

      <div class="flex gap-2 mb-4">
        <input
          type="text"
          readonly
          :value="shareUrl"
          class="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
        />
        <button
          @click="copyToClipboard"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
        >
          <i :class="copied ? 'fa-solid fa-check' : 'fa-solid fa-copy'"></i>
          {{ copied ? "Tersalin!" : "Salin" }}
        </button>
      </div>

      <div class="flex justify-end">
        <button
          @click="$emit('close')"
          class="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  isOpen: Boolean,
  shareUrl: String,
});

defineEmits(["close"]);
const copied = ref(false);

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.shareUrl);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>
