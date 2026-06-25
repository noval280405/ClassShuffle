<template>
  <div v-if="currentUser">
    <header
      class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 py-4 mb-8 shadow-sm dark:shadow-lg"
    >
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <i
            class="fa-solid fa-shuffle text-2xl text-indigo-600 dark:text-indigo-400"
          ></i>
          <div>
            <h1
              class="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight"
            >
              Kelompokin
              <span
                class="text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded ml-2"
                >v4.0 cloud</span
              >
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Multi-User Cloud Platform
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden md:block text-right">
            <p
              class="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]"
            >
              {{ currentUser.email }}
            </p>
            <p
              class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"
            >
              <i class="fa-solid fa-cloud"></i> Sesi Cloud Aktif
            </p>
          </div>
          <button
            @click="isDarkMode = !isDarkMode"
            class="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-amber-400 w-9 h-9 flex items-center justify-center transition"
            title="Ubah Tema"
          >
            <i :class="isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>
          <button
            @click="handleLogout"
            class="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 w-9 h-9 flex items-center justify-center border border-rose-200/50 transition"
            title="Keluar Aplikasi"
          >
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 max-w-6xl">
      <section
        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xl mb-8"
      >
        <h2
          class="text-lg font-bold mb-4 flex items-center gap-2 text-slate-950 dark:text-white"
        >
          <i class="fa-solid fa-graduation-cap text-indigo-500"></i> Manajemen
          Kelas Dosen
        </h2>

        <div class="flex flex-col md:flex-row gap-4 items-end">
          <form @submit.prevent="addClass" class="w-full md:w-1/3">
            <label
              class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
              >Buat Kelas Baru</label
            >
            <div class="flex gap-2">
              <input
                v-model="newClassName"
                type="text"
                class="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder-slate-400"
                placeholder="Contoh: 1A"
              />
              <button
                type="submit"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-sm font-bold transition flex items-center gap-1 shadow-md shrink-0"
              >
                <i class="fa-solid fa-plus"></i> Tambah
              </button>
            </div>
          </form>

          <div class="w-full md:w-2/3">
            <label
              class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
              >Pilih Kelas Aktif</label
            >
            <div class="flex flex-wrap gap-2">
              <div
                v-for="cls in classes"
                :key="cls.id"
                class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition cursor-pointer"
                :class="
                  activeClassId === cls.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                "
                @click="selectClass(cls.id)"
              >
                <span>{{ cls.name }}</span>
                <button
                  @click.stop="removeClass(cls.id, cls.name)"
                  class="text-slate-400 hover:text-rose-400 transition ml-1"
                  title="Hapus kelas"
                >
                  <i class="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
              <p
                v-if="classes.length === 0"
                class="text-sm text-slate-400 italic py-2"
              >
                Belum ada data kelas di cloud. Silakan buat di sebelah kiri.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div v-if="activeClass" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-4 space-y-6">
          <div
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h2
              class="text-lg font-bold mb-1 flex items-center gap-2 text-slate-950 dark:text-white"
            >
              <i class="fa-solid fa-users text-purple-500"></i> Daftar Siswa
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Input nama mahasiswa untuk kelas:
              <span class="text-indigo-500 font-bold">{{
                activeClass.name
              }}</span>
            </p>

            <form @submit.prevent="addStudent" class="flex gap-2 mb-4">
              <input
                v-model="newStudentName"
                type="text"
                class="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder-slate-400"
                placeholder="Ketik nama mahasiswa..."
              />
              <button
                type="submit"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-xl text-sm font-bold transition flex items-center justify-center shadow-md shrink-0 w-11"
              >
                <i class="fa-solid fa-user-plus"></i>
              </button>
            </form>

            <div
              class="mt-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 space-y-3"
            >
              <div
                class="flex justify-between text-xs font-medium border-b border-slate-200 dark:border-slate-700 pb-2"
              >
                <span class="text-slate-500 dark:text-slate-400"
                  >Total Terdaftar:</span
                >
                <span class="text-slate-950 dark:text-white font-bold"
                  >{{ studentsList?.length || 0 }} Mahasiswa</span
                >
              </div>

              <div
                v-if="studentsList && studentsList.length > 0"
                class="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs"
              >
                <div
                  v-for="(student, index) in studentsList"
                  :key="student.id"
                  class="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center"
                >
                  <div class="flex justify-between items-center gap-2">
                    <div
                      v-if="editingIndex === index"
                      class="flex-1 flex gap-1"
                    >
                      <input
                        v-model="editingName"
                        type="text"
                        class="w-full bg-slate-100 dark:bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-200 outline-none"
                        @keyup.enter="saveEdit(index)"
                      />
                      <button
                        @click="saveEdit(index)"
                        class="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold"
                      >
                        Simpan
                      </button>
                      <button
                        @click="cancelEdit"
                        class="bg-slate-400 dark:bg-slate-700 text-white px-2 py-0.5 rounded text-[10px]"
                      >
                        Batal
                      </button>
                    </div>

                    <div
                      v-else
                      class="flex-1 flex items-center justify-between min-w-0"
                    >
                      <span
                        class="truncate font-medium pr-2"
                        :class="
                          student.hasGroup
                            ? 'text-slate-400 dark:text-slate-500 line-through'
                            : 'text-slate-800 dark:text-slate-200'
                        "
                        >{{ student.name }}</span
                      >
                      <span
                        class="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border"
                        :class="
                          student.hasGroup
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                        "
                        >{{ student.hasGroup ? "Sudah" : "Belum" }}</span
                      >
                    </div>

                    <div
                      v-if="editingIndex !== index"
                      class="flex items-center gap-1 shrink-0"
                    >
                      <button
                        @click="startEdit(index, student.name)"
                        class="text-slate-400 hover:text-indigo-500 p-1 rounded transition"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="deleteStudentFully(index, student.name)"
                        class="text-slate-400 hover:text-rose-500 p-1 rounded transition"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-center text-slate-400 py-4 text-xs italic">
                Belum ada data mahasiswa.
              </p>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h3
              class="font-bold text-base mb-4 text-slate-950 dark:text-white flex items-center gap-2"
            >
              <i class="fa-solid fa-sliders text-indigo-500"></i> Setelan
              Pembagian
            </h3>
            <div class="mb-4">
              <label
                class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
                >Metode Pembagian</label
              >
              <select
                v-model="divideMethod"
                class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-200 outline-none"
              >
                <option value="groupCount">Berdasarkan Jumlah Kelompok</option>
                <option value="studentCount">
                  Berdasarkan Anggota per Kelompok
                </option>
              </select>
            </div>
            <div class="mb-6">
              <label
                class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
                >{{
                  divideMethod === "groupCount"
                    ? "Target Jumlah Kelompok"
                    : "Jumlah Anggota per Kelompok"
                }}</label
              >
              <input
                type="number"
                v-model.number="targetNumber"
                min="1"
                class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-200 outline-none"
              />
            </div>
            <button
              @click="generateGroups"
              :disabled="isSpinning || studentsListRaw.length === 0"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <i v-if="isSpinning" class="fa-solid fa-spinner animate-spin"></i>
              <i v-else class="fa-solid fa-wand-magic-sparkles"></i>
              {{ isSpinning ? "Mengacak Kelas..." : "Acak Kelompok!" }}
            </button>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div
            v-if="groups.length === 0 && !isSpinning"
            class="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center shadow-xl"
          >
            <i
              class="fa-solid fa-layer-group text-5xl text-slate-300 dark:text-slate-600 block mx-auto mb-4"
            ></i>
            <p class="text-slate-700 dark:text-slate-300 font-semibold text-lg">
              Kelompok Belum Diacak
            </p>
          </div>

          <div
            v-if="isSpinning"
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-xl"
          >
            <i
              class="fa-solid fa-arrows-rotate text-4xl text-indigo-500 animate-spin"
            ></i>
            <p
              class="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse"
            >
              Menyusun Kombinasi Adil...
            </p>
          </div>

          <div v-if="groups.length > 0 && !isSpinning" class="space-y-4">
            <div
              class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-md"
            >
              <span
                class="text-xs font-semibold text-slate-500 dark:text-slate-400"
                >Opsi Ekspor Hasil Kelompok:</span
              >
              <div class="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                <button
                  @click="downloadAsPDF"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-file-pdf"></i> PDF
                </button>

                <button
                  @click="downloadAsImage"
                  class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-file-image"></i> Gambar (PNG)
                </button>

                <!-- <button
                  @click="openShareModal"
                  class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-share-nodes"></i> Bagikan WA
                </button> -->
              </div>
            </div>

            <div
              id="grup-terbentuk-area"
              class="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-6"
            >
              <div
                class="border-b border-slate-200 dark:border-slate-700 pb-4 text-center sm:text-left"
              >
                <h2
                  class="text-3xl font-black tracking-tight text-slate-950 dark:text-white uppercase"
                >
                  DAFTAR KELOMPOK - KELAS {{ activeClass.name }}
                </h2>
                <p
                  class="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1"
                >
                  Aplikasi Kelompokin Cloud Platform
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(group, idx) in groups"
                  :key="idx"
                  class="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm"
                >
                  <div
                    class="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-2"
                  >
                    <h3
                      class="font-extrabold text-base text-indigo-600 dark:text-indigo-400"
                    >
                      Kelompok {{ idx + 1 }}
                    </h3>
                    <span
                      class="text-xs font-bold text-slate-400 bg-slate-200/50 dark:bg-slate-900 px-2 py-0.5 rounded-md"
                      >{{ group.length }} Anggota</span
                    >
                  </div>
                  <ul class="space-y-1.5">
                    <li
                      v-for="(studentName, sIdx) in group"
                      :key="studentName"
                      class="text-xs font-medium flex justify-between items-center bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700"
                    >
                      <span class="text-slate-800 dark:text-slate-200">{{
                        studentName
                      }}</span>
                      <button
                        @click="removeStudentFromGroup(idx, sIdx)"
                        class="text-slate-400 hover:text-rose-500 text-[10px] export-hide"
                      >
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center shadow-xl"
      >
        <i
          class="fa-solid fa-arrow-pointer text-5xl text-indigo-500 block mx-auto mb-4 animate-bounce"
        ></i>
        <h3 class="text-lg font-bold text-slate-950 dark:text-white">
          Pilih atau Buat Kelas Terlebih Dahulu
        </h3>
        <p class="text-sm text-slate-400 mt-2">
          Gunakan opsi manajemen kelas di atas untuk mulai beroperasi.
        </p>
      </div>
    </main>

    <ShareModal
      :is-open="isModalOpen"
      :share-url="generatedShareUrl"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import ShareModal from "~/components/ShareModal.vue";

