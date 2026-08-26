<template>
  <div v-if="currentUser">
    <header
      class="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-white/70 dark:border-slate-700/80 sticky top-0 z-40 py-3 sm:py-4 mb-6 sm:mb-8 shadow-sm dark:shadow-lg"
    >
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <span class="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0"><i class="fa-solid fa-shuffle text-lg"></i></span>
          <div>
            <h1
              class="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight"
            >
              Kelompokin
              <span
                class="hidden sm:inline text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded ml-2"
                >v4.0 cloud</span
              >
            </h1>
            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Pembagi kelompok kelas
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="hidden md:block text-right">
            <p
              class="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]"
            >
              {{ currentUser?.email }}
            </p>
            <p
              class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium"
            >
              <i :class="syncStatus === 'saving' ? 'fa-solid fa-arrows-rotate animate-spin text-amber-500' : syncStatus === 'error' ? 'fa-solid fa-cloud-exclamation text-rose-500' : 'fa-solid fa-cloud-check'"></i> {{ syncLabel }}
            </p>
          </div>

          <!-- Tombol Kembali Ke Index (Beranda) -->
          <NuxtLink
            to="/spinner"
            class="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 w-11 h-11 flex items-center justify-center transition border border-indigo-200/70 dark:border-indigo-500/20"
            title="Spinner"
          >
            <i class="fa-solid fa-dharmachakra"></i>
          </NuxtLink>

          <!-- Tombol Ubah Tema -->
          <button
            @click="isDarkMode = !isDarkMode"
            class="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-300 w-11 h-11 flex items-center justify-center transition border border-amber-200/70 dark:border-amber-500/20"
            title="Ubah Tema"
          >
            <i :class="isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
          </button>

          <!-- Tombol Logout -->
          <button
            @click="handleLogout"
            class="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 w-11 h-11 flex items-center justify-center border border-rose-200/70 transition"
            title="Keluar Aplikasi"
          >
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 max-w-6xl pb-12">
      <section class="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 rounded-3xl p-5 sm:p-7 mb-6 text-white shadow-xl shadow-indigo-500/20">
        <div class="absolute -right-10 -top-16 w-52 h-52 rounded-full bg-white/10 blur-2xl"></div>
        <div class="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold mb-3"><i class="fa-solid fa-wand-magic-sparkles text-amber-300"></i> Ruang kerja dosen</span>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight">Buat kelompok adil, tanpa ribet.</h2>
            <p class="text-indigo-100 mt-2 text-sm sm:text-base max-w-xl">Selesaikan pembagian kelas dalam empat langkah sederhana. Data tersimpan otomatis di cloud Anda.</p>
          </div>
          <NuxtLink to="/spinner" class="min-h-[48px] px-5 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shrink-0 transition active:scale-[.98]">
            <i class="fa-solid fa-dharmachakra"></i> Buka Spinner
          </NuxtLink>
        </div>
        <div class="relative grid grid-cols-2 lg:grid-cols-4 gap-2 mt-6" aria-label="Langkah penggunaan">
          <div v-for="(step, index) in ['Buat kelas', 'Isi siswa', 'Atur pembagian', 'Acak & ekspor']" :key="step" class="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-xl p-3 text-xs sm:text-sm font-semibold">
            <span class="w-7 h-7 rounded-lg bg-white text-indigo-700 flex items-center justify-center font-black shrink-0">{{ index + 1 }}</span>{{ step }}
          </div>
        </div>
      </section>
      <section
        class="bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8"
      >
        <h2
          class="text-lg font-bold mb-1 flex items-center gap-2 text-slate-950 dark:text-white"
        >
          <i class="fa-solid fa-graduation-cap text-indigo-500"></i> Manajemen
          Kelas Dosen
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">Mulai dengan membuat kelas, lalu pilih kelas yang ingin dikelola.</p>

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
                :disabled="!newClassName.trim()"
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/10 active:scale-95 hover:scale-105 disabled:scale-100 disabled:bg-slate-200 dark:disabled:bg-slate-700/60 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none shrink-0 transition-all duration-200 flex items-center gap-1"
              >
                <i class="fa-solid fa-plus text-xs"></i>
                <span>Tambah</span>
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
                class="flex items-center justify-between gap-4 px-3 py-2 rounded-xl text-sm font-semibold border transition cursor-pointer select-none group/class min-w-[100px]"
                :class="
                  activeClassId === cls.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
                "
                @click="selectClass(cls.id)"
              >
                <span class="truncate pr-1">{{ cls.name }}</span>

                <button
                  @click.stop="removeClass(cls.id, cls.name)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all shrink-0"
                  :class="
                    activeClassId === cls.id
                      ? 'text-indigo-200 hover:text-rose-200 hover:bg-indigo-700'
                      : ''
                  "
                  title="Hapus kelas"
                >
                  <i class="fa-regular fa-trash-can text-xs block"></i>
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
                :disabled="!newStudentName.trim()"
                class="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-4 rounded-xl text-sm font-bold transition flex items-center justify-center shadow-md shrink-0 w-11"
              >
                <i class="fa-solid fa-user-plus"></i>
              </button>
            </form>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 mb-4">
              <label class="relative block">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input v-model="studentSearch" type="search" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl pl-9 pr-3 py-2 text-sm outline-none" placeholder="Cari nama siswa..." />
              </label>
              <label class="min-h-[44px] px-3 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-100 transition">
                <i class="fa-solid fa-file-import"></i> Impor Excel / CSV
                <input type="file" class="sr-only" accept=".xlsx,.xls,.csv" @change="importStudents" />
              </label>
            </div>

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
                  v-for="student in filteredStudents"
                  :key="student.id"
                  class="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center"
                >
                  <div class="flex justify-between items-center gap-2">
                    <div
                      v-if="editingIndex === student.id"
                      class="flex-1 flex gap-1"
                    >
                      <input
                        v-model="editingName"
                        type="text"
                        class="w-full bg-slate-100 dark:bg-slate-900 border border-indigo-500 rounded px-2 py-1 text-xs text-slate-900 dark:text-slate-200 outline-none"
                        @keyup.enter="saveEdit(student.id)"
                      />
                      <button
                        @click="saveEdit(student.id)"
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
                      v-if="editingIndex !== student.id"
                      class="flex items-center gap-1 shrink-0"
                    >
                      <button
                        @click="startEdit(student.id, student.name)"
                        class="text-slate-400 hover:text-indigo-500 p-1 rounded transition"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="deleteStudentFully(student.id, student.name)"
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
              <p v-if="studentsList.length && !filteredStudents.length" class="text-center text-slate-400 py-4 text-xs">Tidak ada siswa yang cocok dengan pencarian.</p>
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

          <div
            v-if="groups.length > 0 && !isSpinning"
            class="space-y-4 px-1 sm:px-0"
          >
            <div
              class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md"
            >
              <span
                class="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0 self-start md:self-center"
              >
                <i class="fa-solid fa-sliders text-indigo-500"></i> Opsi Ekspor
                Hasil Kelompok:
              </span>

              <div
                class="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full md:w-auto justify-stretch sm:justify-end"
              >
                <button @click="showHistory = !showHistory" class="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"><i class="fa-solid fa-clock-rotate-left"></i> Riwayat</button>
                <button
                  @click="resetGroups"
                  class="col-span-2 sm:col-span-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 order-last sm:order-none"
                >
                  <i class="fa-solid fa-arrow-rotate-left"></i> Reset Kelompok
                </button>

                <button
                  @click="downloadAsPDF"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <i class="fa-solid fa-file-pdf"></i> PDF
                </button>

                <button
                  @click="downloadAsImage"
                  class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <i class="fa-solid fa-file-image"></i> Gambar (PNG)
                </button>
              </div>
            </div>

            <div v-if="showHistory" class="bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 shadow-lg">
              <div class="flex justify-between items-center mb-3"><h3 class="font-black text-sm">Riwayat pengacakan</h3><button @click="showHistory = false" class="inline-action text-slate-400"><i class="fa-solid fa-xmark"></i></button></div>
              <div v-if="activeClass.history?.length" class="space-y-2 max-h-56 overflow-auto">
                <div v-for="(entry, idx) in activeClass.history" :key="entry.createdAt" class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div class="flex-1 min-w-0"><p class="text-xs font-bold">{{ entry.groups.length }} kelompok</p><p class="text-[11px] text-slate-500">{{ formatHistoryDate(entry.createdAt) }}</p></div>
                  <button @click="restoreHistory(idx)" class="min-h-[38px] px-3 rounded-lg bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs">Pulihkan</button>
                </div>
              </div>
              <p v-else class="text-xs text-slate-400 text-center py-4">Belum ada riwayat pengacakan.</p>
            </div>

            <div
              id="grup-terbentuk-area"
              class="p-4 sm:p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-6 overflow-hidden"
            >
              <div
                class="border-b border-slate-200 dark:border-slate-700 pb-4 text-center sm:text-left"
              >
                <h2
                  class="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-white uppercase break-words"
                >
                  DAFTAR KELOMPOK - KELAS {{ activeClass.name }}
                </h2>
                <p
                  class="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1"
                >
                  Aplikasi Kelompokin Cloud Platform
                </p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="(group, idx) in groups"
                  :key="idx"
                  @dragover.prevent
                  @drop="dropStudent(idx)"
                  class="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div
                      class="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-3"
                    >
                      <h3
                        class="font-black text-sm sm:text-base text-indigo-600 dark:text-indigo-400"
                      >
                        Kelompok {{ idx + 1 }}
                      </h3>
                      <div class="flex items-center gap-1 export-hide"><span class="text-[10px] sm:text-xs font-bold text-slate-400 bg-slate-200/50 dark:bg-slate-900/80 px-2 py-1 rounded-md shrink-0">{{ group.length }} Anggota</span><button @click="removeGroup(idx)" class="inline-action w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/15" title="Hapus kelompok"><i class="fa-regular fa-trash-can"></i></button></div>
                    </div>

                    <ul class="space-y-2">
                      <li
                        v-for="(studentName, sIdx) in group"
                        :key="studentName"
                        draggable="true"
                        @dragstart="dragStudent(idx, sIdx)"
                        class="text-xs font-medium flex justify-between items-center bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 gap-2"
                      >
                        <span
                          class="text-slate-800 dark:text-slate-200 truncate pr-1"
                          :title="studentName"
                        >
                          {{ studentName }}
                        </span>
                        <button
                          @click="removeStudentFromGroup(idx, sIdx)"
                          class="text-slate-400 hover:text-rose-500 text-xs p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition shrink-0 export-hide"
                          title="Hapus dari kelompok"
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

    <div v-if="showTutorial" class="fixed inset-0 z-[90] bg-slate-950/65 backdrop-blur-sm p-4 flex items-center justify-center">
      <div class="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div class="flex justify-between items-start"><span class="text-xs font-black text-indigo-600 uppercase tracking-widest">Panduan {{ tutorialStep + 1 }} / 4</span><button @click="finishTutorial" class="inline-action text-slate-400"><i class="fa-solid fa-xmark"></i></button></div>
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center text-2xl my-5"><i :class="tutorials[tutorialStep].icon"></i></div>
        <h2 class="text-2xl font-black text-slate-950 dark:text-white">{{ tutorials[tutorialStep].title }}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">{{ tutorials[tutorialStep].text }}</p>
        <div class="flex gap-2 mt-7"><button v-if="tutorialStep" @click="tutorialStep--" class="min-h-[46px] px-5 rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-sm">Kembali</button><button @click="tutorialStep === 3 ? finishTutorial() : tutorialStep++" class="min-h-[46px] flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm">{{ tutorialStep === 3 ? 'Mulai menggunakan' : 'Lanjut' }}</button></div>
      </div>
    </div>
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
const studentSearch = ref("");
const syncStatus = ref("saved");
const showHistory = ref(false);
const showTutorial = ref(false);
const tutorialStep = ref(0);
const draggedStudent = ref(null);
const { notify, ask } = useNotifications();
const tutorials = [
  { icon: "fa-solid fa-school", title: "Buat dan pilih kelas", text: "Setiap kelas mempunyai daftar siswa, kelompok, dan riwayat pengacakan sendiri." },
  { icon: "fa-solid fa-users", title: "Masukkan daftar siswa", text: "Tambah satu per satu atau impor file Excel/CSV. Nama duplikat akan disaring otomatis." },
  { icon: "fa-solid fa-wand-magic-sparkles", title: "Atur lalu acak", text: "Pilih jumlah kelompok atau jumlah anggota. Hasil langsung disimpan ke cloud." },
  { icon: "fa-solid fa-hand", title: "Sesuaikan dan ekspor", text: "Tarik nama antar kelompok, pulihkan riwayat, lalu unduh hasil sebagai PDF atau PNG." },
];

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
const filteredStudents = computed(() => {
  const keyword = studentSearch.value.trim().toLocaleLowerCase("id");
  return keyword ? studentsList.value.filter((student) => student.name.toLocaleLowerCase("id").includes(keyword)) : studentsList.value;
});
const syncLabel = computed(() => syncStatus.value === "saving" ? "Menyimpan..." : syncStatus.value === "error" ? "Gagal sinkron" : process.client && !navigator.onLine ? "Mode offline" : "Tersimpan di cloud");

