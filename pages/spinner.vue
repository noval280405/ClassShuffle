<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";

// Import Ikon Lucide untuk tampilan premium
import {
  Disc,
  School,
  Trash2,
  Plus,
  FileText,
  CloudUpload,
  RotateCcw,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Loader2,
  Users
} from "lucide-vue-next";

// Mengambil plugin Firebase dari Nuxt App
const { $auth, $db } = useNuxtApp();

// State Otentikasi & Firebase Data
const currentUser = ref(null);
const classes = ref([]);
const activeClassId = ref(null);
const studentsListRaw = ref([]);

// State Form & Input
const newClassName = ref("");
const namesInput = ref("");

// State Roda Spinner & Urutan Giliran
const urutanHafalan = ref([]);
const pemenangSaatIni = ref("");
const isSpinning = ref(false);
const canvasRef = ref(null);

// Palette Warna Roda Spinner Elegant & Kontras
const spinnerColors = [
  "#6366F1", "#3B82F6", "#0EA5E9", "#10B981", 
  "#8B5CF6", "#EC4899", "#F59E0B", "#14B8A6", 
  "#64748B", "#F43F5E"
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

    const currentDocs = await getDocs(studentsCollRef);
    const deletePromises = currentDocs.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);

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
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(150, 150, 140, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      urutanHafalan.value.length > 0 ? "Semua siswa selesai diacak" : "Tidak ada data siswa",
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
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.translate(150 + Math.cos(angle + arc / 2) * 85, 150 + Math.sin(angle + arc / 2) * 85);
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    
    ctx.font = "600 11px sans-serif";
    ctx.textAlign = "center";
    const displayName = student.name.length > 10 ? student.name.substring(0, 8) + ".." : student.name;
    ctx.fillText(displayName, 0, 0);
    ctx.restore();
  });

  // Pin Lingkaran Tengah
  ctx.beginPath();
  ctx.arc(150, 150, 22, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#0f172a";
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
  <div class="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col justify-center items-center font-sans">
    <div class="w-full max-w-7xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
      
      <!-- Header -->
      <div class="border-b border-slate-800 pb-5 mb-6 text-center lg:text-left flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center lg:justify-start gap-3">
            <div class="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Disc class="w-6 h-6 animate-spin-slow" />
            </div>
            Random Spinner System
          </h1>
          <p class="text-xs text-slate-400 mt-1 flex items-center justify-center lg:justify-start gap-2">
            <span>Terhubung ke Cloud Firestore:</span>
            <code class="text-[11px] bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800 text-indigo-300 font-mono">
              users_data/{uid}/classes/{classId}/nama_siswa
            </code>
          </p>
        </div>
      </div>

      <!-- Grid 3 Kolom Desktop -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- KOLOM 1: MANAJEMEN KELAS & SISWA -->
        <div class="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/80 h-full flex flex-col justify-between">
          <div>
            <!-- Section Pilih Kelas -->
            <div class="mb-5 pb-5 border-b border-slate-800">
              <label class="font-semibold text-xs text-indigo-400 tracking-wider uppercase flex items-center gap-2 mb-2.5">
                <School class="w-4 h-4" /> Pilih Kelas
              </label>
              
              <div class="flex gap-2 mb-3">
                <select 
                  :value="activeClassId" 
                  @change="selectClass($event.target.value)"
                  :disabled="isSpinning || classes.length === 0"
                  class="flex-1 p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-semibold text-slate-200 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
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
                  class="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>

              <!-- Input Tambah Kelas Baru -->
              <div class="flex gap-2">
                <input 
                  type="text" 
                  v-model="newClassName" 
                  placeholder="Nama kelas baru..." 
                  class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  @keyup.enter="addClass"
                />
                <button 
                  @click="addClass" 
                  class="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-all flex items-center gap-1"
                >
                  <Plus class="w-3.5 h-3.5" /> Buat
                </button>
              </div>
            </div>

            <!-- Section Input Nama Siswa -->
            <div class="flex items-center justify-between mb-2.5">
              <label class="font-semibold text-xs text-indigo-400 tracking-wider uppercase flex items-center gap-2">
                <FileText class="w-4 h-4" /> Daftar Siswa
              </label>
              <span class="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">1 Nama / Baris</span>
            </div>
            
            <textarea 
              v-model="namesInput" 
              :disabled="isSpinning || !activeClassId"
              rows="7" 
              placeholder="Masukkan nama siswa..."
              class="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-200 font-mono placeholder-slate-600 resize-none transition-all"
            ></textarea>
          </div>

          <!-- Tombol Aksi -->
          <div class="mt-5 flex flex-col gap-2">
            <button 
              @click="syncStudentsFromTextarea" 
              :disabled="isSpinning || !activeClassId"
              class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <CloudUpload class="w-4 h-4" /> Simpan Ke Cloud
            </button>
            <button 
              @click="resetAll" 
              :disabled="isSpinning || !activeClassId"
              class="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw class="w-3.5 h-3.5" /> Reset Urutan
            </button>
          </div>
        </div>

        <!-- KOLOM 2: SPINNER CANVAS -->
        <div class="flex flex-col items-center justify-center bg-slate-950/40 p-6 rounded-2xl border border-slate-800 h-full min-h-[440px]">
          <div class="relative w-[310px] h-[310px] flex items-center justify-center p-2 rounded-full border border-slate-800 bg-slate-900 shadow-2xl">
            
            <!-- Jarum Penunjuk Fisik -->
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-0 h-0 
                        border-l-[14px] border-l-transparent 
                        border-r-[14px] border-r-transparent 
                        border-t-[28px] border-t-rose-500 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
            </div>
            
            <canvas ref="canvasRef" width="300" height="300" class="rounded-full shadow-inner bg-transparent"></canvas>
          </div>

          <button 
            @click="spinTheWheel" 
            :disabled="isSpinning || studentsListRaw.length === 0"
            class="mt-6 w-full max-w-[280px] py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isSpinning" class="w-4 h-4 animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            {{ isSpinning ? 'MENGACAK...' : 'PUTAR RODA' }}
          </button>
          
          <div v-if="pemenangSaatIni" class="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl text-center w-full max-w-[280px] text-xs tracking-wide flex items-center justify-center gap-2">
            <CheckCircle2 class="w-4 h-4" /> Terpilih: {{ pemenangSaatIni }}
          </div>
        </div>

        <!-- KOLOM 3: HASIL URUTAN -->
        <div class="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 h-full flex flex-col justify-between min-h-[440px]">
          <div class="w-full">
            <h3 class="font-semibold text-xs text-indigo-400 tracking-wider uppercase mb-4 flex items-center justify-between">
              <span class="flex items-center gap-2">
                <ClipboardList class="w-4 h-4" /> Hasil Giliran
              </span>
              <span class="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/20">
                {{ urutanHafalan.length }} Terpilih
              </span>
            </h3>
            
            <div v-if="urutanHafalan.length === 0" class="border border-dashed border-slate-800 p-8 rounded-xl text-center text-xs text-slate-500">
              Belum ada antrean. Klik <strong class="text-slate-300">Putar Roda</strong> untuk mengundi.
            </div>

            <div v-else class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              <div 
                v-for="(name, index) in urutanHafalan" 
                :key="index"
                class="flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60 transition-all hover:border-slate-700"
              >
                <span 
                  class="w-6 h-6 flex items-center justify-center rounded-lg font-bold text-xs"
                  :class="index === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'"
                >
                  {{ index + 1 }}
                </span>
                
                <span class="font-medium text-xs text-slate-200 truncate">{{ name }}</span>
                
                <span v-if="index === 0" class="text-[9px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-semibold ml-auto uppercase tracking-wider">
                  Maju Utama
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-4 p-3 bg-slate-900/80 rounded-xl text-[11px] flex justify-between items-center text-slate-400 border border-slate-800">
            <span class="flex items-center gap-1.5">
              <Users class="w-3.5 h-3.5 text-slate-500" /> Sisa di roda: <strong class="text-slate-200 font-semibold">{{ studentsListRaw.length }}</strong>
            </span>
            <span v-if="studentsListRaw.length === 0 && urutanHafalan.length > 0" class="text-emerald-400 font-bold text-[10px] tracking-wide uppercase">
              Selesai All
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>