const { $auth, $db } = useNuxtApp();
const isDarkMode = inject("isDarkMode");

// State Otentikasi
const currentUser = ref(null);

// State Data Dashboard
const classes = ref([]);
const activeClassId = ref(null);
const studentsListRaw = ref([]);

const newClassName = ref("");
const newStudentName = ref("");
const editingIndex = ref(null);
const editingName = ref("");

const divideMethod = ref("groupCount");
const targetNumber = ref(5);
const isSpinning = ref(false);
const isModalOpen = ref(false);
const generatedShareUrl = ref("");

// Helper untuk membuat ID unik (slug) dari nama siswa (ex: Muhammad Noval -> muhammad-noval)
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Computed Helpers
const activeClass = computed(() => {
  return classes.value.find((cls) => cls.id === activeClassId.value) || null;
});

const studentsList = computed(() => {
  const rawList = studentsListRaw.value || [];
  return rawList.map((student) => {
    const foundInGroup =
      activeClass.value?.groups?.some((group) =>
        group.includes(student.name),
      ) || false;
    return { id: student.id, name: student.name, hasGroup: foundInGroup };
  });
});

const groups = computed({
  get: () => activeClass.value?.groups || [],
  set: async (val) => {
    if (activeClass.value) {
      activeClass.value.groups = val;
      // Solusi: Mengubah array 2 dimensi menjadi String agar Firebase tidak mengembalikan error nested array
      const classDocRef = doc(
        $db,
        "users_data",
        currentUser.value.uid,
        "classes",
        activeClassId.value,
      );
      await updateDoc(classDocRef, { groups: JSON.stringify(val) });
    }
  },
});

