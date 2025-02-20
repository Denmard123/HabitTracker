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

  // Setelah elemen dirender, panggil fungsi yang sesuai
  setTimeout(() => {
    if (activeFeature === 'settings') {
      setting();  // Memastikan pengaturan diterapkan setelah halaman settings dirender
    } else if (activeFeature === 'dashboard') {
      initializeChart();
      displayCurrentTime();
      updateCalendar();
    } else if (activeFeature === 'habit-list') {
      initHabitTracker();
    } else if (activeFeature === 'rekapitulasi') {
      fetchAndRenderRekapitulasi();
    }
  }, 0);
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
          <a href="#" class="text-white hover:text-blue-400">Facebook</a>
          <a href="#" class="text-white hover:text-blue-400">Twitter</a>
          <a href="#" class="text-white hover:text-blue-400">Instagram</a>
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
    <div class="sm:hidden bg-gray-800 text-white p-4">
      <div class="dropdown relative">
        <button tabindex="0" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
        <ul 
          tabindex="0" 
          class="menu menu-compact dropdown-content absolute mt-2 z-50 w-52 bg-gray-800 p-2 rounded-box shadow-lg">
          <li class="hover:bg-gray-700"><button data-feature="dashboard" class="w-full text-left py-2">Dashboard</button></li>
          <li class="hover:bg-gray-700"><button data-feature="habit-list" class="w-full text-left py-2">Daftar Kebiasaan</button></li>
          <li class="hover:bg-gray-700"><button data-feature="rekapitulasi" class="w-full text-left py-2">Rekapitulasi</button></li>
          <li class="hover:bg-gray-700"><button data-feature="settings" class="w-full text-left py-2">Pengaturan</button></li>
        </ul>
      </div>
    </div>
  `;
}

// Event binding untuk navigasi
setTimeout(() => {
  document.querySelectorAll('.dropdown-content button').forEach((item) => {
    item.addEventListener('click', (e) => {
      const featureId = e.currentTarget.getAttribute('data-feature');
      renderHabitTracker(featureId);

      // Menutup dropdown setelah klik
      const dropdown = document.querySelector('.dropdown-content');
      if (dropdown) dropdown.classList.add('hidden');
    });
  });
}, 0);

  // Fungsi untuk Dashboard
  function renderMainContent() {
    return `
      <div class="flex-1 overflow-y-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Grafik Kebiasaan -->
          <div class="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-semibold text-gray-700 text-center mb-6">Grafik Kebiasaan</h2>
            <div class="relative w-full h-80">
              <canvas id="habitChart" class="block w-full h-full"></canvas>
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
  
  `;
}

// Key untuk penyimpanan utama dan rekapitulasi
const MAIN_STORAGE_KEY = "habitTrackerData";
const RECAP_STORAGE_KEY = "habitRecapData";

// Fungsi untuk mendapatkan data kebiasaan dari penyimpanan utama
function getHabitData() {
  const data = localStorage.getItem(MAIN_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Fungsi untuk menyimpan data kebiasaan ke penyimpanan utama
function saveHabitData(data) {
  localStorage.setItem(MAIN_STORAGE_KEY, JSON.stringify(data));
}

// Fungsi untuk mendapatkan data rekapitulasi
function getHabitRecapData() {
  const recapData = localStorage.getItem(RECAP_STORAGE_KEY);
  return recapData ? JSON.parse(recapData) : [];
}

// Fungsi untuk menyimpan data rekapitulasi
function saveHabitRecapData(data) {
  localStorage.setItem(RECAP_STORAGE_KEY, JSON.stringify(data));
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

  // Mengambil data dari LocalStorage khusus rekapitulasi
  const data = getHabitRecapData();

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
      <td class="border px-4 py-2">${item.status ? 'Selesai' : 'Gagal'}</td>
      <td class="border px-4 py-2">${item.tanggal ? new Date(item.tanggal).toLocaleString() : 'N/A'}</td>
    </tr>
  `).join('');
}