const setSync = (state) => { syncStatus.value = state; };
const classDoc = () => doc($db, "users_data", currentUser.value.uid, "classes", activeClassId.value);
const persistGroups = async (newGroups, history = activeClass.value?.history || []) => {
  setSync("saving");
  try {
    await updateDoc(classDoc(), { groups: JSON.stringify(newGroups), history: JSON.stringify(history) });
    setSync("saved");
  } catch (error) {
    setSync("error");
    notify("Perubahan belum berhasil disimpan. Periksa koneksi Anda.", "error");
    throw error;
  }
};

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
      await persistGroups(val);
    }
  },
});

onMounted(() => {
  if ($auth.currentUser) {
    currentUser.value = $auth.currentUser;
    fetchClassesFromCloud($auth.currentUser.uid);
  }
  showTutorial.value = localStorage.getItem("kelompokin_tutorial_done") !== "1";
});
const finishTutorial = () => { showTutorial.value = false; localStorage.setItem("kelompokin_tutorial_done", "1"); };

const importStudents = async (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file || !activeClassId.value) { notify("Pilih kelas sebelum mengimpor siswa.", "warning"); return; }
  try {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, blankrows: false });
    const candidates = rows.flatMap((row, rowIndex) => {
      const first = String(row.find((cell) => String(cell ?? "").trim()) ?? "").trim();
      if (rowIndex === 0 && /^(nama|name|nama siswa|student)$/i.test(first)) return [];
      return first ? [first] : [];
    });
    const existing = new Set(studentsListRaw.value.map((student) => student.name.toLocaleLowerCase("id")));
    const seen = new Set();
    const uniqueNames = candidates.filter((name) => {
      const key = name.toLocaleLowerCase("id");
      if (existing.has(key) || seen.has(key)) return false;
      seen.add(key); return true;
    });
    if (!uniqueNames.length) { notify("Tidak ada nama baru. Semua data kosong atau duplikat.", "warning"); return; }
    setSync("saving");
    for (const name of uniqueNames) {
      const id = generateSlug(name);
      await setDoc(doc($db, "users_data", currentUser.value.uid, "classes", activeClassId.value, "nama_siswa", id), { nama_siswa: name });
      studentsListRaw.value.push({ id, name });
    }
    setSync("saved");
    const skipped = candidates.length - uniqueNames.length;
    notify(`${uniqueNames.length} siswa berhasil diimpor${skipped ? `, ${skipped} duplikat dilewati` : ""}.`, "success");
  } catch (error) {
    console.error("Gagal mengimpor file:", error); setSync("error");
    notify("File tidak dapat dibaca. Gunakan Excel atau CSV dengan nama di kolom pertama.", "error");
  }
};