onMounted(() => {
  if ($auth.currentUser) {
    currentUser.value = $auth.currentUser;
    fetchClassesFromCloud($auth.currentUser.uid);
  }
});

// 1. AMBIL DAFTAR KELAS DARI FIRESTORE
const fetchClassesFromCloud = async (uid) => {
  try {
    const classesCollRef = collection($db, "users_data", uid, "classes");
    const querySnapshot = await getDocs(classesCollRef);
    const localClasses = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      let parsedGroups = [];

      if (data.groups) {
        try {
          parsedGroups =
            typeof data.groups === "string"
              ? JSON.parse(data.groups)
              : data.groups;
        } catch (e) {
          console.error("Gagal parse data kelompok:", e);
        }
      }
      localClasses.push({ id: doc.id, name: doc.id, groups: parsedGroups });
    });

    classes.value = localClasses;
    if (classes.value.length > 0) {
      selectClass(classes.value[0].id);
    }
  } catch (err) {
    console.error("Gagal mengambil daftar kelas:", err);
  }
};

// 2. AMBIL DAFTAR SISWA BERDASARKAN KELAS YANG DIPILIH
const selectClass = async (id) => {
  activeClassId.value = id;
  cancelEdit();
  studentsListRaw.value = [];

  if (!currentUser.value || !id) return;

  try {
    const studentsCollRef = collection(
      $db,
      "users_data",
      currentUser.value.uid,
      "classes",
      id,
      "nama_siswa",
    );
    const querySnapshot = await getDocs(studentsCollRef);
    const localStudents = [];
    querySnapshot.forEach((doc) => {
      localStudents.push({ id: doc.id, name: doc.data().nama_siswa });
    });
    studentsListRaw.value = localStudents;
  } catch (err) {
    console.error("Gagal mengambil data siswa:", err);
  }
};

