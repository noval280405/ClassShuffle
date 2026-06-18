<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
    <header class="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40 py-4 mb-8 shadow-lg">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <span class="text-3xl animate-pulse">🌀</span>
          <div>
            <h1
              class="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              Kelompokin
              <span
                class="text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded ml-2">v2.1</span>
            </h1>
            <p class="text-xs text-slate-400">
              Smart Group Randomizer & Manager
            </p>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 max-w-6xl">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h2 class="text-lg font-bold mb-3 flex items-center gap-2 text-white">
              🧑‍🎓 Input & Daftar Siswa
            </h2>
            <p class="text-xs text-slate-400 mb-3">
              Ketik nama murid lalu tekan Enter atau klik Tambah.
            </p>

            <form @submit.prevent="addStudent" class="flex gap-2 mb-4">
              <input v-model="newStudentName" type="text"
                class="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder-slate-500"
                placeholder="Nama murid baru..." />
              <button type="submit"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-sm font-bold transition flex items-center justify-center shadow-md shadow-indigo-900/20">
                Tambah
              </button>
            </form>

            <div class="mt-4 bg-slate-900/60 rounded-xl p-4 border border-slate-700/50 space-y-3">
              <div class="flex justify-between text-xs font-medium border-b border-slate-700 pb-2">
                <span class="text-slate-400">Total Terdaftar:</span>
                <span class="text-white font-bold">{{ studentsList.length }} Siswa</span>
              </div>

              <div v-if="studentsList.length > 0"
                class="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs">
                <div v-for="(student, index) in studentsList" :key="index"
                  class="bg-slate-800 p-2.5 rounded-xl border border-slate-700/50 flex flex-col gap-2">
                  <div class="flex justify-between items-center gap-2">
                    <div v-if="editingIndex === index" class="flex-1 flex gap-1">
                      <input v-model="editingName" type="text"
                        class="w-full bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-xs text-slate-200 outline-none"
                        @keyup.enter="saveEdit(index)" />
                      <button @click="saveEdit(index)" class="bg-emerald-600 p-1 rounded text-[10px] font-bold">
                        Simpan
                      </button>
                      <button @click="cancelEdit" class="bg-slate-700 p-1 rounded text-[10px]">
                        Batal
                      </button>
                    </div>

                    <div v-else class="flex-1 flex items-center justify-between min-w-0">
                      <span class="truncate font-medium pr-2" :class="student.hasGroup
                          ? 'text-slate-400 line-through'
                          : 'text-slate-200'
                        ">
                        {{ student.name }}
                      </span>
                      <span class="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider" :class="student.hasGroup
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        ">
                        {{ student.hasGroup ? "Sudah" : "Belum" }}
                      </span>
                    </div>

                    <div v-if="editingIndex !== index" class="flex items-center gap-1 shrink-0">
                      <button @click="startEdit(index, student.name)" title="Edit nama"
                        class="text-slate-400 hover:text-indigo-400 p-1 hover:bg-indigo-500/10 rounded transition">
                        ✏️
                      </button>
                      <button @click="deleteStudentFully(index, student.name)" title="Hapus permanen siswa"
                        class="text-slate-400 hover:text-rose-400 p-1 hover:bg-rose-500/10 rounded transition">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-center text-slate-500 py-4 text-xs">
                Belum ada siswa dimasukkan.
              </p>
            </div>
          </div>

          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 class="font-bold text-base mb-4 text-white flex items-center gap-2">
              ⚙ Pengaturan Acak
            </h3>

            <div class="mb-4">
              <label class="block text-xs font-semibold text-slate-400 mb-1.5">Metode Pembagian</label>
              <select v-model="divideMethod"
                class="w-full bg-slate-900 border border-slate-600 rounded-xl p-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="groupCount">Berdasarkan Jumlah Kelompok</option>
                <option value="studentCount">
                  Berdasarkan Jumlah Anggota per Kelompok
                </option>
              </select>
            </div>

            <div class="mb-6">
              <label class="block text-xs font-semibold text-slate-400 mb-1.5">
                {{
                  divideMethod === "groupCount"
                    ? "Target Jumlah Kelompok"
                    : "Jumlah Anggota per Kelompok"
                }}
              </label>
              <input type="number" v-model.number="targetNumber" min="1"
                class="w-full bg-slate-900 border border-slate-600 rounded-xl p-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <button @click="generateGroups" :disabled="isSpinning || studentsList.length === 0"
              class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
              <span v-if="isSpinning" class="animate-spin text-lg">🌀</span>
              {{ isSpinning ? "Mengacak..." : "🔥 Acak Kelompok!" }}
            </button>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div v-if="groups.length === 0 && !isSpinning"
            class="bg-slate-800 border-2 border-dashed border-slate-700 rounded-2xl p-16 text-center shadow-xl">
            <span class="text-5xl block mb-4">✨</span>
            <p class="text-slate-300 font-semibold text-lg">
              Siap Memulai Pembagian Kelompok?
            </p>
            <p class="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              Tulis daftar murid di sebelah kiri, tentukan setelan, lalu tekan
              tombol Acak Kelompok.
            </p>
          </div>

          <div v-if="isSpinning"
            class="bg-slate-800 border border-slate-700 rounded-2xl p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
            <div class="w-16 h-16 border-4 border-t-purple-500 border-indigo-500/20 rounded-full animate-spin"></div>
            <p
              class="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Menghitung Probabilitas Adil...
            </p>
          </div>

          <div v-if="groups.length > 0 && !isSpinning" class="space-y-6">
            <div
              class="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex justify-between items-center shadow-xl">
              <div>
                <h2 class="text-lg font-bold text-white">🎉 Hasil Kelompok</h2>
                <p class="text-xs text-slate-400">
                  Terbentuk {{ groups.length }} kelompok. Anda bisa mengeluarkan
                  siswa dari kelompok menggunakan tanda silang.
                </p>
              </div>
              <button @click="openShareModal"
                class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-md shadow-emerald-900/40 flex items-center gap-2">
                🔗 Bagikan Link ke WA
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(group, idx) in groups" :key="idx"
                class="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md hover:border-slate-600 transition flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-center border-b border-slate-700 pb-3 mb-3">
                    <h3
                      class="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 text-lg">
                      Kelompok {{ idx + 1 }}
                    </h3>
                    <span
                      class="text-xs bg-slate-900 px-2.5 py-1 rounded-full text-slate-400 border border-slate-700 font-medium">
                      {{ group.length }} Anggota
                    </span>
                  </div>

                  <ul class="space-y-2">
                    <li v-for="(studentName, sIdx) in group" :key="studentName"
                      class="group/item flex justify-between items-center text-sm bg-slate-900/60 hover:bg-slate-900 text-slate-300 px-3 py-2.5 rounded-xl border border-slate-700/50 transition">
                      <span class="font-medium truncate max-w-[80%]">{{
                        studentName
                        }}</span>

                      <button @click="removeStudentFromGroup(idx, sIdx)" title="Keluarkan dari kelompok"
                        class="text-slate-500 hover:text-rose-400 opacity-100 md:opacity-0 group-hover/item:opacity-100 transition p-1 hover:bg-rose-500/10 rounded-lg">
                        ❌
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <ShareModal :is-open="isModalOpen" :share-url="generatedShareUrl" @close="isModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import ShareModal from "~/components/ShareModal.vue";

