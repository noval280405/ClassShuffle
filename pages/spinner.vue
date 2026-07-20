<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";

// Mengambil plugin Firebase dari Nuxt App
const { $auth, $db } = useNuxtApp();

// State Otentikasi & Firebase Data
const currentUser = ref(null);
const classes = ref([]);
const activeClassId = ref(null);
const studentsListRaw = ref([]);

// State Form & Input
const newClassName = ref("");
const newStudentName = ref("");
const namesInput = ref("");

// State Roda Spinner & Urutan Giliran
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

// Kontrol Animasi Canvas
let currentAngle = 0;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

// Helper untuk membuat ID unik (slug) siswa
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Inisialisasi Firebase Auth saat komponen dipasang
onMounted(() => {
  if ($auth.currentUser) {
    currentUser.value = $auth.currentUser;
    fetchClassesFromCloud($auth.currentUser.uid);
  }
});

// ==========================================
// 1. INTEGRASI FIRESTORE (DAFTAR KELAS & SISWA)
// ==========================================

// Ambil daftar kelas dari Firestore
const fetchClassesFromCloud = async (uid) => {
  try {
    const classesCollRef = collection($db, "users_data", uid, "classes");
    const querySnapshot = await getDocs(classesCollRef);
    const localClasses = [];

    querySnapshot.forEach((docSnap) => {
      localClasses.push({ id: docSnap.id, name: docSnap.id });
    });

    classes.value = localClasses;
    if (classes.value.length > 0) {
      selectClass(classes.value[0].id);
    }
  } catch (err) {
    console.error("Gagal mengambil daftar kelas dari cloud:", err);
  }
};

// Ambil daftar siswa berdasarkan kelas yang dipilih
const selectClass = async (classId) => {
  if (isSpinning.value) return;
  activeClassId.value = classId;
  studentsListRaw.value = [];
  urutanHafalan.value = [];
  pemenangSaatIni.value = "";

  if (!currentUser.value || !classId) return;

  try {
    const studentsCollRef = collection(
      $db,
      "users_data",
      currentUser.value.uid,
      "classes",
      classId,
      "nama_siswa"
    );
    const querySnapshot = await getDocs(studentsCollRef);
    const localStudents = [];
    
    querySnapshot.forEach((docSnap) => {
      localStudents.push({ id: docSnap.id, name: docSnap.data().nama_siswa });
    });

    studentsListRaw.value = localStudents;
    namesInput.value = localStudents.map((s) => s.name).join("\n");
    
    setTimeout(() => drawWheel(), 200);
  } catch (err) {
    console.error("Gagal mengambil data siswa:", err);
  }
};

// Tambah Kelas Baru ke Firestore
const addClass = async () => {
  const name = newClassName.value.trim();
  if (!name || !currentUser.value) return;

  if (classes.value.some((c) => c.id.toLowerCase() === name.toLowerCase())) {
    alert("Nama kelas tersebut sudah ada!");
    return;
  }

  try {
    const classDocRef = doc($db, "users_data", currentUser.value.uid, "classes", name);
    await setDoc(classDocRef, { groups: "[]" });

    classes.value.push({ id: name, name: name });
    newClassName.value = "";
    selectClass(name);
  } catch (err) {
    console.error("Gagal membuat kelas baru:", err);
  }
};

// Hapus Kelas dari Firestore
const removeClass = async (id) => {
  if (confirm(`Hapus permanen seluruh data kelas ${id} dari cloud?`)) {
    try {
      const classDocRef = doc($db, "users_data", currentUser.value.uid, "classes", id);
      await deleteDoc(classDocRef);

      classes.value = classes.value.filter((c) => c.id !== id);
      activeClassId.value = classes.value.length > 0 ? classes.value[0].id : null;
      if (activeClassId.value) {
        selectClass(activeClassId.value);
      } else {
        studentsListRaw.value = [];
        namesInput.value = "";
        drawWheel();
      }
    } catch (err) {
      console.error("Gagal menghapus kelas:", err);
    }
  }
};