// 3. TAMBAH KELAS BARU
const addClass = async () => {
  const name = newClassName.value.trim();
  if (!name || !currentUser.value) return;

  if (classes.value.some((c) => c.id.toLowerCase() === name.toLowerCase())) {
    alert("Nama kelas tersebut sudah ada!");
    return;
  }

  try {
    const classDocRef = doc(
      $db,
      "users_data",
      currentUser.value.uid,
      "classes",
      name,
    );
    // Kirim string array kosong ke Firebase
    await setDoc(classDocRef, { groups: "[]" });

    classes.value.push({ id: name, name: name, groups: [] });
    activeClassId.value = name;
    selectClass(name);
    newClassName.value = "";
  } catch (err) {
    console.error("Gagal membuat kelas baru:", err);
  }
};

// 4. HAPUS KELAS
const removeClass = async (id, name) => {
  if (confirm(`Hapus permanen seluruh data kelas ${name} dari sistem cloud?`)) {
    try {
      const classDocRef = doc(
        $db,
        "users_data",
        currentUser.value.uid,
        "classes",
        id,
      );
      await deleteDoc(classDocRef);

      classes.value = classes.value.filter((c) => c.id !== id);
      activeClassId.value =
        classes.value.length > 0 ? classes.value[0].id : null;
      if (activeClassId.value) selectClass(activeClassId.value);
    } catch (err) {
      console.error("Gagal menghapus kelas:", err);
    }
  }
};

// 5. TAMBAH SISWA BARU (Dengan Custom ID Slug)
const addStudent = async () => {
  const name = newStudentName.value.trim();
  if (!name || !activeClassId.value || !currentUser.value) return;

  const studentId = generateSlug(name);

  if (studentsListRaw.value.some((s) => s.id === studentId)) {
    alert("Siswa dengan nama/ID ini sudah terdaftar!");
    return;
  }

  try {
    const studentDocRef = doc(
      $db,
      "users_data",
      currentUser.value.uid,
      "classes",
      activeClassId.value,
      "nama_siswa",
      studentId,
    );
    await setDoc(studentDocRef, { nama_siswa: name });

    studentsListRaw.value.push({ id: studentId, name: name });
    newStudentName.value = "";
  } catch (err) {
    console.error("Gagal menambah siswa:", err);
  }
};

const startEdit = (index, currentName) => {
  editingIndex.value = index;
  editingName.value = currentName;
};
const cancelEdit = () => {
  editingIndex.value = null;
  editingName.value = "";
};

// 6. EDIT NAMA SISWA
const saveEdit = async (index) => {
  const cleanNewName = editingName.value.trim();
  if (!cleanNewName || !activeClassId.value) return;

  const oldStudent = studentsListRaw.value[index];
  const newStudentId = generateSlug(cleanNewName);

  try {
    const baseRef = `users_data/${currentUser.value.uid}/classes/${activeClassId.value}/nama_siswa`;

    if (oldStudent.id !== newStudentId) {
      await deleteDoc(doc($db, baseRef, oldStudent.id));
    }

    await setDoc(doc($db, baseRef, newStudentId), { nama_siswa: cleanNewName });

    if (activeClass.value?.groups) {
      activeClass.value.groups = activeClass.value.groups.map((group) =>
        group.map((member) =>
          member === oldStudent.name ? cleanNewName : member,
        ),
      );
      const classDocRef = doc(
        $db,
        "users_data",
        currentUser.value.uid,
        "classes",
        activeClassId.value,
      );
      await updateDoc(classDocRef, {
        groups: JSON.stringify(activeClass.value.groups),
      });
    }

    studentsListRaw.value[index] = { id: newStudentId, name: cleanNewName };
    cancelEdit();
  } catch (err) {
    console.error("Gagal memperbarui nama siswa:", err);
  }
};