// State Array baru untuk menyimpan list nama tunggal
const students = ref([]);
const newStudentName = ref("");

// State untuk keperluan inline edit nama siswa
const editingIndex = ref(null);
const editingName = ref("");

const divideMethod = ref("groupCount");
const targetNumber = ref(5);
const isSpinning = ref(false);
const groups = ref([]);

const isModalOpen = ref(false);
const generatedShareUrl = ref("");

// Computed property untuk memetakan nama siswa & status dapet kelompok
const studentsList = computed(() => {
  return students.value.map((name) => {
    const foundInGroup = groups.value.some((group) => group.includes(name));
    return {
      name: name,
      hasGroup: foundInGroup,
    };
  });
});

// Lifecycle: Ambil data array dari LocalStorage saat app diload
onMounted(() => {
  const savedData = localStorage.getItem("kelompokin_array_v3");
  if (savedData) {
    students.value = JSON.parse(savedData);
  }
});

// Simpan data otomatis ke localStorage tiap ada perubahan list siswa
watch(
  students,
  (newVal) => {
    localStorage.setItem("kelompokin_array_v3", JSON.stringify(newVal));
  },
  { deep: true },
);

// Fungsi Tambah Siswa ke Array
const addStudent = () => {
  const name = newStudentName.value.trim();
  if (!name) return;

  // Validasi agar tidak ada nama duplikat yang sama persis
  if (students.value.includes(name)) {
    alert("Nama siswa ini sudah terdaftar!");
    return;
  }

  students.value.push(name);
  newStudentName.value = ""; // Reset text field
};