// Fungsi untuk menginisialisasi chart menggunakan data dari LocalStorage
function initializeChart() {
  const ctx = document.getElementById("habitChart").getContext("2d");

  // Gradient untuk background chart
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(54, 162, 235, 0.6)");
  gradient.addColorStop(1, "rgba(54, 162, 235, 0.1)");

  // Ambil data dari LocalStorage khusus rekapitulasi
  const habitData = getHabitRecapData();

  // Jika tidak ada data, gunakan default
  if (!habitData || habitData.length === 0) {
    console.warn("⚠️ Tidak ada data rekapitulasi. Menggunakan data default.");
  }

  // Hitung jumlah kebiasaan selesai & gagal per hari
  const labels = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const selesaiPerHari = new Array(7).fill(0);
  const gagalPerHari = new Array(7).fill(0);

  habitData.forEach((habit) => {
    if (habit.tanggal) {
      const dayIndex = new Date(habit.tanggal).getDay(); // Ambil index hari (0 = Minggu, 6 = Sabtu)
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Geser index agar Senin di awal

      if (habit.status) {
        selesaiPerHari[adjustedIndex] += 1; // Tambah jumlah kebiasaan selesai
      } else {
        gagalPerHari[adjustedIndex] += 1; // Tambah jumlah kebiasaan gagal
      }
    }
  });

  // Inisialisasi Chart.js
  new Chart(ctx, {
    type: "bar", // Menggunakan bar chart agar lebih jelas
    data: {
      labels: labels,
      datasets: [
        {
          label: "Selesai",
          data: selesaiPerHari,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
        {
          label: "Gagal",
          data: gagalPerHari,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { font: { size: 14 } },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => tooltipItem.dataset.label + ": " + tooltipItem.raw + " Kebiasaan",
          },
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
      scales: {
        x: {
          ticks: { font: { size: 12 } },
        },
        y: {
          ticks: {
            font: { size: 12 },
            beginAtZero: true,
            callback: (value) => value + " Kebiasaan",
          },
        },
      },
    },
  });
}
  
// Fungsi untuk menginisialisasi tracker kebiasaan
function initHabitTracker() {
  const habitInput = document.getElementById("habit-input");
  const habitTime = document.getElementById("habit-time");
  const habitList = document.getElementById("habit-list");

  document.getElementById("add-habit").addEventListener("click", () => {
    const habitName = habitInput.value.trim();
    const time = habitTime.value;

    if (!habitName || !time) {
      displayAlert("Harap masukkan kegiatan dan waktu.", "error");
      return;
    }

    const targetTime = new Date(time);
    const now = new Date();

    if (targetTime <= now) {
      displayAlert("Waktu sudah terlewat. Pilih waktu yang valid.", "error");
      return;
    }

    let habits = getHabitData();

    if (!habits.some((h) => h.nama === habitName && h.waktu === time)) {
      const newHabit = { nama: habitName, waktu: time, status: null };
      habits.push(newHabit);
      saveHabitData(habits);
    }

    const habitItem = createHabitItem(habitName, time);
    habitList.appendChild(habitItem);
    resetInputs(habitInput, habitTime);

    setTimeout(() => handleTimeout(habitItem, habitName, time), targetTime - now);
  });

  // Muat data dari LocalStorage
  loadHabits();
}

// Fungsi untuk memuat kebiasaan dari penyimpanan
function loadHabits() {
  const habits = getHabitData();
  const habitList = document.getElementById("habit-list");

  habits.forEach((habit) => {
    const habitItem = createHabitItem(habit.nama, habit.waktu);
    habitList.appendChild(habitItem);
  });
}

// Fungsi untuk membuat elemen kebiasaan
function createHabitItem(habitName, time) {
  const li = document.createElement("li");
  li.className = "flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg shadow-md mb-4";

  li.innerHTML = `
    <span class="text-gray-700 font-medium">${habitName} (Waktu: ${time})</span>
    <div class="flex items-center space-x-3">
      <button class="selesai-button bg-green-500 text-white py-1 px-4 rounded-lg hidden">Selesai</button>
      <button class="gagal-button bg-red-500 text-white py-1 px-4 rounded-lg hidden">Gagal</button>
    </div>
  `;

  return li;
}

// Fungsi untuk menangani timeout kebiasaan
function handleTimeout(habitItem, habitName, time) {
  displayAlert(`Saatnya ${habitName}!`, "info");

  const selesaiButton = habitItem.querySelector(".selesai-button");
  const gagalButton = habitItem.querySelector(".gagal-button");
  const finishButton = document.getElementById("finish");

  selesaiButton.classList.remove("hidden");
  gagalButton.classList.remove("hidden");
  finishButton.classList.remove("hidden");

  selesaiButton.addEventListener("click", () => handleCompletion(habitItem, habitName, time, true), { once: true });
  gagalButton.addEventListener("click", () => handleCompletion(habitItem, habitName, time, false), { once: true });
}

// Fungsi untuk menangani status kebiasaan (Selesai/Gagal)
function handleCompletion(habitItem, habitName, time, isCompleted) {
  const listTarget = isCompleted ? document.getElementById("completed-list") : document.getElementById("failed-list");
  const statusText = isCompleted ? "Selesai!" : "Gagal!";
  const bgColor = isCompleted ? "bg-green-100 hover:bg-green-200" : "bg-red-100 hover:bg-red-200";
  const textColor = isCompleted ? "text-green-600" : "text-red-600";

  const li = document.createElement("li");
  li.className = `flex justify-between items-center ${bgColor} px-4 py-2 rounded-lg shadow-md mb-2`;
  li.innerHTML = `${habitName} (Waktu: ${time}) <span class="${textColor} font-semibold">${statusText}</span>`;

  listTarget.appendChild(li);
  habitItem.remove();
}

// Fungsi untuk menyimpan data ke rekapan
document.getElementById("finish").addEventListener("click", () => {
  const completedList = document.getElementById("completed-list");
  const failedList = document.getElementById("failed-list");

  if (!completedList || !failedList) {
    displayAlert("❌ Elemen daftar tidak ditemukan.", "error");
    return;
  }

  if (completedList.children.length === 0 && failedList.children.length === 0) {
    displayAlert("❌ Belum ada data yang diselesaikan atau gagal!", "error");
    return;
  }

  const currentTime = new Date().toISOString();
  const completedData = Array.from(completedList.children).map(li => ({
    nama: li.textContent.split("(")[0].trim(),
    tanggal: currentTime,
    status: true,
  }));

  const failedData = Array.from(failedList.children).map(li => ({
    nama: li.textContent.split("(")[0].trim(),
    tanggal: currentTime,
    status: false,
  }));

  const existingRecap = getHabitRecapData();
  const newRecapData = [...existingRecap, ...completedData, ...failedData];
  saveHabitRecapData(newRecapData);

  displayAlert("✅ Data berhasil disimpan!", "success");

  completedList.innerHTML = "";
  failedList.innerHTML = "";
});

function displayAlert(message, type) {
    const alertBox = document.createElement("div");
    alertBox.className = `fixed top-5 right-5 px-4 py-2 rounded-lg shadow-md ${type === "success" ? "bg-green-500 text-white" : type === "error" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
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

// Fungsi untuk merender pengaturan
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

  // Terapkan tema
  applyDarkMode(savedTheme === "dark");

  // Fungsi untuk menyimpan pengaturan
  function saveSettings() {
    localStorage.setItem("theme", themeSelect.value);
    localStorage.setItem("language", languageSelect.value);
    localStorage.setItem("notifications", notificationsCheckbox.checked);

    // Terapkan perubahan tema langsung
    applyDarkMode(themeSelect.value === "dark");

    // Render ulang halaman setelah perubahan pengaturan
    renderHabitTracker('settings');
  }

  // Event listener untuk mengubah tema
  themeSelect.addEventListener("change", saveSettings);

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
  const settingsForm = document.getElementById("settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Mencegah reload halaman
      saveSettings(); // Simpan pengaturan
      alert("Pengaturan telah disimpan!");
    });
  }
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

