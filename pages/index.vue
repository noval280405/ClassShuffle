<template>
  <div v-if="currentUser">
    <header class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 py-4 mb-8 shadow-sm dark:shadow-lg">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-shuffle text-2xl text-indigo-600 dark:text-indigo-400 animate-pulse"></i>
          <div>
            <h1 class="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight">
              Kelompokin <span class="text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded ml-2">v4.0 cloud</span>
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">Multi-User Cloud Platform</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden md:block text-right">
            <p class="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{{ currentUser.email }}</p>
            <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"><i class="fa-solid fa-cloud"></i> Sesi Cloud Aktif</p>
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
      
      <section class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xl mb-8">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2 text-slate-950 dark:text-white">
          <i class="fa-solid fa-graduation-cap text-indigo-500"></i> Manajemen Kelas Dosen
        </h2>
        
        <div class="flex flex-col md:flex-row gap-4 items-end">
          <form @submit.prevent="addClass" class="w-full md:w-1/3">
            <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Buat Kelas Baru</label>
            <div class="flex gap-2">
              <input 
                v-model="newClassName"
                type="text"
                class="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder-slate-400"
                placeholder="Contoh: Pemrograman Web A"
              />
              <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-sm font-bold transition flex items-center gap-1 shadow-md shrink-0">
                <i class="fa-solid fa-plus"></i> Tambah
              </button>
            </div>
          </form>

          <div class="w-full md:w-2/3">
            <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Pilih Kelas Aktif</label>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="cls in classes" 
                :key="cls.id"
                class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition cursor-pointer"
                :class="activeClassId === cls.id 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' 
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'"
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
              <p v-if="classes.length === 0" class="text-sm text-slate-400 italic py-2">Belum ada data kelas di cloud. Silakan buat di sebelah kiri.</p>
            </div>
          </div>
        </div>
      </section>

      <div v-if="activeClass" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xl">
            <h2 class="text-lg font-bold mb-1 flex items-center gap-2 text-slate-950 dark:text-white">
              <i class="fa-solid fa-users text-purple-500"></i> Daftar Siswa
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Input nama mahasiswa untuk kelas: <span class="text-indigo-500 font-bold">{{ activeClass.name }}</span></p>
            
            <form @submit.prevent="addStudent" class="flex gap-2 mb-4">
              <input 
                v-model="newStudentName"
                type="text"
                class="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition placeholder-slate-400"
                placeholder="Ketik nama mahasiswa..."
              />
              <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-xl text-sm font-bold transition flex items-center justify-center shadow-md shrink-0 w-11">
                <i class="fa-solid fa-user-plus"></i>
              </button>
            </form>

            <div class="mt-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 space-y-3">
              <div class="flex justify-between text-xs font-medium border-b border-slate-200 dark:border-slate-700 pb-2">
                <span class="text-slate-500 dark:text-slate-400">Total Terdaftar:</span>
                <span class="text-slate-950 dark:text-white font-bold">{{ studentsList.length }} Mahasiswa</span>
              </div>
              
              <div v-if="studentsList.length > 0" class="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs">
                <div v-for="(student, index) in studentsList" :key="index" class="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center">
                  <div class="flex justify-between items-center gap-2">
                    
                    <div v-if="editingIndex === index" class="flex-1 flex gap-1">
                      <input v-model="editingName" type="text" class="w-full bg-slate-100 dark:bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-200 outline-none" @keyup.enter="saveEdit(index)" />
                      <button @click="saveEdit(index)" class="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">Simpan</button>
                      <button @click="cancelEdit" class="bg-slate-400 dark:bg-slate-700 text-white px-2 py-0.5 rounded text-[10px]">Batal</button>
                    </div>

                    <div v-else class="flex-1 flex items-center justify-between min-w-0">
                      <span class="truncate font-medium pr-2" :class="student.hasGroup ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'">{{ student.name }}</span>
                      <span class="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border" :class="student.hasGroup ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'">{{ student.hasGroup ? 'Sudah' : 'Belum' }}</span>
                    </div>

                    <div v-if="editingIndex !== index" class="flex items-center gap-1 shrink-0">
                      <button @click="startEdit(index, student.name)" class="text-slate-400 hover:text-indigo-500 p-1 rounded transition"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button @click="deleteStudentFully(index, student.name)" class="text-slate-400 hover:text-rose-500 p-1 rounded transition"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-center text-slate-400 py-4 text-xs italic">Belum ada data mahasiswa.</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 class="font-bold text-base mb-4 text-slate-950 dark:text-white flex items-center gap-2"><i class="fa-solid fa-sliders text-indigo-500"></i> Setelan Pembagian</h3>
            <div class="mb-4">
              <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Metode Pembagian</label>
              <select v-model="divideMethod" class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-200 outline-none">
                <option value="groupCount">Berdasarkan Jumlah Kelompok</option>
                <option value="studentCount">Berdasarkan Anggota per Kelompok</option>
              </select>
            </div>
            <div class="mb-6">
              <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{{ divideMethod === 'groupCount' ? 'Target Jumlah Kelompok' : 'Jumlah Anggota per Kelompok' }}</label>
              <input type="number" v-model.number="targetNumber" min="1" class="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-200 outline-none" />
            </div>
            <button @click="generateGroups" :disabled="isSpinning || activeClass.students.length === 0" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
              <i v-if="isSpinning" class="fa-solid fa-spinner animate-spin"></i>
              <i v-else class="fa-solid fa-wand-magic-sparkles"></i>
              {{ isSpinning ? 'Mengacak Kelas...' : 'Acak Kelompok!' }}
            </button>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div v-if="groups.length === 0 && !isSpinning" class="bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center shadow-xl">
            <i class="fa-solid fa-layer-group text-5xl text-slate-300 dark:text-slate-600 block mx-auto mb-4"></i>
            <p class="text-slate-700 dark:text-slate-300 font-semibold text-lg">Kelompok Belum Diacak</p>
          </div>

          <div v-if="isSpinning" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
            <i class="fa-solid fa-arrows-rotate text-4xl text-indigo-500 animate-spin"></i>
            <p class="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">Menyusun Kombinasi Adil...</p>
          </div>

          <div v-if="groups.length > 0 && !isSpinning" class="space-y-6">
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex justify-between items-center shadow-xl">
              <div>
                <h2 class="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2"><i class="fa-solid fa-champagne-glasses text-emerald-500"></i> Kelompok Terbentuk</h2>
              </div>
              <button @click="openShareModal" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-1.5"><i class="fa-solid fa-share-nodes"></i> Bagikan ke WA</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(group, idx) in groups" :key="idx" class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-md hover:border-slate-400 transition flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3 mb-3">
                    <h3 class="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-lg">Kelompok {{ idx + 1 }}</h3>
                    <span class="text-xs bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full border text-slate-500">{{ group.length }} Anggota</span>
                  </div>
                  <ul class="space-y-2">
                    <li v-for="(studentName, sIdx) in group" :key="studentName" class="group/item flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50">
                      <span class="font-medium truncate max-w-[80%]">{{ studentName }}</span>
                      <button @click="removeStudentFromGroup(idx, sIdx)" class="text-slate-400 hover:text-rose-500 transition p-0.5"><i class="fa-solid fa-xmark"></i></button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center shadow-xl">
        <i class="fa-solid fa-arrow-pointer text-5xl text-indigo-500 block mx-auto mb-4 animate-bounce"></i>
        <h3 class="text-lg font-bold text-slate-950 dark:text-white">Pilih atau Buat Kelas Terlebih Dahulu</h3>
        <p class="text-sm text-slate-400 mt-2">Gunakan opsi manajemen kelas di atas untuk mulai beroperasi.</p>
      </div>
    </main>

    <ShareModal :is-open="isModalOpen" :share-url="generatedShareUrl" @close="isModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue'
import { signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import ShareModal from '~/components/ShareModal.vue'

const { $auth, $db } = useNuxtApp()
const isDarkMode = inject('isDarkMode')

// State Otentikasi
const currentUser = ref(null)
const isCloudSyncing = ref(false)

// State Data Dashboard
const classes = ref([]) 
const activeClassId = ref(null)

const newClassName = ref('')
const newStudentName = ref('')
const editingIndex = ref(null)
const editingName = ref('')

const divideMethod = ref('groupCount')
const targetNumber = ref(5)
const isSpinning = ref(false)
const isModalOpen = ref(false)
const generatedShareUrl = ref('')

// Computed Helpers
const activeClass = computed(() => {
  return classes.value.find(cls => cls.id === activeClassId.value) || null
})

const studentsList = computed(() => {
  if (!activeClass.value) return []
  return activeClass.value.students.map(name => {
    const foundInGroup = activeClass.value.groups?.some(group => group.includes(name)) || false
    return { name, hasGroup: foundInGroup }
  })
})

const groups = computed({
  get: () => activeClass.value?.groups || [],
  set: (val) => { if (activeClass.value) activeClass.value.groups = val }
})

// Lifecycle Hooks: Ambil Data Setelah Login Berhasil
onMounted(() => {
  if ($auth.currentUser) {
    currentUser.value = $auth.currentUser
    fetchUserDataFromCloud($auth.currentUser.uid)
  }
})

// Watcher Reaktif: Setiap ada modifikasi data di web, otomatis dilempar ke Firebase Cloud Firestore
watch(classes, async (newVal) => {
  if (currentUser.value && !isCloudSyncing.value) {
    try {
      const docRef = doc($db, "users_data", currentUser.value.uid)
      await setDoc(docRef, { classes: newVal })
    } catch (e) {
      console.error("Gagal sinkronisasi data cloud: ", e)
    }
  }
}, { deep: true })

// Fungsi Tarik Data Firestore
const fetchUserDataFromCloud = async (uid) => {
  isCloudSyncing.value = true
  try {
    const docRef = doc($db, "users_data", uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      classes.value = docSnap.data().classes || []
      if (classes.value.length > 0) activeClassId.value = classes.value[0].id
    }
  } catch (err) {
    console.error("Gagal menarik arsip data awan", err)
  } finally {
    isCloudSyncing.value = false
  }
}

// Logika Log Out Sesi Dosen
const handleLogout = async () => {
  if (confirm("Apakah Anda ingin menutup sesi awan Kelompokin Anda?")) {
    await signOut($auth)
    navigateTo('/login')
  }
}

// Logika Inti Aplikasi (Kelas, Mahasiswa, Pengacakan)
const addClass = () => {
  const name = newClassName.value.trim()
  if (!name) return
  if (classes.value.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    alert('Nama kelas tersebut sudah terdaftar!')
    return
  }
  const newClassObj = { id: Date.now(), name, students: [], groups: [] }
  classes.value.push(newClassObj)
  activeClassId.value = newClassObj.id
  newClassName.value = ''
}

const selectClass = (id) => { activeClassId.value = id; cancelEdit() }

const removeClass = (id, name) => {
  if (confirm(`Hapus permanen seluruh data kelas ${name} dari sistem cloud?`)) {
    classes.value = classes.value.filter(c => c.id !== id)
    if (activeClassId.value === id) activeClassId.value = classes.value.length > 0 ? classes.value[0].id : null
    cancelEdit()
  }
}

const addStudent = () => {
  const name = newStudentName.value.trim()
  if (!name || !activeClass.value) return
  if (activeClass.value.students.includes(name)) { alert('Nama mahasiswa sudah ada di kelas ini!'); return }
  activeClass.value.students.push(name)
  newStudentName.value = ''
}

const startEdit = (index, currentName) => { editingIndex.value = index; editingName.value = currentName }
const cancelEdit = () => { editingIndex.value = null; editingName.value = '' }

const saveEdit = (index) => {
  const cleanNewName = editingName.value.trim()
  if (!cleanNewName || !activeClass.value) return
  const oldName = activeClass.value.students[index]
  activeClass.value.students[index] = cleanNewName
  if (activeClass.value.groups) {
    activeClass.value.groups = activeClass.value.groups.map(group => group.map(member => member === oldName ? cleanNewName : member))
  }
  cancelEdit()
}

const deleteStudentFully = (index, studentName) => {
  if (confirm(`Hapus ${studentName} dari kelas?`)) {
    activeClass.value.students.splice(index, 1)
    if (activeClass.value.groups) {
      activeClass.value.groups = activeClass.value.groups.map(group => group.filter(member => member !== studentName)).filter(group => group.length > 0)
    }
    cancelEdit()
  }
}

const generateGroups = () => {
  if (!activeClass.value || activeClass.value.students.length === 0) return
  isSpinning.value = true
  activeClass.value.groups = []
  setTimeout(() => {
    let poolNames = [...activeClass.value.students]
    for (let i = poolNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [poolNames[i], poolNames[j]] = [poolNames[j], poolNames[i]]
    }
    const localGroups = []
    if (divideMethod.value === 'groupCount') {
      const numGroups = Math.max(1, targetNumber.value)
      for (let i = 0; i < numGroups; i++) localGroups.push([])
      poolNames.forEach((name, index) => { localGroups[index % numGroups].push(name) })
    } else {
      const sizePerGroup = Math.max(1, targetNumber.value)
      while (poolNames.length > 0) { localGroups.push(poolNames.splice(0, sizePerGroup)) }
    }
    groups.value = localGroups.filter(g => g.length > 0)
    isSpinning.value = false
  }, 1200)
}

const removeStudentFromGroup = (groupIndex, studentIndex) => {
  if (!activeClass.value) return
  activeClass.value.groups[groupIndex].splice(studentIndex, 1)
  if (activeClass.value.groups[groupIndex].length === 0) activeClass.value.groups.splice(groupIndex, 1)
}

const openShareModal = () => {
  const base64Data = btoa(JSON.stringify(groups.value))
  const origin = window.location.origin
  generatedShareUrl.value = `${origin}?data=${base64Data}`
  isModalOpen.value = true
}
</script>

<style>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6366f1; }
</style>