// Fungsi Trigger Start Edit Nama Siswa
const startEdit = (index, currentName) => {
  editingIndex.value = index;
  editingName.value = currentName;
};

// Fungsi Simpan Hasil Edit Nama Siswa
const saveEdit = (index) => {
  const cleanNewName = editingName.value.trim();
  if (!cleanNewName) return;

  const oldName = students.value[index];

  // Update data di array utama siswa
  students.value[index] = cleanNewName;

  // Update juga nama di dalam kartu kelompok aktif agar tidak hilang sinkronisasinya
  groups.value = groups.value.map((group) =>
    group.map((member) => (member === oldName ? cleanNewName : member)),
  );

  cancelEdit();
};

// Batalkan Edit
const cancelEdit = () => {
  editingIndex.value = null;
  editingName.value = "";
};

// Fungsi Hapus Permanen Siswa dari Daftar & Kelompok
const deleteStudentFully = (index, studentName) => {
  if (confirm(`Hapus ${studentName} secara permanen dari sistem?`)) {
    // 1. Hapus dari list daftar utama siswa
    students.value.splice(index, 1);

    // 2. Bersihkan juga dari grup jika dia sudah masuk grup
    groups.value = groups.value
      .map((group) => group.filter((member) => member !== studentName))
      .filter((group) => group.length > 0); // Hapus grup jika kosong

    cancelEdit();
  }
};

// Algoritma Pengacakan Berdasarkan State Array Tunggal Siswa
const generateGroups = () => {
  if (students.value.length === 0) return;
  isSpinning.value = true;
  groups.value = [];

  setTimeout(() => {
    // Ambil salinan array nama murni
    let poolNames = [...students.value];

    // Fisher-Yates Shuffle
    for (let i = poolNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [poolNames[i], poolNames[j]] = [poolNames[j], poolNames[i]];
    }

    const localGroups = [];

    if (divideMethod.value === "groupCount") {
      const numGroups = Math.max(1, targetNumber.value);
      for (let i = 0; i < numGroups; i++) {
        localGroups.push([]);
      }
      poolNames.forEach((name, index) => {
        localGroups[index % numGroups].push(name);
      });
    } else {
      const sizePerGroup = Math.max(1, targetNumber.value);
      while (poolNames.length > 0) {
        localGroups.push(poolNames.splice(0, sizePerGroup));
      }
    }

    groups.value = localGroups.filter((g) => g.length > 0);
    isSpinning.value = false;
  }, 1200);
};

// Keluarkan siswa dari kelompok (Otomatis mendeteksi status 'Belum dapet kelompok' kembali)
const removeStudentFromGroup = (groupIndex, studentIndex) => {
  groups.value[groupIndex].splice(studentIndex, 1);

  if (groups.value[groupIndex].length === 0) {
    groups.value.splice(groupIndex, 1);
  }
};

// Fitur Enkripsi Share Link
const openShareModal = () => {
  const base64Data = btoa(JSON.stringify(groups.value));
  const origin = window.location.origin;
  generatedShareUrl.value = `${origin}?data=${base64Data}`;
  isModalOpen.value = true;
};
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6366f1;
}
</style>
