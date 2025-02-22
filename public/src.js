// Inisialisasi Supabase Client dengan cara yang benar
// const { createClient } = supabase;

// const SUPABASE_URL = "https://kxmnvtgnwuhdkrzzpwxi.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bW52dGdud3VoZGtyenpwd3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTA3OTgsImV4cCI6MjA1NTI2Njc5OH0.l0DeaGtDKbr-EhNX5DpEUDSNtF1Y3L_Rdqn2bUC7JcA";

// // Membuat Supabase Client
// window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// console.log('✅ Supabase client berhasil diinisialisasi:', window.supabaseClient);


document.addEventListener('DOMContentLoaded', () => {
  const mulaiButton = document.getElementById('mulai');
  // Menambahkan event listener untuk animasi tombol
  mulaiButton.addEventListener('click', () => {
    // Tambahkan animasi smooth (misalnya, perubahan skala dan opacity) pada tombol
    mulaiButton.classList.add('scale-110', 'opacity-90', 'transition-all', 'duration-1000');

    // Setelah animasi selesai, pindahkan ke halaman isi
    setTimeout(() => {
      // Hapus animasi untuk kembali ke keadaan semula
      mulaiButton.classList.remove('scale-110', 'opacity-90');

      // Panggil fungsi renderHabitTracker untuk mengganti konten
      renderHabitTracker('dashboard');
    }, 1000); // Durasi animasi dalam milidetik (1 detik)
  });

// Fungsi untuk merender halaman isi (habit tracker) dengan navigasi
function renderHabitTracker(activeFeature = 'dashboard') {
  document.body.innerHTML = `
    <div class="flex flex-col sm:flex-row min-h-screen w-full bg-gradient-to-r from-green-200 via-blue-300 to-purple-400">
      ${renderSidebar(activeFeature)}
      ${renderNavbarSmall()}
      <div class="flex-1">
        <div class="p-6">
          ${renderContentByFeature(activeFeature)}
        </div>
      </div>
    </div>
  `;
   initializeNavbarEvents();
   // Setelah elemen dirender, terapkan pengaturan
   if (activeFeature === 'settings') {
    setting();  // Memanggil setting() di sini untuk memastikan pengaturan diterapkan
  }

  // Pastikan dipanggil setelah elemen sudah dirende
  if (activeFeature === 'dashboard') {
    initializeChart();
    displayCurrentTime();
    updateCalendar();
  } else if (activeFeature === 'habit-list') {
    initHabitTracker();
  } else if (activeFeature === 'rekapitulasi') {
    setTimeout(fetchAndRenderRekapitulasi, 0);
  }
}

  // Fungsi konten dengan fitur yang aktif
  function renderContentByFeature(activeFeature) {
    switch (activeFeature) {
      case 'dashboard':
        return renderMainContent();
      case 'habit-list':
        return renderHabitList();
      case 'rekapitulasi':
        return renderRekapitulasi();
      case 'settings':
        return renderSettings();
        default:
          return '';
    }
  }
  
function renderSidebar(activeFeature) {
  const features = [
    { name: 'Dashboard', icon: 'dashboard', id: 'dashboard' },
    { name: 'Daftar Kebiasaan', icon: 'list_alt', id: 'habit-list' },
    { name: 'Rekapitulasi', icon: 'bar_chart', id: 'rekapitulasi' },
    { name: 'Pengaturan', icon: 'settings', id: 'settings' },
  ];

  // Template sidebar
  const sidebar = `
    <div class="hidden sm:flex sm:w-64 bg-white shadow-lg flex-col min-h-screen">
      <div class="text-center text-xl font-bold p-4 text-blue-600">
        Habit Tracker
      </div>
      <ul class="p-4 flex-grow space-y-2">
        ${features
          .map((feature) => {
            const isActive = feature.id === activeFeature ? 'bg-blue-100 text-blue-600 font-semibold' : '';
            return `
              <li class="flex items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-50 ${isActive}" 
                  data-feature="${feature.id}">
                <span class="material-icons-outlined mr-3">${feature.icon}</span>
                <span class="text-lg">${feature.name}</span>
              </li>
            `;
          })
          .join('')}
      </ul>

      <!-- Footer Section -->
      <div class="p-4 bg-gray-800 text-white text-center mt-auto">
        <p class="text-sm">&copy; 2025 Habit Tracker. All Rights Reserved.</p>
        <div class="flex justify-center space-x-4 mt-2">
          <a href="https://web.facebook.com/acil.gionino/?_rdc=1&_rdr#" class="text-white hover:text-blue-400">Facebook</a>
          <a href="https://trakteer.id/den_mardiyana" class="text-white hover:text-blue-400">For Coffe</a>
          <a href="https://www.instagram.com/denmardiyana312/" class="text-white hover:text-blue-400">Instagram</a>
        </div>
      </div>
    </div>
  `;

  // Render sidebar ke halaman
  setTimeout(() => {
    // Event binding untuk semua item sidebar
    document.querySelectorAll('[data-feature]').forEach((item) => {
      item.addEventListener('click', (e) => {
        const featureId = e.currentTarget.getAttribute('data-feature');
        renderHabitTracker(featureId); // Fungsi untuk navigasi antar fitur
      });
    });
  }, 0);

  return sidebar;
}  

// Fungsi untuk Navbar kecil
function renderNavbarSmall() {
return `
  <div class="sm:hidden bg-gray-900 text-white px-5 py-3 flex justify-between items-center shadow-md">
    <div class="relative">
      <button id="menuBtn" class="btn btn-ghost btn-circle focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 transition-transform duration-300 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
      <ul id="menuDropdown" class="hidden absolute left-0 mt-3 w-56 bg-gray-800 text-white rounded-lg shadow-2xl opacity-0 transform scale-95 transition-all duration-300 z-50">
        <li><button data-feature="dashboard" class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700 rounded-md transition transform hover:scale-105"><span>🏠</span> Dashboard</button></li>
        <li><button data-feature="habit-list" class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700 rounded-md transition transform hover:scale-105"><span>📋</span> Daftar Kebiasaan</button></li>
        <li><button data-feature="rekapitulasi" class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700 rounded-md transition transform hover:scale-105"><span>📊</span> Rekapitulasi</button></li>
        <li><button data-feature="settings" class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700 rounded-md transition transform hover:scale-105"><span>⚙️</span> Pengaturan</button></li>
      </ul>
    </div>
    <a href="https://trakteer.id/den_mardiyana" target="_blank" class="btn btn-ghost btn-circle hover:scale-110 transition-transform">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-yellow-400 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 8h1a2 2 0 1 1 0 4h-1V8ZM3 4h15a3 3 0 0 1 3 3v5a5 5 0 0 1-5 5h-2v2a2 2 0 1 1-4 0v-2H5a2 2 0 1 1-2-2V6a2 2 0 0 1 2-2Zm15 10a3 3 0 0 0 3-3V7a1 1 0 0 0-1-1h-1v8Zm-2-8H5v9a.98.98 0 0 0 .28.7.99.99 0 0 0 .72.3h9a3 3 0 0 0 3-3V6ZM5 16h10H5Z"></path>
      </svg>
    </a>
  </div>
`;

}

function initializeNavbarEvents() {
  const menuBtn = document.getElementById("menuBtn");
  const menuDropdown = document.getElementById("menuDropdown");

  if (!menuBtn || !menuDropdown) return; // Cegah error jika elemen belum ada

  // Toggle menu saat tombol ditekan
  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Hindari trigger event click pada document

    const isHidden = menuDropdown.classList.contains("hidden");

    if (isHidden) {
      menuDropdown.classList.remove("hidden");
      setTimeout(() => {
        menuDropdown.classList.remove("opacity-0", "scale-95");
        menuDropdown.classList.add("opacity-100", "scale-100");
      }, 10);
    } else {
      menuDropdown.classList.remove("opacity-100", "scale-100");
      menuDropdown.classList.add("opacity-0", "scale-95");
      setTimeout(() => menuDropdown.classList.add("hidden"), 300);
    }
  });

  // Menutup menu jika klik di luar area dropdown
  document.addEventListener("click", (event) => {
    if (!menuBtn.contains(event.target) && !menuDropdown.contains(event.target)) {
      menuDropdown.classList.remove("opacity-100", "scale-100");
      menuDropdown.classList.add("opacity-0", "scale-95");
      setTimeout(() => menuDropdown.classList.add("hidden"), 300);
    }
  });

  // Event klik pada dropdown item
  document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener("click", (e) => {
      const featureId = e.currentTarget.getAttribute("data-feature");
      renderHabitTracker(featureId);

      // Tutup dropdown setelah klik
      menuDropdown.classList.remove("opacity-100", "scale-100");
      menuDropdown.classList.add("opacity-0", "scale-95");
      setTimeout(() => menuDropdown.classList.add("hidden"), 300);
    });
  });
}


  // Fungsi untuk Dashboard
  function renderMainContent() {
    return `
      <div class="flex-1 overflow-y-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Grafik Kebiasaan -->
          <div class="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">Grafik Kebiasaan</h2>
            <div id="chartContainer" class="relative p-4 md:p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
            <canvas id="habitChart" class="w-full h-80 md:h-96"></canvas>
            <div id="recapContainer" class="mt-4"></div>
            </div>
          </div>
          
          <!-- Waktu Saat Ini -->
          <div class="bg-gradient-to-br from-blue-500 to-indigo-700 shadow-xl rounded-lg p-6 text-white">
            <h2 class="text-2xl font-bold text-center mb-6">Waktu Saat Ini</h2>
            <div id="currentTime" class="text-center">
              <div class="flex justify-center items-center space-x-3">
                <span class="text-4xl font-bold">Loading...</span>
              </div>
              <p class="text-gray-200 text-sm mt-4">Zona waktu lokal Anda</p>
            </div>
  
            <!-- Kalender -->
            <div id="calendar" class="mt-8 text-center">
              <div id="calendarContainer" class="inline-block p-4 bg-white text-blue-500 rounded-lg shadow-md">
                <p id="calendarDay" class="text-4xl font-semibold">00</p>
                <p id="calendarMonthYear" class="text-sm mt-2">Month, Year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Fungsi untuk merender daftar kebiasaan
  function renderHabitList() {
    return `
      <div class="bg-white shadow-lg rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Daftar Kebiasaan</h2>
        <input id="habit-input" type="text" placeholder="Nama kebiasaan" class="border p-2 rounded-lg mb-4 w-full" />
        <input id="habit-time" type="time" class="border p-2 rounded-lg mb-4 w-full" />
        <button id="add-habit" class="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4">Tambah Kebiasaan</button>
        <ul id="habit-list" class="space-y-4">
          <!-- Kebiasaan akan ditambahkan secara dinamis -->
        </ul>
        <div class="container mx-auto mt-6">
          <!-- Completed List -->
          <div class="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 class="text-lg font-bold text-green-600 mb-3">Kebiasaan Selesai</h2>
            <ul id="completed-list" class="space-y-2">
              <!-- Elemen berhasil ditambahkan akan muncul di sini -->
            </ul>
            <h2 class="text-lg font-bold text-red-600 mb-3">Kebiasaan Gagal</h2>
            <ul id="failed-list" class="space-y-2">
              <!-- Elemen gagal ditambahkan akan muncul di sini -->
            </ul>
            <button id="finish" class="finish-button bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600 mt-4">
              Finish
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  
// Fungsi untuk merender rekapitulasi
function renderRekapitulasi() {
  return `
    <h2 class="text-xl font-bold mb-4">Rekapitulasi Kebiasaan</h2>
    <table id="rekapitulasi-table" class="min-w-full">
    <thead>
      <tr>
        <th class="border px-4 py-2">No</th>
        <th class="border px-4 py-2">Kegiatan</th>
        <th class="border px-4 py-2">Status</th>
        <th class="border px-4 py-2">Tanggal</th>
      </tr>
    </thead>
    <tbody>
      <!-- Data akan dirender di sini -->
    </tbody>
  </table>
  <button id="reset-rekap" class="bg-red-500 text-white px-4 py-2 mt-4 rounded-lg">
      Reset Data
    </button>
  
  `;
}

// Fungsi untuk mendapatkan data dari LocalStorage
function getHabitData() {
  const data = localStorage.getItem('habitTrackerData');
  return data ? JSON.parse(data) : [];
}

// Fungsi untuk menyimpan data ke LocalStorage
function saveHabitData(data) {
  localStorage.setItem('habitTrackerData', JSON.stringify(data));
}



// Fungsi untuk mengambil dan merender data di halaman rekapitulasi
function fetchAndRenderRekapitulasi() {
  console.log("🔍 Mengambil data rekapitulasi dari LocalStorage...");

  const tableBody = document.querySelector("#rekapitulasi-table tbody");

  if (!tableBody) {
    console.warn("❌ Elemen tabel tidak ditemukan.");
    return;
  }

  tableBody.innerHTML = ''; // Kosongkan tabel sebelum render

  const data = getHabitData();

  if (!data || data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="border px-4 py-2 text-center text-gray-500">
          ⚠️ Belum ada data rekapitulasi.
        </td>
      </tr>
    `;
    return;
  }

  console.log("✅ Data rekapitulasi dari LocalStorage:", data);

tableBody.innerHTML = data.map((item, index) => `
  <tr>
    <td class="border px-4 py-2">${index + 1}</td>
    <td class="border px-4 py-2">${item.nama || 'N/A'}</td>
    <td class="border px-4 py-2">${item.status === 'selesai' ? 'Selesai' : 'Gagal'}</td>
    <td class="border px-4 py-2">${item.tanggal ? new Date(item.tanggal).toLocaleString() : 'N/A'}</td>
  </tr>
`).join('');

}

// Fungsi untuk menghapus data rekapitulasi dari LocalStorage
function resetRekapitulasi() {
  if (confirm("⚠️ Apakah Anda yakin ingin menghapus semua data rekapitulasi?")) {
    try {
      localStorage.removeItem("habitTrackerData"); // Hapus semua data
      fetchAndRenderRekapitulasi(); // Perbarui tampilan setelah reset
      alert("✅ Data rekapitulasi berhasil dihapus!");
    } catch (error) {
      console.error("❌ Error saat menghapus data rekapitulasi:", error);
      alert("❌ Gagal menghapus data rekapitulasi. Coba lagi!");
    }
  }
}

// Event listener untuk tombol reset setelah halaman dirender
document.addEventListener("click", (event) => {
  if (event.target.id === "reset-rekap") {
    resetRekapitulasi();
  }
});


// Fungsi initializeChart
function initializeChart() {
  const ctx = document.getElementById("habitChart").getContext("2d");
  const data = getHabitData() || [];

  // Kelompokkan data berdasarkan tanggal
  const groupedData = {};
  data.forEach((item) => {
    const dateKey = item.tanggal ? new Date(item.tanggal).toLocaleDateString() : "N/A";
    if (!groupedData[dateKey]) {
      groupedData[dateKey] = { selesai: 0, gagal: 0, details: [] };
    }
    groupedData[dateKey][item.status]++;
    groupedData[dateKey].details.push(item);
  });

  // Konversi data untuk chart
  const labels = Object.keys(groupedData);
  const completedCounts = labels.map((date) => groupedData[date].selesai);
  const failedCounts = labels.map((date) => groupedData[date].gagal);

  // Hapus canvas lama untuk mencegah duplikasi
  document.getElementById("habitChart").remove();
  const newCanvas = document.createElement("canvas");
  newCanvas.id = "habitChart";
  newCanvas.classList.add("w-full", "h-64");
  document.getElementById("chartContainer").appendChild(newCanvas);
  const newCtx = newCanvas.getContext("2d");

  // Render chart sebagai garis
  new Chart(newCtx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Kebiasaan Selesai",
          data: completedCounts,
          borderColor: "rgba(0, 192, 255, 1)",
          backgroundColor: "rgba(0, 192, 255, 0.2)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Kebiasaan Gagal",
          data: failedCounts,
          borderColor: "rgba(255, 75, 75, 1)",
          backgroundColor: "rgba(255, 75, 75, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#333",
            font: { size: 14, weight: "bold" },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { autoSkip: true, maxTicksLimit: 5, color: "#666", font: { size: 12 } },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#666", font: { size: 12 } },
          grid: { color: "rgba(200, 200, 200, 0.2)" },
        },
      },
    },
  });

  // Render recap container
  const recapContainer = document.getElementById("recapContainer");
  if (!recapContainer) {
    console.error("Element #recapContainer tidak ditemukan!");
    return;
  }

  recapContainer.innerHTML = labels
    .map(
      (date) => `
        <div class="p-4 border rounded-lg mb-4 shadow">
          <h3 class="text-lg font-bold mb-2">🗓 ${date}</h3>
          <ul>
            ${groupedData[date].details
              .map(
                (item) => `
                  <li class="mb-1 ${item.status === "selesai" ? "text-green-600" : "text-red-600"}">
                    ${item.status === "selesai" ? "✅" : "❌"} ${item.nama} (${new Date(item.tanggal).toLocaleTimeString()})
                  </li>`
              )
              .join("")}
          </ul>
        </div>
      `
    )
    .join("");
}


function saveTemporaryData(type, habitName) {
  const storageKey = "tempHabitData";
  const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];

  if (!habitName.trim()) {
    console.error("❌ Nama kebiasaan tidak boleh kosong!");
    displayAlert("❌ Nama kebiasaan tidak boleh kosong!", "error");
    return;
  }

  // Hindari duplikasi
  if (existingData.some(item => item.nama === habitName)) {
    console.warn("⚠️ Habit sudah ada di daftar sementara.");
    return;
  }

  existingData.push({
    nama: habitName,
    tanggal: new Date().toISOString(),
    status: type === "completed" ? true : false
  });

  localStorage.setItem(storageKey, JSON.stringify(existingData));

  console.log(`✅ Habit "${habitName}" disimpan sementara!`);
  displayAlert(`✅ Habit "${habitName}" berhasil disimpan!`, "success");
}


// Fungsi untuk menginisialisasi tracker kebiasaan
function initHabitTracker() {
  const habitInput = document.getElementById('habit-input');
  const habitTime = document.getElementById('habit-time');
  const habitList = document.getElementById('habit-list');
  const storageKey = "tempHabitData";

  // Fungsi untuk menyimpan ke localStorage
  function saveTemporaryData(habitName, time) {
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];
    const targetTime = parseTime(time);

    // Cegah duplikasi data
    if (existingData.some(item => item.nama === habitName)) return;

    existingData.push({ nama: habitName, waktu: time, targetTime: targetTime.getTime() });
    localStorage.setItem(storageKey, JSON.stringify(existingData));
  }

  // Fungsi untuk memuat kebiasaan dari localStorage
  function loadHabits() {
    let storedHabits = JSON.parse(localStorage.getItem(storageKey)) || [];
    console.log("📥 Memuat habit dari localStorage:", storedHabits);

    const now = new Date();

    // Filter hanya yang masih berlaku
    storedHabits = storedHabits.filter(({ targetTime }) => targetTime > now.getTime());

    // Hapus dulu daftar biar gak duplikat saat refresh
    habitList.innerHTML = "";

    storedHabits.forEach(({ nama, waktu, targetTime }) => {
      const habitItem = createHabitItem(nama, waktu);
      habitList.appendChild(habitItem);

      const delay = targetTime - now.getTime();
      if (delay > 0) {
        setTimeout(() => handleTimeout(habitItem, nama, waktu), delay);
      }
    });

    // Simpan ulang habit yang masih valid ke localStorage
    localStorage.setItem(storageKey, JSON.stringify(storedHabits));
  }

  // Tambahkan kebiasaan baru
  document.getElementById('add-habit').addEventListener('click', () => {
    const habitName = habitInput.value.trim();
    const time = habitTime.value;

    if (!habitName || !time) {
      displayAlert('Harap masukkan kegiatan dan waktu.', 'error');
      return;
    }

    const targetTime = parseTime(time);
    const now = new Date();

    if (targetTime <= now) {
      displayAlert('Waktu yang dimasukkan sudah terlewat. Silakan pilih waktu yang valid.', 'error');
      return;
    }

    const habitItem = createHabitItem(habitName, time);
    habitList.appendChild(habitItem);
    resetInputs(habitInput, habitTime);

    // Simpan ke localStorage
    saveTemporaryData(habitName, time);

    console.log("✅ Habit berhasil disimpan:", habitName);

    const delay = targetTime - now;
    setTimeout(() => handleTimeout(habitItem, habitName, time), delay);
  });

  // **Pastikan loadHabits dipanggil setelah UI siap**
  loadHabits();
}

// Fungsi untuk menambah kebiasaan
function createHabitItem(habitName, time) {
  const li = document.createElement('li');
  li.className = 'flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg shadow-md mb-4 transition-all hover:scale-105 hover:bg-gray-200';

  li.innerHTML = `
    <span class="text-gray-700 font-medium text-lg flex-1">${habitName} (Waktu: ${time})</span>
    <div class="flex items-center space-x-3">
      <button class="selesai-button bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 hidden transition-all">Selesai</button>
      <button class="gagal-button bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 hidden transition-all">Gagal</button>
    </div>
  `;

  return li;
}

// Fungsi untuk menangani timeout dan mengelola status kebiasaan
function handleTimeout(habitItem, habitName, time) {
  displayAlert(`Saatnya ${habitName}!`, 'info');

  const selesaiButton = habitItem.querySelector('.selesai-button');
  const gagalButton = habitItem.querySelector('.gagal-button');
  const finishButton = document.getElementById('finish');

  selesaiButton.classList.remove('hidden');
  gagalButton.classList.remove('hidden');
  finishButton.classList.remove('hidden');

  selesaiButton.classList.add('transition-transform', 'hover:scale-110');
  gagalButton.classList.add('transition-transform', 'hover:scale-110');

  if (!selesaiButton.hasAttribute('data-listener-added')) {
    selesaiButton.addEventListener(
      'click',
      () => {
        saveTemporaryData("completed", habitName);
        const completedList = document.getElementById('completed-list');
        if (completedList) {
          const liCompleted = document.createElement('li');
          liCompleted.className = 'flex justify-between items-center bg-green-100 px-4 py-2 rounded-lg shadow-md mb-2 transition-all hover:bg-green-200';
          liCompleted.innerHTML = `${habitName} (Waktu: ${time}) <span class="text-green-600 font-semibold">Selesai!</span>`;
          completedList.appendChild(liCompleted);
          habitItem.remove();
        }
      },
      { once: true }
    );
    selesaiButton.setAttribute('data-listener-added', 'true');
  }

  if (!gagalButton.hasAttribute('data-listener-added')) {
    gagalButton.addEventListener(
      'click',
      () => {
        saveTemporaryData("failed", habitName);
        const failedList = document.getElementById('failed-list');
        if (failedList) {
          const liFailed = document.createElement('li');
          liFailed.className = 'flex justify-between items-center bg-red-100 px-4 py-2 rounded-lg shadow-md mb-2 transition-all hover:bg-red-200';
          liFailed.innerHTML = `${habitName} (Waktu: ${time}) <span class="text-red-600 font-semibold">Gagal!</span>`;
          failedList.appendChild(liFailed);
          habitItem.remove();
        }
      },
      { once: true }
    );
    gagalButton.setAttribute('data-listener-added', 'true');
  }

  finishButton.addEventListener('click', () => {
  try {
    const completedList = document.getElementById('completed-list');
    const failedList = document.getElementById('failed-list');
    const storageKey = "tempHabitData"; // Data sementara

    if (!completedList || !failedList) {
      throw new Error("Elemen daftar tidak ditemukan.");
    }

    // Fungsi untuk mengambil dan menyaring data dari daftar selesai/gagal
    const extractData = (list, status) =>
      Array.from(list.children)
        .map(li => ({
          nama: li.textContent.split('(')[0].trim(),
          tanggal: new Date().toISOString(),
          status
        }))
        .filter(item => item.nama); // Hindari menyimpan elemen kosong

    // Ambil data dari daftar selesai dan gagal
    const completedData = extractData(completedList, "selesai");
    const failedData = extractData(failedList, "gagal");
    const newData = [...completedData, ...failedData];

    if (newData.length === 0) {
      return displayAlert('❌ Tidak ada data baru untuk disimpan!', 'warning');
    }

    const userConfirmed = confirm("Apakah kamu yakin ingin menyimpan progress ini?");
    if (!userConfirmed) return;

    // Ambil data lama dari localStorage menggunakan `habitTrackerData`
    const existingData = getHabitData();
    
    // Gabungkan data lama dengan data baru
    const finalData = Array.isArray(existingData) ? [...existingData, ...newData] : newData;

    // Simpan ke localStorage
    saveHabitData(finalData);
    displayAlert('✅ Data terbaru berhasil disimpan!', 'success');

    // Bersihkan daftar setelah penyimpanan
    completedList.innerHTML = '';
    failedList.innerHTML = '';
    localStorage.removeItem(storageKey);

  } catch (error) {
    console.error("❌ Terjadi kesalahan:", error.message);
    displayAlert(`❌ Terjadi kesalahan: ${error.message}`, 'error');
  }
});

}


// Fungsi untuk reset input
function resetInputs(habitInput, habitTime) {
  habitInput.value = '';
  habitTime.value = '';
}

// Fungsi untuk menampilkan notifikasi
function displayAlert(message, type) {
  const alertBox = document.createElement('div');
  alertBox.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded-lg shadow-md transition-all ${
    type === 'success' ? 'bg-green-500 text-white' : type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
  }`;
  alertBox.textContent = message;

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}

// Fungsi untuk memparsing waktu
function parseTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}


  function displayCurrentTime() {
    const timeElement = document.getElementById('currentTime');

    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        timeElement.innerHTML = `
          <div class="flex justify-center items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-yellow-300 animate-spin-slow" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.25V4.75a.75.75 0 011.5 0v4h3.5a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
            <span class="text-4xl font-bold tracking-wide">${formattedTime}</span>
          </div>
          <p class="text-gray-200 text-sm mt-4">Zona waktu lokal Anda</p>
        `;
    }

    // Update time every second
    updateTime();
    setInterval(updateTime, 1000);
}

  // Kalender
  function updateCalendar() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Update elemen kalender
  const calendarDay = document.getElementById('calendarDay');
  const calendarMonthYear = document.getElementById('calendarMonthYear');
  const calendarContainer = document.getElementById('calendarContainer');

  calendarDay.textContent = day;
  calendarMonthYear.textContent = `${month}, ${year}`;

  // Animasi bounce
  calendarContainer.classList.add('animate-bounce');
}