// Simpan/Perbarui Daftar Nama Siswa Massal dari Textarea ke Firestore
const syncStudentsFromTextarea = async () => {
  if (!activeClassId.value || !currentUser.value || isSpinning.value) return;

  const lines = namesInput.value.split("\n");
  const validNames = lines.map((n) => n.trim()).filter((n) => n.length > 0);

  try {
    const studentsCollRef = collection(
      $db,
      "users_data",
      currentUser.value.uid,
      "classes",
      activeClassId.value,
      "nama_siswa"
    );

    // 1. Hapus data siswa lama di Firestore agar tersinkronisasi sempurna
    const currentDocs = await getDocs(studentsCollRef);
    const deletePromises = currentDocs.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);

    // 2. Simpan daftar nama siswa yang baru ke Firestore
    const newStudentsList = [];
    for (const name of validNames) {
      const studentId = generateSlug(name);
      const studentDocRef = doc(
        $db,
        "users_data",
        currentUser.value.uid,
        "classes",
        activeClassId.value,
        "nama_siswa",
        studentId
      );
      await setDoc(studentDocRef, { nama_siswa: name });
      newStudentsList.push({ id: studentId, name: name });
    }

    studentsListRaw.value = newStudentsList;
    urutanHafalan.value = [];
    pemenangSaatIni.value = "";
    drawWheel();
    alert("Daftar siswa berhasil disimpan ke cloud!");
  } catch (err) {
    console.error("Gagal menyinkronkan data siswa ke Firestore:", err);
  }
};

// ==========================================
// 2. LOGIKA MESIN SPINNER CANVAS HTML5
// ==========================================