const formatHistoryDate = (timestamp) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp));
const restoreHistory = async (index) => {
  const entry = activeClass.value?.history?.[index];
  if (!entry || !await ask(`Pulihkan susunan dari ${formatHistoryDate(entry.createdAt)}?`, "Pulihkan riwayat")) return;
  const previous = JSON.parse(JSON.stringify(groups.value));
  activeClass.value.groups = JSON.parse(JSON.stringify(entry.groups));
  await persistGroups(activeClass.value.groups);
  notify("Susunan kelompok berhasil dipulihkan.", "success", { actionLabel: "Urungkan", action: async () => { activeClass.value.groups = previous; await persistGroups(previous); } });
};

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
      const lastClass = localClasses[localClasses.length - 1];
      try { lastClass.history = data.history ? JSON.parse(data.history) : []; } catch { lastClass.history = []; }
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
    notify("Nama kelas tersebut sudah ada.", "warning");
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
    notify(`Kelas ${name} berhasil dibuat.`, "success");
  } catch (err) {
    console.error("Gagal membuat kelas baru:", err);
  }
};

// 4. HAPUS KELAS
const removeClass = async (id, name) => {
  if (await ask(`Seluruh data kelas ${name} akan dihapus permanen dari cloud.`)) {
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
      notify(`Kelas ${name} telah dihapus.`, "success");
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

  if (studentsListRaw.value.some((s) => s.id === studentId || s.name.toLocaleLowerCase("id") === name.toLocaleLowerCase("id"))) {
    notify(`${name} sudah terdaftar di kelas ini.`, "warning");
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
    notify(`${name} berhasil ditambahkan.`, "success");
  } catch (err) {
    console.error("Gagal menambah siswa:", err);
  }
};

const startEdit = (id, currentName) => {
  editingIndex.value = id;
  editingName.value = currentName;
};
const cancelEdit = () => {
  editingIndex.value = null;
  editingName.value = "";
};

// 6. EDIT NAMA SISWA
const saveEdit = async (id) => {
  const cleanNewName = editingName.value.trim();
  if (!cleanNewName || !activeClassId.value) return;

  const index = studentsListRaw.value.findIndex((student) => student.id === id);
  const oldStudent = studentsListRaw.value[index];
  const newStudentId = generateSlug(cleanNewName);
  if (studentsListRaw.value.some((student) => student.id !== id && (student.id === newStudentId || student.name.toLocaleLowerCase("id") === cleanNewName.toLocaleLowerCase("id")))) {
    notify("Nama siswa duplikat. Gunakan nama yang berbeda.", "warning"); return;
  }

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
    notify("Nama siswa berhasil diperbarui.", "success");
  } catch (err) {
    console.error("Gagal memperbarui nama siswa:", err);
  }
};

