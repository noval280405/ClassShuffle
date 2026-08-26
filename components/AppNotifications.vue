<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 left-4 sm:left-auto z-[100] space-y-2 sm:w-[380px]" aria-live="polite">
      <TransitionGroup name="toast">
        <div v-for="item in toasts" :key="item.id" class="flex items-start gap-3 rounded-2xl border bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-4 shadow-2xl" :class="tone[item.kind]">
          <i :class="icon[item.kind]" class="mt-0.5"></i>
          <p class="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-100">{{ item.message }}</p>
          <button v-if="item.action" @click="item.action(); dismiss(item.id)" class="inline-action text-xs font-black text-indigo-600 dark:text-indigo-300">{{ item.actionLabel || 'Undo' }}</button>
          <button @click="dismiss(item.id)" class="inline-action text-slate-400 hover:text-slate-700" aria-label="Tutup notifikasi"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </TransitionGroup>
    </div>

    <div v-if="confirmation" class="fixed inset-0 z-[110] bg-slate-950/60 backdrop-blur-sm p-4 flex items-center justify-center" @click.self="answer(false)">
      <div role="alertdialog" aria-modal="true" class="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <span class="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-500/15 text-rose-600 flex items-center justify-center mb-4"><i class="fa-solid fa-triangle-exclamation"></i></span>
        <h2 class="text-lg font-black text-slate-950 dark:text-white">{{ confirmation.title }}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-300 mt-2">{{ confirmation.message }}</p>
        <div class="grid grid-cols-2 gap-3 mt-6">
          <button @click="answer(false)" class="min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-sm">Batal</button>
          <button @click="answer(true)" class="min-h-[46px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm">Ya, lanjutkan</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, confirmation, dismiss, answer } = useNotifications();
const tone = { success: 'border-emerald-200 dark:border-emerald-500/30', error: 'border-rose-200 dark:border-rose-500/30', warning: 'border-amber-200 dark:border-amber-500/30', info: 'border-indigo-200 dark:border-indigo-500/30' };
const icon = { success: 'fa-solid fa-circle-check text-emerald-500', error: 'fa-solid fa-circle-xmark text-rose-500', warning: 'fa-solid fa-triangle-exclamation text-amber-500', info: 'fa-solid fa-circle-info text-indigo-500' };
</script>

<style scoped>
.toast-enter-active,.toast-leave-active{transition:all .25s ease}.toast-enter-from,.toast-leave-to{opacity:0;transform:translateY(-10px)}
</style>
