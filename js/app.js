    // Default configuration
    const APP = {

    name: "Jurnal 7KAIH SMASES",

    version: "0.1.0",

    storageKey: "7kaih_config"

};
    const defaultConfig = {
    school_name: 'Belum dikonfigurasi'
};

function loadConfig(){

    const data = localStorage.getItem(APP.storageKey);

    if(data){
        return JSON.parse(data);
    }

    return defaultConfig;

}

let appConfig = loadConfig();
function saveConfig(config){

    localStorage.setItem(
        APP.storageKey,
        JSON.stringify(config)
    );

    appConfig=config;

}
function firstSetup(){

    const school =
        document.getElementById(
            "setup-school"
        ).value.trim();

    const teacher =
        document.getElementById(
            "setup-teacher"
        ).value.trim();

    const year =
        document.getElementById(
            "setup-year"
        ).value.trim();

    const semester =
        document.getElementById(
            "setup-semester"
        ).value;

    const agree =
        document.getElementById(
            "setup-check"
        );

    if(school===""){

        alert(
            "Nama sekolah wajib diisi."
        );

        return;

    }

    if(!agree.checked){

        alert(
            "Centang persetujuan terlebih dahulu."
        );

        return;

    }

    saveConfig({

        school_name:school,

        teacher_name:teacher,

        year:year,

        semester:semester,

        locked:true

    });

    alert(
        "Setup berhasil."
    );

    location.reload();

}
    // App State
    let currentFilter = 'daily';
const DB = {

    studentKey : "7kaih_student",

    habitKey : "7kaih_habits",

    getStudent(){

        return JSON.parse(
            localStorage.getItem(this.studentKey)
        ) || null;

    },

    saveStudent(data){

        localStorage.setItem(
            this.studentKey,
            JSON.stringify(data)
        );

    },

    getHabits(){

        return JSON.parse(
            localStorage.getItem(this.habitKey)
        ) || [];

    },

    saveHabits(data){

        localStorage.setItem(
            this.habitKey,
            JSON.stringify(data)
        );

    }

};

let studentData = DB.getStudent();