// 7. HAPUS SISWA PERMANEN
const deleteStudentFully = async (id, studentName) => {
  const index = studentsListRaw.value.findIndex((student) => student.id === id);
  const student = studentsListRaw.value[index];
  if (await ask(`Hapus ${studentName} dari kelas ini?`)) {
    const previousGroups = JSON.parse(JSON.stringify(activeClass.value?.groups || []));
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
      notify(`${studentName} dihapus.`, "info", { actionLabel: "Urungkan", action: async () => {
        await setDoc(doc($db, `users_data/${currentUser.value.uid}/classes/${activeClassId.value}/nama_siswa`, student.id), { nama_siswa: student.name });
        studentsListRaw.value.splice(index, 0, student); activeClass.value.groups = previousGroups; await persistGroups(previousGroups); notify("Penghapusan dibatalkan.", "success");
      }});
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

    const result = localGroups.filter((g) => g.length > 0);
    const history = [{ createdAt: Date.now(), groups: JSON.parse(JSON.stringify(result)) }, ...(activeClass.value.history || [])].slice(0, 10);
    activeClass.value.history = history;
    activeClass.value.groups = result;
    persistGroups(result, history).then(() => notify("Kelompok berhasil diacak dan disimpan.", "success"));
    isSpinning.value = false;
  }, 1200);
};