// 7. HAPUS SISWA PERMANEN
const deleteStudentFully = async (index, studentName) => {
  const student = studentsListRaw.value[index];
  if (confirm(`Hapus ${studentName} dari cloud?`)) {
    try {
      const studentDocRef = doc(
        $db,
        "users_data",
        currentUser.value.uid,
        "classes",
        activeClassId.value,
        "nama_siswa",
        student.id,
      );
      await deleteDoc(studentDocRef);

      studentsListRaw.value.splice(index, 1);

      if (activeClass.value?.groups) {
        activeClass.value.groups = activeClass.value.groups
          .map((group) => group.filter((member) => member !== studentName))
          .filter((group) => group.length > 0);

        const classDocRef = doc(
          $db,
          "users_data",
          currentUser.value.uid,
          "classes",
          activeClassId.value,
        );
        await updateDoc(classDocRef, {
          groups: JSON.stringify(activeClass.value.groups),
        });
      }
      cancelEdit();
    } catch (err) {
      console.error("Gagal menghapus data siswa:", err);
    }
  }
};

// 8. ACAK KELOMPOK
const generateGroups = () => {
  if (studentsListRaw.value.length === 0) return;
  isSpinning.value = true;

  setTimeout(async () => {
    let poolNames = studentsListRaw.value.map((s) => s.name);
    for (let i = poolNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [poolNames[i], poolNames[j]] = [poolNames[j], poolNames[i]];
    }

    const localGroups = [];
    if (divideMethod.value === "groupCount") {
      const numGroups = Math.max(1, targetNumber.value);
      for (let i = 0; i < numGroups; i++) localGroups.push([]);
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

const removeStudentFromGroup = async (groupIndex, studentIndex) => {
  if (!activeClass.value) return;
  activeClass.value.groups[groupIndex].splice(studentIndex, 1);
  if (activeClass.value.groups[groupIndex].length === 0) {
    activeClass.value.groups.splice(groupIndex, 1);
  }
  groups.value = activeClass.value.groups;
};

const handleLogout = async () => {
  if (confirm("Apakah Anda ingin menutup sesi awan Kelompokin Anda?")) {
    await signOut($auth);
    navigateTo("/login");
  }
};

// const openShareModal = () => {
//   const base64Data = btoa(JSON.stringify(groups.value));
//   const origin = window.location.origin;
//   generatedShareUrl.value = `${origin}?data=${base64Data}`;
//   isModalOpen.value = true;
// };

// Fungsi Helper Capture HTML murni area tabel & judul kelompok
const captureElement = async () => {
  if (!process.client) return null;

  const element = document.getElementById("grup-terbentuk-area");
  if (!element) {
    alert("Elemen kelompok tidak ditemukan!");
    return null;
  }

  const { default: html2canvas } = await import("html2canvas");

  // Menyembunyikan tombol silang (x) kecil di samping nama siswa agar hasil gambar/PDF bersih
  const hideElements = element.querySelectorAll(".export-hide");
  hideElements.forEach((el) => (el.style.display = "none"));

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Kualitas tajam HD
      useCORS: true,
      backgroundColor: isDarkMode.value ? "#0f172a" : "#ffffff",
      logging: false,
    });

    // Kembalikan tombol silang setelah selesai difoto
    hideElements.forEach((el) => (el.style.display = "block"));
    return canvas;
  } catch (err) {
    console.error("Gagal menangkap layar HTML:", err);
    hideElements.forEach((el) => (el.style.display = "block"));
    return null;
  }
};
// 1. FITUR UNDUH PDF (Aman untuk Nuxt 3)
const downloadAsPDF = async () => {
  if (!process.client) return;

  const canvas = await captureElement();
  if (!canvas) return;

  const { jsPDF } = await import("jspdf");

  try {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // Lebar A4 mm
    const pageHeight = 295; // Tinggi A4 mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Hasil_Kelompok_${activeClassId.value || "Kelas"}.pdf`);
  } catch (error) {
    console.error("Gagal cetak PDF:", error);
    alert("Gagal mengunduh PDF. Silakan coba lagi.");
  }
};

// 2. FITUR UNDUH GAMBAR (PNG)
const downloadAsImage = async () => {
  if (!process.client) return;

  const canvas = await captureElement();
  if (!canvas) return;

  try {
    const imgData = canvas.toDataURL("image/png");

    // Membuat elemen link download bayangan di DOM browser
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `Hasil_Kelompok_${activeClassId.value || "Kelas"}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Hapus kembali setelah diunduh
  } catch (error) {
    console.error("Gagal mengunduh gambar:", error);
    alert("Gagal mengunduh gambar. Silakan coba lagi.");
  }
};
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6366f1;
}
</style>