// // Fungsi untuk merender pengaturan
// function renderSettings() {
//   return `
//     <div class="container mx-auto p-4">
//       <div class="bg-white shadow-md rounded-lg p-6">
//         <h2 class="text-2xl font-semibold text-gray-800 mb-4">Pengaturan</h2>
//         <form id="settingsForm">
//           <div class="mb-4">
//             <label for="theme" class="block text-gray-700 font-medium">Tema</label>
//             <select id="theme" class="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option value="light">Terang</option>
//               <option value="dark">Gelap</option>
//             </select>
//           </div>

//           <div class="mb-4">
//             <label for="language" class="block text-gray-700 font-medium">Bahasa</label>
//             <select id="language" class="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//               <option value="id">Indonesia</option>
//               <option value="en">English</option>
//             </select>
//           </div>

//           <div class="mb-4">
//             <label for="notifications" class="block text-gray-700 font-medium">Notifikasi</label>
//             <div class="flex items-center mt-2">
//               <input type="checkbox" id="notifications" class="mr-2">
//               <span class="text-gray-700">Aktifkan Notifikasi</span>
//             </div>
//           </div>

//           <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none">Simpan Pengaturan</button>
//         </form>
//       </div>
//     </div>
//   `;
// }

// Fungsi pengaturan tema dan lainnya
function setting() {
  const themeSelect = document.getElementById("theme");
  const languageSelect = document.getElementById("language");
  const notificationsCheckbox = document.getElementById("notifications");

  // Ambil pengaturan dari localStorage jika tersedia
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedLanguage = localStorage.getItem("language") || "id";
  const savedNotifications = localStorage.getItem("notifications") === "true";

  // Terapkan pengaturan yang tersimpan
  themeSelect.value = savedTheme;
  languageSelect.value = savedLanguage;
  notificationsCheckbox.checked = savedNotifications;

  // Terapkan tema gelap terlebih dahulu
  applyDarkMode(savedTheme === "dark");

  // Fungsi untuk menyimpan pengaturan
  function saveSettings() {
    localStorage.setItem("theme", themeSelect.value);
    localStorage.setItem("language", languageSelect.value);
    localStorage.setItem("notifications", notificationsCheckbox.checked);
  }

  // Event listener untuk mengubah tema
  themeSelect.addEventListener("change", function () {
    const isDark = themeSelect.value === "dark";
    applyDarkMode(isDark);  // Panggil applyDarkMode untuk tema gelap
    saveSettings();
  });

  // Event listener untuk mengubah bahasa
  languageSelect.addEventListener("change", function () {
    saveSettings();
    alert("Bahasa telah diubah ke " + (languageSelect.value === "id" ? "Indonesia" : "English"));
  });

  // Event listener untuk notifikasi
  notificationsCheckbox.addEventListener("change", function () {
    saveSettings();
    alert(notificationsCheckbox.checked ? "Notifikasi diaktifkan" : "Notifikasi dinonaktifkan");
  });

  // Simpan pengaturan ketika formulir dikirim
  settingsForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah reload halaman
    saveSettings(); // Simpan pengaturan
    alert("Pengaturan telah disimpan!"); // Berikan feedback ke pengguna

    // Pastikan perubahan tema diterapkan
    const isDark = themeSelect.value === "dark";
    applyDarkMode(isDark);  // Panggil applyDarkMode untuk memastikan tema gelap diterapkan
  });
}


// Fungsi untuk menerapkan tema gelap (dark mode)
function applyDarkMode(isDark) {
  const body = document.body;
  if (isDark) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
}

});
