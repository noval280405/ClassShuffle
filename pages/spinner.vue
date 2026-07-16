<script setup>
import { ref, computed, onMounted, watch } from "vue";

// State input nama manual (Bisa copas langsung dipisahkan dengan Enter/Baris Baru)
const namesInput = ref(
  "Ahmad Fauzi\nBudi Santoso\nCitra Lestari\nDedi Wijaya\nEka Putri\nFahmi Idris\nGita Permata"
);

// State Roda & Urutan
const studentsListRaw = ref([]);
const urutanHafalan = ref([]);
const pemenangSaatIni = ref("");
const isSpinning = ref(false);
const canvasRef = ref(null);

// Palette Warna Roda Spinner Ceria & Kontras
const spinnerColors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", 
  "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", 
  "#7DCEA0", "#F1948A"
];

// Kontrol Animasi Roda (Non-reactive untuk performa mulus Canvas)
let currentAngle = 0;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

// Fungsi memproses input teks menjadi array nama siswa
const updateStudentsFromInput = () => {
  if (isSpinning.value) return;
  
  const lines = namesInput.value.split("\n");
  const validNames = lines
    .map(name => name.trim())
    .filter(name => name.length > 0);
    
  studentsListRaw.value = validNames.map((name, index) => ({
    id: `student-${index}`,
    name: name
  }));
  
  urutanHafalan.value = [];
  pemenangSaatIni.value = "";
  setTimeout(() => drawWheel(), 500);
};