const removeStudentFromGroup = async (groupIndex, studentIndex) => {
  if (!activeClass.value) return;
  const snapshot = JSON.parse(JSON.stringify(activeClass.value.groups));
  const removedName = activeClass.value.groups[groupIndex][studentIndex];
  activeClass.value.groups[groupIndex].splice(studentIndex, 1);
  if (activeClass.value.groups[groupIndex].length === 0) {
    activeClass.value.groups.splice(groupIndex, 1);
  }
  groups.value = activeClass.value.groups;
  notify(`${removedName} dikeluarkan dari kelompok.`, "info", { actionLabel: "Urungkan", action: async () => { activeClass.value.groups = snapshot; await persistGroups(snapshot); } });
};

const removeGroup = async (groupIndex) => {
  const snapshot = JSON.parse(JSON.stringify(groups.value));
  const [removed] = activeClass.value.groups.splice(groupIndex, 1);
  await persistGroups(activeClass.value.groups);
  notify(`Kelompok ${groupIndex + 1} dihapus (${removed.length} siswa).`, "info", { actionLabel: "Urungkan", action: async () => { activeClass.value.groups = snapshot; await persistGroups(snapshot); } });
};

const dragStudent = (groupIndex, studentIndex) => { draggedStudent.value = { groupIndex, studentIndex }; };
const dropStudent = async (targetGroupIndex) => {
  if (!draggedStudent.value || draggedStudent.value.groupIndex === targetGroupIndex) return;
  const snapshot = JSON.parse(JSON.stringify(groups.value));
  const { groupIndex, studentIndex } = draggedStudent.value;
  const [name] = activeClass.value.groups[groupIndex].splice(studentIndex, 1);
  activeClass.value.groups[targetGroupIndex].push(name);
  activeClass.value.groups = activeClass.value.groups.filter((group) => group.length);
  draggedStudent.value = null;
  await persistGroups(activeClass.value.groups);
  notify(`${name} dipindahkan.`, "success", { actionLabel: "Urungkan", action: async () => { activeClass.value.groups = snapshot; await persistGroups(snapshot); } });
};

const handleLogout = async () => {
  if (await ask("Apakah Anda ingin keluar dari sesi Kelompokin?", "Keluar aplikasi")) {
    await signOut($auth);
    navigateTo("/login");
  }
};

// Fungsi untuk mereset/menghapus susunan kelompok yang sudah diacak
const resetGroups = async () => {
  if (!activeClass.value) return;

  if (await ask(`Hapus semua susunan kelompok kelas ${activeClass.value.name}?`)) {
    const snapshot = JSON.parse(JSON.stringify(groups.value));
    try {
      // Mengosongkan groups akan otomatis memicu fungsi setter computed
      // untuk mengupdate Firestore menjadi "[]" secara otomatis
      groups.value = [];
      notify("Susunan kelompok direset.", "info", { actionLabel: "Urungkan", action: async () => { activeClass.value.groups = snapshot; await persistGroups(snapshot); } });
    } catch (err) {
      console.error("Gagal mereset kelompok:", err);
      notify("Kelompok gagal direset.", "error");
    }
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
    notify("Area kelompok tidak ditemukan.", "error");
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
    notify("Gagal mengunduh PDF. Silakan coba lagi.", "error");
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
    notify("Gagal mengunduh gambar. Silakan coba lagi.", "error");
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