const drawWheel = () => {
  if (!process.client || !canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const list = studentsListRaw.value;
  ctx.clearRect(0, 0, 300, 300);

  if (list.length === 0) {
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.arc(150, 150, 140, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      urutanHafalan.value.length > 0 ? "Semua siswa selesai diacak!" : "Tidak ada data siswa",
      150,
      155
    );
    return;
  }

  const arc = Math.PI / (list.length / 2);

  list.forEach((student, i) => {
    const angle = currentAngle + i * arc;
    ctx.fillStyle = spinnerColors[i % spinnerColors.length];
    
    ctx.beginPath();
    ctx.arc(150, 150, 140, angle, angle + arc, false);
    ctx.lineTo(150, 150);
    ctx.fill();

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

  // Center Pin
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

const spinTheWheel = () => {
  if (studentsListRaw.value.length === 0 || isSpinning.value) return;
  
  isSpinning.value = true;
  pemenangSaatIni.value = "";
  
  spinAngleStart = Math.random() * 10 + 12;
  spinTime = 0;
  spinTimeTotal = Math.random() * 2000 + 4000;

  rotateWheel();
};

const stopRotateWheel = () => {
  clearTimeout(spinTimeout);
  isSpinning.value = false;
  
  const list = studentsListRaw.value;
  const arc = Math.PI / (list.length / 2);
  
  const degrees = (currentAngle * 180) / Math.PI + 90;
  const ardegrees = (arc * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / ardegrees) % list.length;
  
  const chosenOne = list[index].name;
  pemenangSaatIni.value = chosenOne;

  urutanHafalan.value.push(chosenOne);
  studentsListRaw.value = studentsListRaw.value.filter((s) => s.name !== chosenOne);
  
  setTimeout(() => {
    drawWheel();
  }, 1200);
};

const resetAll = () => {
  if (activeClassId.value) {
    selectClass(activeClassId.value);
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col justify-center items-center font-sans">
    <div class="w-full max-w-7xl bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl">
      
      <!-- Judul Aplikasi -->
      <div class="border-b border-slate-700 pb-4 mb-6 text-center lg:text-left">
        <h1 class="text-2xl md:text-3xl font-black tracking-tight text-indigo-400 flex items-center justify-center lg:justify-start gap-2">
          🎡 Master Spinner Hafalan (Cloud Connected)
        </h1>
        <p class="text-sm text-slate-400 mt-1">
          Terhubung langsung ke Firestore: <code class="text-xs bg-slate-900 px-2 py-0.5 rounded text-indigo-300">users_data/{uid}/classes/{classId}/nama_siswa</code>
        </p>
      </div>

      <!-- GRID RESPONSUS DESKTOP (3 KOLOM) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- KOLOM 1: MANAJEMEN KELAS & SISWA -->
        <div class="bg-slate-900/50 p-5 rounded-2xl border border-slate-700/60 h-full flex flex-col justify-between">
          <div>
            <!-- Section Pilih & Hapus Kelas -->
            <div class="mb-5 pb-4 border-b border-slate-700/80">
              <label class="font-bold text-xs text-indigo-300 tracking-wide uppercase block mb-2">
                🏫 Pilih Kelas (Cloud)
              </label>
              
              <div class="flex gap-2 mb-3">
                <select 
                  :value="activeClassId" 
                  @change="selectClass($event.target.value)"
                  :disabled="isSpinning || classes.length === 0"
                  class="flex-1 p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option v-if="classes.length === 0" value="">Belum ada kelas</option>
                  <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                    {{ cls.name }}
                  </option>
                </select>
                
                <button 
                  v-if="activeClassId"
                  @click="removeClass(activeClassId)" 
                  :disabled="isSpinning" 
                  title="Hapus Kelas Dari Cloud"
                  class="px-3 bg-rose-950/50 hover:bg-rose-900 text-rose-400 border border-rose-800/80 rounded-xl font-bold text-xs"
                >
                  🗑️
                </button>
              </div>

              <!-- Form Tambah Kelas Baru -->
              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="newClassName" 
                  placeholder="+ Tambah kelas baru..." 
                  class="flex-1 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  @keyup.enter="addClass"
                />
                <button 
                  @click="addClass" 
                  class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all"
                >
                  Buat
                </button>
              </div>
            </div>

            <!-- Section Textarea Input Siswa -->
            <div class="flex items-center justify-between mb-2">
              <label class="font-bold text-xs text-indigo-300 tracking-wide uppercase">
                📝 Daftar Siswa ({{ activeClassId || 'Kosong' }})
              </label>
              <span class="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">1 Nama = 1 Baris</span>
            </div>
            
            <textarea 
              v-model="namesInput" 
              :disabled="isSpinning || !activeClassId"
              rows="7" 
              placeholder="Paste nama murid disini..."
              class="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-mono placeholder-slate-500 resize-none transition-all duration-200"
            ></textarea>
          </div>

          <div class="mt-4 flex flex-col gap-2">
            <button 
              @click="syncStudentsFromTextarea" 
              :disabled="isSpinning || !activeClassId"
              class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow"
            >
              ☁️ SIMPAN SISWA KE CLOUD
            </button>
            <button 
              @click="resetAll" 
              :disabled="isSpinning || !activeClassId"
              class="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
            >
              🔄 RESET URUTAN SPINNER
            </button>
          </div>
        </div>

        <!-- KOLOM 2: MESIN SPINNER CANVAS -->
        <div class="flex flex-col items-center justify-center bg-slate-900/30 p-5 rounded-2xl border border-dashed border-slate-700 h-full min-h-[420px]">
          <div class="relative w-[310px] h-[310px] flex items-center justify-center p-2 rounded-full border border-indigo-500/20 bg-slate-900 shadow-inner">
            
            <!-- Jarum Penunjuk Fisik di Jam 12 -->
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 
                        border-l-[15px] border-l-transparent 
                        border-r-[15px] border-r-transparent 
                        border-t-[30px] border-t-red-500 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] animate-bounce">
            </div>
            
            <canvas ref="canvasRef" width="300" height="300" class="rounded-full shadow-2xl bg-transparent"></canvas>
          </div>

          <button 
            @click="spinTheWheel" 
            :disabled="isSpinning || studentsListRaw.length === 0"
            class="mt-6 w-full max-w-[280px] py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-40 text-white font-black text-xs tracking-widest rounded-xl shadow-lg shadow-indigo-500/10 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span v-if="isSpinning" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ isSpinning ? 'SEDANG MENGACAK...' : '🎡 PUTAR RODA SPINNER' }}
          </button>
          
          <div v-if="pemenangSaatIni" class="mt-4 p-3 bg-emerald-500 text-white font-black rounded-xl text-center shadow animate-pulse w-full max-w-[280px] text-xs tracking-wider">
            🎉 TERPILIH: {{ pemenangSaatIni }}
          </div>
        </div>

        <!-- KOLOM 3: HASIL URUTAN HAFALAN -->
        <div class="bg-slate-900/50 p-5 rounded-2xl border border-slate-700/60 h-full flex flex-col justify-between min-h-[420px]">
          <div class="w-full">
            <h3 class="font-bold text-sm text-indigo-300 tracking-wide uppercase mb-4 flex items-center justify-between">
              <span>📋 Hasil Urutan Giliran</span>
              <span class="text-[11px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                {{ urutanHafalan.length }} Terpilih
              </span>
            </h3>
            
            <div v-if="urutanHafalan.length === 0" class="border border-dashed border-slate-700 p-8 rounded-xl text-center text-xs text-slate-500">
              Belum ada antrean. Klik <strong class="text-indigo-400">Putar Roda</strong> untuk mengundi giliran!
            </div>

            <div v-else class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              <div 
                v-for="(name, index) in urutanHafalan" 
                :key="index"
                class="flex items-center gap-3 p-3 rounded-xl border border-slate-700/60 bg-slate-800/40 shadow-sm transition-all duration-300 hover:border-slate-600"
              >
                <span 
                  class="w-6 h-6 flex items-center justify-center rounded-lg font-black text-xs"
                  :class="index === 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300'"
                >
                  {{ index + 1 }}
                </span>
                
                <span class="font-bold text-sm text-slate-200 truncate">{{ name }}</span>
                
                <span v-if="index === 0" class="text-[9px] px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded font-black ml-auto uppercase tracking-wider">
                  Maju ke-1
                </span>
              </div>
            </div>
          </div>
          
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