// Fungsi Menggambar Roda di Canvas HTML5
const drawWheel = () => {
  if (!process.client || !canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const list = studentsListRaw.value;
  ctx.clearRect(0, 0, 300, 300);

  // Jika roda kosong
  if (list.length === 0) {
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.arc(150, 150, 140, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(urutanHafalan.value.length > 0 ? "Semua siswa selesai diacak!" : "Masukkan nama siswa dahulu", 150, 155);
    return;
  }

  const arc = Math.PI / (list.length / 2);

  list.forEach((student, i) => {
    const angle = currentAngle + i * arc;
    ctx.fillStyle = spinnerColors[i % spinnerColors.length];
    
    // Potongan Juring Roda
    ctx.beginPath();
    ctx.arc(150, 150, 140, angle, angle + arc, false);
    ctx.lineTo(150, 150);
    ctx.fill();

    // Teks Nama Siswa
    ctx.save();
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.translate(150 + Math.cos(angle + arc / 2) * 85, 150 + Math.sin(angle + arc / 2) * 85);
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    const displayName = student.name.length > 10 ? student.name.substring(0, 8) + ".." : student.name;
    ctx.fillText(displayName, 0, 0);
    ctx.restore();
  });

  // Pin Bulat di Tengah Roda
  ctx.beginPath();
  ctx.arc(150, 150, 22, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#6366f1";
  ctx.stroke();
};

const rotateWheel = () => {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  currentAngle += (spinAngle * Math.PI) / 180;
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
};

const easeOut = (t, b, c, d) => {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
};

// Trigger Putar Roda
const spinTheWheel = () => {
  if (studentsListRaw.value.length === 0 || isSpinning.value) return;
  
  isSpinning.value = true;
  pemenangSaatIni.value = "";
  
  spinAngleStart = Math.random() * 10 + 12;
  spinTime = 0;
  spinTimeTotal = Math.random() * 2000 + 4000; // Efek putaran dramatis 4 sampai 6 detik

  rotateWheel();
};

// Roda Berhenti
const stopRotateWheel = () => {
  clearTimeout(spinTimeout);
  isSpinning.value = false;
  
  const list = studentsListRaw.value;
  const arc = Math.PI / (list.length / 2);
  
  // Kalkulasi posisi jarum di jam 12
  const degrees = (currentAngle * 180) / Math.PI + 90;
  const ardegrees = (arc * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / ardegrees) % list.length;
  
  const chosenOne = list[index].name;
  pemenangSaatIni.value = chosenOne;

  // Masukkan ke urutan hafalan dan hapus dari roda aktif
  urutanHafalan.value.push(chosenOne);
  studentsListRaw.value = studentsListRaw.value.filter(s => s.name !== chosenOne);
  
  setTimeout(() => {
    drawWheel();
  }, 1200);
};

// Reset Roda Kembali Semula
const resetAll = () => {
  updateStudentsFromInput();
};

// Inisialisasi awal saat halaman dibuka
onMounted(() => {
  updateStudentsFromInput();
});
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col justify-center items-center font-sans">
    
    <!-- Wadah Utama Dashboard Spinner -->
    <div class="w-full max-w-7xl bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl">
      
      <!-- Judul Aplikasi -->
      <div class="border-b border-slate-700 pb-4 mb-8 text-center lg:text-left">
        <h1 class="text-2xl md:text-3xl font-black tracking-tight text-indigo-400 flex items-center justify-center lg:justify-start gap-2">
          🎡 Master Spinner Hafalan Kelas
        </h1>
        <p class="text-sm text-slate-400 mt-1">Sistem acak giliran praktis. Urutan otomatis terbentuk secara adil dari pertama sampai terakhir.</p>
      </div>

      <!-- GRID RESPONSIVITAS TINGGI (1 Kolom di Mobile, 3 Kolom Sejajar Sempurna di Desktop) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- KOLOM 1 DESKTOP: Input Data Nama Siswa -->
        <div class="bg-slate-900/50 p-5 rounded-2xl border border-slate-700/60 h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-sm text-indigo-300 tracking-wide uppercase">📝 Input Nama Kelas</h3>
              <span class="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">1 Nama = 1 Baris</span>
            </div>
            
            <textarea 
              v-model="namesInput" 
              :disabled="isSpinning"
              rows="10" 
              placeholder="Masukkan daftar nama murid disini... (Pisahkan dengan menekan Enter)"
              class="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-mono placeholder-slate-500 resize-none transition-all duration-200"
            ></textarea>
          </div>

          <div class="mt-4 flex gap-3">
            <button 
              @click="updateStudentsFromInput" 
              :disabled="isSpinning"
              class="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all tracking-wider"
            >
              🔄 SINKRONISASI DATA
            </button>
            <button 
              @click="resetAll" 
              :disabled="isSpinning"
              class="px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900 border border-rose-800 text-rose-400 font-bold text-xs rounded-xl transition-all"
            >
              RESET
            </button>
          </div>
        </div>

        <!-- KOLOM 2 DESKTOP: Mesin Spinner Roda & Jarum Penunjuk -->
        <div class="flex flex-col items-center justify-center bg-slate-900/30 p-5 rounded-2xl border border-dashed border-slate-700 h-full min-h-[420px]">
          <div class="relative w-[310px] h-[310px] flex items-center justify-center p-2 rounded-full border border-indigo-500/20 bg-slate-900 shadow-inner">
            
            <!-- Jarum Penunjuk Fisik Menggantung di Atas (Jam 12) -->
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 
                        border-l-[15px] border-l-transparent 
                        border-r-[15px] border-r-transparent 
                        border-t-[30px] border-t-red-500 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] animate-bounce">
            </div>
            
            <!-- Canvas Roda Grafis -->
            <canvas ref="canvasRef" width="300" height="300" class="rounded-full shadow-2xl bg-transparent"></canvas>
          </div>

          <!-- Tombol Putar Mekanik Roda -->
          <button 
            @click="spinTheWheel" 
            :disabled="isSpinning || studentsListRaw.length === 0"
            class="mt-6 w-full max-w-[280px] py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-40 text-white font-black text-xs tracking-widest rounded-xl shadow-lg shadow-indigo-500/10 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span v-if="isSpinning" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isSpinning ? 'SEDANG MENGACAK...' : '🎡 PUTAR RODA SPINNER' }}
          </button>
          
          <!-- Banner Animasi Pengumuman Singkat -->
          <div v-if="pemenangSaatIni" class="mt-4 p-3 bg-emerald-500 text-white font-black rounded-xl text-center shadow animate-pulse w-full max-w-[280px] text-xs tracking-wider">
            🎉 TERPILIH: {{ pemenangSaatIni }}
          </div>
        </div>

        <!-- KOLOM 3 DESKTOP: Output Antrean Giliran Hafalan -->
        <div class="bg-slate-900/50 p-5 rounded-2xl border border-slate-700/60 h-full flex flex-col justify-between min-h-[420px]">
          <div class="w-full">
            <h3 class="font-bold text-sm text-indigo-300 tracking-wide uppercase mb-4 flex items-center justify-between">
              <span>📋 Hasil Urutan Giliran Hafalan</span>
              <span class="text-[11px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                {{ urutanHafalan.length }} Terpilih
              </span>
            </h3>
            
            <!-- Tampilan Jika Data Belum Diputar -->
            <div v-if="urutanHafalan.length === 0" class="border border-dashed border-slate-700 p-8 rounded-xl text-center text-xs text-slate-500">
              Belum ada antrean yang terbentuk. Klik tombol <strong class="text-indigo-400">Putar Roda</strong> untuk mengundi urutan pertama secara adil!
            </div>

            <!-- List Pemenang Urutan Ke-1 Sampai Terakhir -->
            <div v-else class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              <div 
                v-for="(name, index) in urutanHafalan" 
                :key="index"
                class="flex items-center gap-3 p-3 rounded-xl border border-slate-700/60 bg-slate-800/40 shadow-sm transition-all duration-300 hover:border-slate-600"
              >
                <!-- Badge Nomor Urut -->
                <span 
                  class="w-6 h-6 flex items-center justify-center rounded-lg font-black text-xs"
                  :class="index === 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300'"
                >
                  {{ index + 1 }}
                </span>
                
                <!-- Nama Murid -->
                <span class="font-bold text-sm text-slate-200 truncate">{{ name }}</span>
                
                <!-- Label Khusus Maju Pertama -->
                <span v-if="index === 0" class="text-[9px] px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded font-black ml-auto uppercase tracking-wider">
                  Maju ke-1
                </span>
              </div>
            </div>
          </div>
          
          <!-- Informasi Status Sisa Anak di Dalam Roda -->
          <div class="mt-4 p-3 bg-slate-900 rounded-xl text-[11px] flex justify-between items-center text-slate-400 border border-slate-800">
            <span>Sisa di dalam roda: <strong class="text-indigo-400 font-bold">{{ studentsListRaw.length }} anak</strong></span>
            <span v-if="studentsListRaw.length === 0 && urutanHafalan.length > 0" class="text-emerald-400 font-black tracking-wide">
              SEMUA SELESAI! ✨
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>