let habitsData = DB.getHabits();
    let editingId = null;

    // Habit configurations
    const habitConfig = {
      bangun: {
        title: 'Bangun Pagi',
        icon: '🌅',
        fields: [
          { id: 'date', label: 'Tanggal', type: 'date' },
          { id: 'time', label: 'Jam Bangun', type: 'time' },
          { id: 'note', label: 'Keterangan', type: 'text', placeholder: 'Misal: Bangun sendiri tanpa dibangunkan' }
        ]
      },
      ibadah: {
        title: 'Beribadah',
        icon: '🙏',
        fields: [
          { id: 'date', label: 'Tanggal', type: 'date' },
          { id: 'time', label: 'Jam', type: 'time' },
          { id: 'note', label: 'Jenis Ibadah', type: 'text', placeholder: 'Misal: Sholat Subuh, Sembahyang pagi' }
        ]
      },
      olahraga: {
        title: 'Berolahraga',
        icon: '🚴',
        fields: [
          { id: 'date', label: 'Tanggal', type: 'date' },
          { id: 'time', label: 'Jam', type: 'time' },
          { id: 'duration', label: 'Durasi (menit)', type: 'number', placeholder: '30' },
          { id: 'note', label: 'Jenis Olahraga', type: 'text', placeholder: 'Misal: Bersepeda, Jogging, Senam' }
        ]
      },
      makan: {
        title: 'Makan Sehat',
        icon: '🍎',
        fields: [
          { id: 'date', label: 'Tanggal', type: 'date' },
          { id: 'time', label: 'Jam Makan', type: 'time' },
          { id: 'note', label: 'Menu Makanan', type: 'text', placeholder: 'Misal: Nasi, sayur bayam, telur, buah' }
        ]
      },
      belajar: {
        title: 'Gemar Belajar',
        icon: '📚',
        fields: [
          { id: 'date', label: 'Tanggal', type: 'date' },
          { id: 'time', label: 'Jam Mulai', type: 'time' },
          { id: 'duration', label: 'Durasi (menit)', type: 'number', placeholder: '60' },
          { id: 'note', label: 'Materi/Pelajaran', type: 'text', placeholder: 'Misal: Matematika, Membaca buku cerita' }
        ]
      },
      masyarakat: {
        title: 'Bermasyarakat',
        icon: '👥',
        fields: [
          { id: 'date', label: 'Tanggal', type: 'date' },
          { id: 'time', label: 'Jam', type: 'time' },
          { id: 'note', label: 'Kegiatan', type: 'text', placeholder: 'Misal: Membantu tetangga, Gotong royong' }
        ]
      },
      tidur: {
        title: 'Tidur Cepat',
        icon: '🌙',
        fields: [
          { id: 'date', label: 'Tanggal', type: 'date' },
          { id: 'time', label: 'Jam Tidur', type: 'time' },
          { id: 'note', label: 'Keterangan', type: 'text', placeholder: 'Misal: Tidur setelah belajar' }
        ]
      }
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {

    const school = document.getElementById("school-name");

    if (school) {
        school.textContent = appConfig.school_name || defaultConfig.school_name;
    }

    updateProfileDisplay();
    initYearSelector();
    setCurrentDateAndMonth();
    renderDataList();

    document.getElementById('select-date').addEventListener('change', renderDataList);
    document.getElementById('select-month').addEventListener('change', renderDataList);
    document.getElementById('select-year').addEventListener('change', renderDataList);

});

    function initYearSelector() {
      const yearSelect = document.getElementById('select-year');
      const currentYear = new Date().getFullYear();
      for (let y = currentYear - 2; y <= currentYear + 2; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
      }
    }

    function setCurrentDateAndMonth() {
      const now = new Date();
      document.getElementById('select-date').value = now.toISOString().split('T')[0];
      document.getElementById('select-month').value = now.getMonth();
      document.getElementById('select-year').value = now.getFullYear();
    }

    function updateProfileDisplay() {
      const emptyEl = document.getElementById('profile-empty');
      const filledEl = document.getElementById('profile-filled');
      
      if (studentData && studentData.name) {
        emptyEl.classList.add('hidden');
        filledEl.classList.remove('hidden');
        document.getElementById('display-name').textContent = studentData.name;
        document.getElementById('display-class').textContent = studentData.kelas;
        document.getElementById('display-absen').textContent = studentData.absen;
      } else {
        emptyEl.classList.remove('hidden');
        filledEl.classList.add('hidden');
      }
    }
    function openSettings(){

    alert(
        "Menu Pengaturan masih dalam tahap pengembangan."
    );

}
    function openModal(type) {
      const overlay = document.getElementById('modal-overlay');
      const content = document.getElementById('modal-content');
      const title = document.getElementById('modal-title');
      const body = document.getElementById('modal-body');
      
      overlay.classList.remove('hidden');
      setTimeout(() => {
        content.classList.remove('translate-y-full');
      }, 10);
      
      if (type === 'identitas') {
        title.textContent = '👤 Identitas Siswa';
        body.innerHTML = `
          <form id="identity-form" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-1.5">Nama Lengkap</label>
              <input type="text" id="input-name" value="${studentData?.name || ''}" placeholder="Masukkan nama lengkap" 
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-slate-600 mb-1.5">Kelas</label>
                <input type="text" id="input-kelas" value="${studentData?.kelas || ''}" placeholder="Misal: 5A" 
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-600 mb-1.5">No. Absen</label>
                <input type="number" id="input-absen" value="${studentData?.absen || ''}" placeholder="Misal: 12" 
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent">
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" onclick="closeModal()" class="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold">Batal</button>
              <button type="submit" class="flex-1 px-4 py-3 bg-royal text-white rounded-xl font-semibold">Simpan</button>
            </div>
          </form>
        `;
        document.getElementById('identity-form').addEventListener('submit', (e) => {
          e.preventDefault();
          saveIdentity();
        });
      } else {
        const config = habitConfig[type];
        title.textContent = `${config.icon} ${config.title}`;
        
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toTimeString().slice(0, 5);
        
        let fieldsHtml = config.fields.map(field => {
          let value = '';
          if (field.type === 'date') value = today;
          if (field.type === 'time') value = now;
          
          return `
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-1.5">${field.label}</label>
              <input type="${field.type}" id="input-${field.id}" value="${value}" placeholder="${field.placeholder || ''}"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent">
            </div>
          `;
        }).join('');
        
        body.innerHTML = `
          <form id="habit-form" class="space-y-4">
            ${fieldsHtml}
            <div class="flex gap-3 pt-2">
              <button type="button" onclick="closeModal()" class="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold">Batal</button>
              <button type="submit" class="flex-1 px-4 py-3 bg-royal text-white rounded-xl font-semibold">Simpan</button>
            </div>
          </form>
        `;
        
        document.getElementById('habit-form').addEventListener('submit', (e) => {
          e.preventDefault();
          saveHabit(type, config);
        });
      }
    }

    function closeModal() {
      const overlay = document.getElementById('modal-overlay');
      const content = document.getElementById('modal-content');
      
      content.classList.add('translate-y-full');
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 300);
    }

    function saveIdentity() {
      const name = document.getElementById('input-name').value.trim();
      const kelas = document.getElementById('input-kelas').value.trim();
      const absen = document.getElementById('input-absen').value.trim();
      
      if (!name || !kelas || !absen) {
        showToast('Mohon lengkapi semua data!');
        return;
      }
      
      studentData = { name, kelas, absen };
      localStorage.setItem('7kaih_student', JSON.stringify(studentData));
      updateProfileDisplay();
      closeModal();
      showToast('Data siswa tersimpan!');
    }

    function saveHabit(type, config) {
      const date = document.getElementById('input-date').value;
      const time = document.getElementById('input-time')?.value || '';
      const duration = document.getElementById('input-duration')?.value || '';
      const note = document.getElementById('input-note')?.value || '';
      
      // Validasi semua field wajib diisi
      if (!date) {
        showToast('Tanggal wajib diisi!');
        return;
      }
      if (!time) {
        showToast('Waktu wajib diisi!');
        return;
      }
      if (!note) {
        showToast('Keterangan wajib diisi!');
        return;
      }
      if (document.getElementById('input-duration') && !duration) {
        showToast('Durasi wajib diisi!');
        return;
      }
      
      const now = new Date().toISOString();

const data = {

        id: Date.now(),

        created_at: now,

        updated_at: now,

        type: type,

        habit: config.title,

        icon: config.icon,

        date: date,

        time: time,

        duration: duration,

        note: note

};
      
      habitsData.push(data);
      localStorage.setItem('7kaih_habits', JSON.stringify(habitsData));
      closeModal();
      renderDataList();
      showToast('Kebiasaan tercatat! 🎉');
    }

    function setFilter(filter) {
      currentFilter = filter;
      editingId = null;
      
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-royal', 'text-white');
        btn.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
      });
      
      const activeBtn = document.getElementById(`filter-${filter}`);
      activeBtn.classList.add('bg-royal', 'text-white');
      activeBtn.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');
      
      // Show/hide date selector for daily & weekly, hide for monthly
      if (filter === 'monthly') {
        document.getElementById('date-selector').classList.add('hidden');
        document.getElementById('month-selector').classList.remove('hidden');
      } else {
        document.getElementById('date-selector').classList.remove('hidden');
        document.getElementById('month-selector').classList.add('hidden');
      }
      
      renderDataList();
    }

    function getWeekStart(date) {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    }

    function getFilteredData() {
      const selectedDate = new Date(document.getElementById('select-date').value);
      
      if (currentFilter === 'daily') {
        const dateStr = document.getElementById('select-date').value;
        return habitsData.filter(d => d.date === dateStr);
      } else if (currentFilter === 'weekly') {
        const weekStart = getWeekStart(selectedDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        return habitsData.filter(d => {
          const dataDate = new Date(d.date);
          return dataDate >= weekStart && dataDate <= weekEnd;
        });
      } else if (currentFilter === 'monthly') {
        const month = parseInt(document.getElementById('select-month').value);
        const year = parseInt(document.getElementById('select-year').value);
        return habitsData.filter(d => {
          const date = new Date(d.date);
          return date.getMonth() === month && date.getFullYear() === year;
        });
      }
      return habitsData;
    }

    function renderDataList() {
      const container = document.getElementById('data-list');
      const filteredData = getFilteredData();
      
      // Sort by date descending
      filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      if (filteredData.length === 0) {
        container.innerHTML = `
          <div class="bg-white rounded-2xl p-6 text-center border border-slate-100">
            <svg class="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-slate-400 text-sm">Belum ada data kebiasaan</p>
          </div>
        `;
      } else {
        container.innerHTML = filteredData.map(item => `
          <div class="bg-white rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
            <div class="text-2xl">${item.icon}</div>
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-slate-800 text-sm">${item.habit}</h4>
              ${editingId === item.id ? `
                <div class="space-y-2 mt-2">
                  <input type="date" value="${item.date}" class="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs">
                  <input type="time" value="${item.time || ''}" class="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs">
                  <input type="text" value="${item.note || ''}" placeholder="Keterangan" class="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs">
                </div>
              ` : `
                <p class="text-slate-500 text-xs mt-0.5">${formatDate(item.date)}${item.time ? ' • ' + item.time : ''}</p>
                ${item.note ? `<p class="text-slate-600 text-xs mt-1 bg-slate-50 px-2 py-1 rounded-lg inline-block">${item.note}</p>` : ''}
              `}
            </div>
            ${editingId === item.id ? `
              <div class="flex gap-1">
                <button onclick="saveEditedHabit(${item.id})" class="text-green-500 hover:text-green-700 p-1" title="Simpan">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </button>
                <button onclick="cancelEditHabit()" class="text-slate-400 hover:text-slate-600 p-1" title="Batal">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ` : `
              <div class="flex gap-1">
                <button onclick="editHabit(${item.id})" class="text-blue-500 hover:text-blue-700 p-1" title="Edit">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button onclick="deleteHabit(${item.id})" class="text-slate-400 hover:text-red-500 p-1" title="Hapus">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            `}
          </div>
        `).join('');
      }
      
      document.getElementById('data-count').textContent = `Total: ${filteredData.length} data`;
    }

    function editHabit(id) {
      editingId = id;
      renderDataList();
    }

    function cancelEditHabit() {
      editingId = null;
      renderDataList();
    }

    function saveEditedHabit(id) {
      const item = habitsData.find(d => d.id === id);
      if (item) {
        const container = document.getElementById('data-list');
        const itemEl = container.querySelector(`button[onclick="editHabit(${id})"]`)?.closest('.flex-1')?.parentElement;
        
        if (itemEl) {
          const inputs = itemEl.querySelectorAll('input');
          item.date = inputs[0]?.value || item.date;
          item.time = inputs[1]?.value || item.time;
          item.note = inputs[2]?.value || item.note;
            item.updated_at = new Date().toISOString();          
          localStorage.setItem('7kaih_habits', JSON.stringify(habitsData));
          editingId = null;
          renderDataList();
          showToast('Data diperbarui! ✏️');
        }
      }
    }

    function deleteHabit(id) {
      const item = document.querySelector(`button[onclick="deleteHabit(${id})"]`).parentElement;
      
      // Two-step deletion
      if (!item.dataset.confirmDelete) {
        item.dataset.confirmDelete = 'true';
        item.classList.add('bg-red-50', 'border-red-200');
        item.querySelector('button').innerHTML = `
          <span class="text-xs text-red-500 font-semibold">Hapus?</span>
        `;
        setTimeout(() => {
          if (item.dataset.confirmDelete) {
            delete item.dataset.confirmDelete;
            item.classList.remove('bg-red-50', 'border-red-200');
            item.querySelector('button').innerHTML = `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            `;
          }
        }, 3000);
        return;
      }
      
      habitsData = habitsData.filter(d => d.id !== id);
      localStorage.setItem('7kaih_habits', JSON.stringify(habitsData));
      renderDataList();
      showToast('Data dihapus');
    }

    function formatDate(dateStr) {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const date = new Date(dateStr);
      return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    function showToast(message) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-message').textContent = message;
      toast.classList.remove('opacity-0');
      toast.classList.add('opacity-100');
      setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.add('opacity-0');
      }, 2500);
    }

    function exportPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      const filteredData = getFilteredData();
      
      if (!studentData || !studentData.name) {
        showToast('Mohon isi identitas siswa terlebih dahulu!');
        return;
      }
      
      if (filteredData.length === 0) {
        showToast('Tidak ada data untuk diexport!');
        return;
      }
      
      // Sort by date
      filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Page dimensions: A4 landscape = 297 x 210 mm
      const pageWidth = doc.internal.pageSize.getWidth(); // 297
      const pageHeight = doc.internal.pageSize.getHeight(); // 210
      const centerX = pageWidth / 2;
      const leftMargin = 10;
      const rightMargin = 10;
      const lineSpacing = 3.5; // Spasi 1
      
      // Add header HANYA di halaman pertama
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('JURNAL 7 KEBIASAAN ANAK INDONESIA HEBAT', centerX, 12, { align: 'center' });
      
      // School Name (centered, uppercase)
      const schoolName = window.elementSdk?.config?.school_name || defaultConfig.school_name;
      doc.text(schoolName.toUpperCase(), centerX, 18, { align: 'center' });
      
      // Student Info Section - Tanda titik sejajar vertikal
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      
      // Tentukan posisi kolom untuk rata kanan tanda titik
      const colonX = leftMargin + 25; // Posisi tanda (:) sejajar
      const valueX = colonX + 3; // Posisi nilai mulai dari sini
      
      // Nama Siswa
      doc.text('Nama Siswa', leftMargin, 26);
      doc.text(':', colonX, 26);
      doc.text(studentData.name, valueX, 26);
      
      // Kelas
      doc.text('Kelas', leftMargin, 26 + lineSpacing);
      doc.text(':', colonX, 26 + lineSpacing);
      doc.text(studentData.kelas, valueX, 26 + lineSpacing);
      
      // No. Absen
      doc.text('No. Absen', leftMargin, 26 + lineSpacing * 2);
      doc.text(':', colonX, 26 + lineSpacing * 2);
      doc.text(studentData.absen, valueX, 26 + lineSpacing * 2);
      
      // Periode
      let filterText = 'Periode';
      let filterValue = '';
      if (currentFilter === 'daily') {
        filterValue = 'Harian (' + formatDate(document.getElementById('select-date').value) + ')';
      } else if (currentFilter === 'weekly') {
        const selectedDate = new Date(document.getElementById('select-date').value);
        const weekStart = getWeekStart(selectedDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        filterValue = 'Mingguan (' + formatDate(weekStart.toISOString().split('T')[0]) + ' - ' + formatDate(weekEnd.toISOString().split('T')[0]) + ')';
      } else if (currentFilter === 'monthly') {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        filterValue = months[parseInt(document.getElementById('select-month').value)] + ' ' + document.getElementById('select-year').value;
      }
      
      doc.text(filterText, leftMargin, 26 + lineSpacing * 3);
      doc.text(':', colonX, 26 + lineSpacing * 3);
      doc.text(filterValue, valueX, 26 + lineSpacing * 3);
      
      // Group data by date
      const dataByDate = {};
      filteredData.forEach(item => {
        if (!dataByDate[item.date]) {
          dataByDate[item.date] = {};
        }
        dataByDate[item.date][item.type] = item;
      });
      
      // Create table with one row per date, columns for each habit
      const habitTypes = ['bangun', 'ibadah', 'olahraga', 'makan', 'belajar', 'masyarakat', 'tidur'];
      const tableData = Object.keys(dataByDate).sort().map((date, index) => {
        const dayData = dataByDate[date];
        const row = [
          index + 1,
          formatDate(date)
        ];
        
        // Add columns for each of the 7 habits (just time + note)
        habitTypes.forEach(type => {
          const item = dayData[type];
          if (item) {
            const cellText = item.time + (item.note ? '\n' + item.note : '');
            row.push(cellText);
          } else {
            row.push('');
          }
        });
        
        return row;
      });
      
      // Create headers with habit names only (no icons)
      const headers = ['No', 'Tanggal'];
      habitTypes.forEach(type => {
        headers.push(habitConfig[type].title);
      });
      
      // Calculate table width to fit with 1cm margins
      const tableWidth = pageWidth - leftMargin - rightMargin; // 277mm
      
      // Calculate column widths - equal for 7 habits
      const noColWidth = 8;
      const dateColWidth = 25;
      const habitColWidth = (tableWidth - noColWidth - dateColWidth) / 7; // ~32mm each
      
      // Jarak 1 baris ke tabel (3.5mm) dari periode
      const tableStartY = 26 + lineSpacing * 4 + lineSpacing;
      
      // Create table - tetap di halaman yang sama, lanjut ke halaman berikutnya jika perlu
      doc.autoTable({
        startY: tableStartY,
        head: [headers],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [219, 234, 254],
          textColor: [0, 0, 0],
          fontSize: 7,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          lineColor: [0, 0, 0],
          lineWidth: 0.3
        },
        bodyStyles: {
          fontSize: 7,
          valign: 'top',
          lineColor: [0, 0, 0],
          lineWidth: 0.3
        },
        columnStyles: {
          0: { cellWidth: noColWidth, halign: 'center' },
          1: { cellWidth: dateColWidth, halign: 'left' },
          2: { cellWidth: habitColWidth, halign: 'center' },
          3: { cellWidth: habitColWidth, halign: 'center' },
          4: { cellWidth: habitColWidth, halign: 'center' },
          5: { cellWidth: habitColWidth, halign: 'center' },
          6: { cellWidth: habitColWidth, halign: 'center' },
          7: { cellWidth: habitColWidth, halign: 'center' },
          8: { cellWidth: habitColWidth, halign: 'center' }
        },
        margin: { left: leftMargin, right: rightMargin }
      });
      
      // Get final Y position untuk tanda tangan
      const finalY = doc.lastAutoTable.finalY + 5;
      
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      
      // Tanggal di atas (kanan)
      const rightSideX = pageWidth - rightMargin - 50;
      doc.text('Denpasar, ' + new Date().toLocaleDateString('id-ID'), rightSideX, finalY);
      
      // Jarak 1 baris spasi (3.5mm), kemudian label Orang Tua/Wali (kiri) dan Wali Kelas (kanan) - sejajar
      const labelY = finalY + lineSpacing;
      doc.text('Orang Tua/Wali', leftMargin + 8, labelY);
      doc.text('Wali Kelas', rightSideX, labelY);
      
      // Jarak untuk ruang tanda tangan (15mm)
      const signLineY = labelY + 15;
      
      // Garis untuk tanda tangan Orang Tua (kiri)
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.line(leftMargin + 8, signLineY, leftMargin + 43, signLineY);
      
      // Garis untuk tanda tangan Wali Kelas (kanan) - sejajar dengan garis ortu
      doc.line(rightSideX, signLineY, rightSideX + 35, signLineY);
      
      // Add page numbers and print date at bottom
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(128);
        doc.text(`Halaman ${i} dari ${pageCount}`, centerX, 205, { align: 'center' });
        doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, leftMargin, 205);
      }
      
      // Save
      const filename = `Jurnal_7KAIH_${studentData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      showToast('PDF berhasil didownload! 📄');
    }

    // Close modal on overlay click
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') {
        closeModal();
      }
    });

