// ── Fungsi penerapan dark mode ────────────────────────────────
function applyDarkMode(isDark) {
  const html = document.documentElement;
  const body = document.body;

  if (isDark) {
    html.classList.add("dark");
    body.classList.add("dark-mode");
    // Inject style override langsung karena Tailwind CDN tidak support darkMode: 'class' secara default
    let darkStyle = document.getElementById("dark-mode-style");
    if (!darkStyle) {
      darkStyle = document.createElement("style");
      darkStyle.id = "dark-mode-style";
      document.head.appendChild(darkStyle);
    }
    darkStyle.textContent = `
      body.dark-mode {
        background-color: #111827 !important;
        color: #f9fafb !important;
      }
      body.dark-mode .bg-white {
        background-color: #1f2937 !important;
        color: #f9fafb !important;
      }
      body.dark-mode .bg-gray-100 {
        background-color: #374151 !important;
        color: #f9fafb !important;
      }
      body.dark-mode .bg-gray-200 {
        background-color: #4b5563 !important;
      }
      body.dark-mode .text-gray-700 {
        color: #e5e7eb !important;
      }
      body.dark-mode .text-gray-800 {
        color: #f3f4f6 !important;
      }
      body.dark-mode .text-gray-500 {
        color: #9ca3af !important;
      }
      body.dark-mode .shadow-lg,
      body.dark-mode .shadow-md,
      body.dark-mode .shadow-2xl,
      body.dark-mode .shadow-xl {
        box-shadow: 0 4px 24px 0 rgba(0,0,0,0.6) !important;
      }
      body.dark-mode .border {
        border-color: #374151 !important;
      }
      body.dark-mode .border-gray-200,
      body.dark-mode .border-emerald-100,
      body.dark-mode .border-purple-100,
      body.dark-mode .border-indigo-100 {
        border-color: #374151 !important;
      }
      body.dark-mode input[type="text"],
      body.dark-mode input[type="time"] {
        background-color: #374151 !important;
        color: #f9fafb !important;
        border-color: #4b5563 !important;
      }
      body.dark-mode .bg-gradient-to-br.from-blue-50 {
        background: linear-gradient(135deg, #1e3a5f, #1f2937) !important;
      }
      body.dark-mode .bg-gradient-to-br.from-emerald-50 {
        background: linear-gradient(135deg, #064e3b, #1f2937) !important;
      }
      body.dark-mode .bg-gradient-to-br.from-purple-50 {
        background: linear-gradient(135deg, #3b0764, #1f2937) !important;
      }
      body.dark-mode .bg-gradient-to-br.from-indigo-50 {
        background: linear-gradient(135deg, #1e1b4b, #1f2937) !important;
      }
      body.dark-mode h2.text-gray-800,
      body.dark-mode h3.text-emerald-800,
      body.dark-mode h3.text-purple-800,
      body.dark-mode h3.text-indigo-800 {
        color: #e5e7eb !important;
      }
      body.dark-mode .text-emerald-800 { color: #6ee7b7 !important; }
      body.dark-mode .text-purple-800  { color: #c4b5fd !important; }
      body.dark-mode .text-indigo-800  { color: #a5b4fc !important; }
      body.dark-mode span.text-gray-700,
      body.dark-mode label span.text-gray-700 {
        color: #d1d5db !important;
      }
      body.dark-mode th {
        background-color: #1f2937 !important;
        color: #f9fafb !important;
      }
      body.dark-mode td {
        background-color: #111827 !important;
        color: #f9fafb !important;
      }
      body.dark-mode .bg-green-100 {
        background-color: #064e3b !important;
      }
      body.dark-mode .bg-red-100 {
        background-color: #7f1d1d !important;
      }
      body.dark-mode #theme-light {
        background-color: #374151 !important;
        border-color: #4b5563 !important;
        color: #e5e7eb !important;
      }
    `;
  } else {
    html.classList.remove("dark");
    body.classList.remove("dark-mode");
    const darkStyle = document.getElementById("dark-mode-style");
    if (darkStyle) darkStyle.textContent = "";
  }

  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// ── Audio context untuk notifikasi suara ────────────────────
function playNotificationSound(type = "default") {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const sounds = {
      default: [
        { freq: 523, dur: 0.1, start: 0 },
        { freq: 659, dur: 0.1, start: 0.12 },
        { freq: 784, dur: 0.2, start: 0.24 }
      ],
      success: [
        { freq: 392, dur: 0.08, start: 0 },
        { freq: 523, dur: 0.08, start: 0.1 },
        { freq: 659, dur: 0.08, start: 0.2 },
        { freq: 784, dur: 0.2,  start: 0.3 }
      ],
      warning: [
        { freq: 440, dur: 0.15, start: 0 },
        { freq: 440, dur: 0.15, start: 0.2 }
      ],
      error: [
        { freq: 300, dur: 0.2, start: 0 },
        { freq: 200, dur: 0.3, start: 0.25 }
      ],
      info: [
        { freq: 660, dur: 0.1, start: 0 },
        { freq: 880, dur: 0.15, start: 0.15 }
      ]
    };

    const notes = sounds[type] || sounds.default;
    notes.forEach(({ freq, dur, start }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });
  } catch (e) {
    console.warn("Audio tidak tersedia:", e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyDarkMode(savedTheme === "dark");

  const mulaiButton = document.getElementById('mulai');
  mulaiButton.addEventListener('click', () => {
    mulaiButton.classList.add('scale-110', 'opacity-90', 'transition-all', 'duration-1000');
    setTimeout(() => {
      mulaiButton.classList.remove('scale-110', 'opacity-90');
      renderHabitTracker('dashboard');
    }, 1000);
  });

// ── renderHabitTracker ────────────────────────────────────────
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

  // Terapkan ulang tema setelah innerHTML diganti
  const currentTheme = localStorage.getItem("theme") || "light";
  applyDarkMode(currentTheme === "dark");

  initializeNavbarEvents();

  if (activeFeature === 'settings') {
    setting();
  } else if (activeFeature === 'dashboard') {
    initializeChart();
    displayCurrentTime();
    updateCalendar();
  } else if (activeFeature === 'habit-list') {
    initHabitTracker();
  } else if (activeFeature === 'rekapitulasi') {
    setTimeout(fetchAndRenderRekapitulasi, 0);
  }
}

// ── renderContentByFeature ───────────────────────────────────
function renderContentByFeature(activeFeature) {
  switch (activeFeature) {
    case 'dashboard':    return renderMainContent();
    case 'habit-list':   return renderHabitList();
    case 'rekapitulasi': return renderRekapitulasi();
    case 'settings':     return renderSettings();
    default:             return '';
  }
}

// ── renderSidebar ────────────────────────────────────────────
function renderSidebar(activeFeature) {
  const features = [
    { name: 'Dashboard',        icon: 'dashboard',  id: 'dashboard'    },
    { name: 'Daftar Kebiasaan', icon: 'list_alt',   id: 'habit-list'   },
    { name: 'Rekapitulasi',     icon: 'bar_chart',  id: 'rekapitulasi' },
    { name: 'Pengaturan',       icon: 'settings',   id: 'settings'     },
  ];

  const sidebar = `
    <div class="hidden sm:flex sm:w-64 bg-white shadow-lg flex-col min-h-screen">
      <div class="text-center text-xl font-bold p-4 text-blue-600">
        Habit Tracker
      </div>
      <ul class="p-4 flex-grow space-y-2">
        ${features.map((feature) => {
          const isActive = feature.id === activeFeature ? 'bg-blue-100 text-blue-600 font-semibold' : '';
          return `
            <li class="flex items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-50 ${isActive}"
                data-feature="${feature.id}">
              <span class="material-icons-outlined mr-3">${feature.icon}</span>
              <span class="text-lg">${feature.name}</span>
            </li>
          `;
        }).join('')}
      </ul>
      <div class="p-4 bg-gray-800 text-white text-center mt-auto">
        <p class="text-sm">&copy; 2025 Habit Tracker. All Rights Reserved.</p>
        <div class="flex justify-center space-x-4 mt-2">
          <a href="https://web.facebook.com/acil.gionino/?_rdc=1&_rdr#" class="text-white hover:text-blue-400">Facebook</a>
          <a href="https://saweria.co/Denmardiyana" class="text-white hover:text-blue-400">For Coffe</a>
          <a href="https://www.instagram.com/denmardiyana312/" class="text-white hover:text-blue-400">Instagram</a>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll('[data-feature]').forEach((item) => {
      item.addEventListener('click', (e) => {
        const featureId = e.currentTarget.getAttribute('data-feature');
        renderHabitTracker(featureId);
      });
    });
  }, 0);

  return sidebar;
}

// ── renderNavbarSmall ────────────────────────────────────────
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
          <li><button data-feature="dashboard"    class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700 rounded-md transition transform hover:scale-105"><span>🏠</span> Dashboard</button></li>
          <li><button data-feature="habit-list"   class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700 rounded-md transition transform hover:scale-105"><span>📋</span> Daftar Kebiasaan</button></li>
          <li><button data-feature="rekapitulasi" class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700 rounded-md transition transform hover:scale-105"><span>📊</span> Rekapitulasi</button></li>
          <li><button data-feature="settings"     class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-700 rounded-md transition transform hover:scale-105"><span>⚙️</span> Pengaturan</button></li>
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

// ── initializeNavbarEvents ───────────────────────────────────
function initializeNavbarEvents() {
  const menuBtn      = document.getElementById("menuBtn");
  const menuDropdown = document.getElementById("menuDropdown");
  if (!menuBtn || !menuDropdown) return;

  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
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

  document.addEventListener("click", (event) => {
    if (!menuBtn.contains(event.target) && !menuDropdown.contains(event.target)) {
      menuDropdown.classList.remove("opacity-100", "scale-100");
      menuDropdown.classList.add("opacity-0", "scale-95");
      setTimeout(() => menuDropdown.classList.add("hidden"), 300);
    }
  });

  document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener("click", (e) => {
      const featureId = e.currentTarget.getAttribute("data-feature");
      renderHabitTracker(featureId);
      menuDropdown.classList.remove("opacity-100", "scale-100");
      menuDropdown.classList.add("opacity-0", "scale-95");
      setTimeout(() => menuDropdown.classList.add("hidden"), 300);
    });
  });
}

// ── renderMainContent (Dashboard) ───────────────────────────
function renderMainContent() {
  return `
    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-3xl">
          <h2 class="text-3xl font-bold text-gray-800 text-center mb-8">Grafik Kebiasaan</h2>
          <div id="chartContainer" class="relative p-6 md:p-8 bg-white shadow-xl rounded-2xl flex justify-center items-center">
            <canvas id="habitChart" class="w-full h-72 md:h-96"></canvas>
          </div>
        </div>
        <div class="bg-gradient-to-br from-blue-500 to-indigo-700 shadow-xl rounded-lg p-6 text-white">
          <h2 class="text-2xl font-bold text-center mb-6">Waktu Saat Ini</h2>
          <div id="currentTime" class="text-center">
            <div class="flex justify-center items-center space-x-3">
              <span class="text-4xl font-bold">Loading...</span>
            </div>
            <p class="text-gray-200 text-sm mt-4">Zona waktu lokal Anda</p>
          </div>
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

// ── renderHabitList ──────────────────────────────────────────
function renderHabitList() {
  return `
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Daftar Kebiasaan</h2>
      <input id="habit-input" type="text" placeholder="Nama kebiasaan" class="border p-2 rounded-lg mb-4 w-full" />
      <input id="habit-time" type="time" class="border p-2 rounded-lg mb-4 w-full" />
      <button id="add-habit" class="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4">Tambah Kebiasaan</button>
      <ul id="habit-list" class="space-y-4"></ul>
      <div class="container mx-auto mt-6">
        <div class="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 class="text-lg font-bold text-green-600 mb-3">Kebiasaan Selesai</h2>
          <ul id="completed-list" class="space-y-2"></ul>
          <h2 class="text-lg font-bold text-red-600 mb-3">Kebiasaan Gagal</h2>
          <ul id="failed-list" class="space-y-2"></ul>
          <button id="finish" class="finish-button bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600 mt-4">
            Finish
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── renderRekapitulasi ───────────────────────────────────────
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
      <tbody></tbody>
    </table>
    <button id="reset-rekap" class="bg-red-500 text-white px-4 py-2 mt-4 rounded-lg">Reset Data</button>
  `;
}

// ── renderSettings ───────────────────────────────────────────
function renderSettings() {
  return `
    <div class="flex-1 overflow-y-auto p-6">
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Pengaturan</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

        <!-- Notifikasi -->
        <div class="bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-2xl p-8 border border-emerald-100 transition-all duration-500 hover:scale-105">
          <h3 class="text-2xl font-bold text-emerald-800 mb-6 flex items-center">
            <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            Notifikasi
          </h3>
          <div class="space-y-6">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="notification-toggle" class="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2">
              <span class="text-lg font-semibold text-gray-700">Aktifkan Notifikasi</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" id="sound-toggle" class="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2">
              <span class="text-lg font-semibold text-gray-700">Suara Notifikasi</span>
            </label>
            <!-- Preview suara -->
            <div id="sound-preview-container" class="hidden">
              <p class="text-sm text-gray-500 mb-2">Preview suara:</p>
              <div class="flex flex-wrap gap-2">
                <button data-sound="default" id="preview-default" class="sound-preview-btn px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition">🔔 Default</button>
                <button data-sound="success" id="preview-success" class="sound-preview-btn px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition">Sukses</button>
                <button data-sound="warning" id="preview-warning" class="sound-preview-btn px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200 transition">Peringatan</button>
                <button data-sound="error"   id="preview-error"   class="sound-preview-btn px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition">Error</button>
                <button data-sound="info"    id="preview-info"    class="sound-preview-btn px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 transition">Info</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tampilan / Tema -->
        <div class="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-2xl p-8 border border-purple-100 transition-all duration-500 hover:scale-105">
          <h3 class="text-2xl font-bold text-purple-800 mb-6 flex items-center">
            <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Tampilan
          </h3>
          <div class="space-y-6">
            <div>
              <label class="block text-lg font-semibold text-gray-700 mb-3">Tema</label>
              <div class="flex space-x-3">
                <button id="theme-light" class="flex-1 bg-white border-2 border-gray-200 rounded-xl p-4 text-sm font-medium hover:shadow-lg transition-all duration-300 text-gray-700">
                  <div class="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto mb-2 shadow-lg"></div>
                </button>
                <button id="theme-dark" class="flex-1 bg-gray-800 border-2 border-gray-600 rounded-xl p-4 text-sm font-medium hover:shadow-lg transition-all duration-300 text-gray-200">
                  <div class="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full mx-auto mb-2 shadow-lg"></div>
                </button>
              </div>
              <!-- Indikator tema aktif -->
              <p id="theme-status" class="text-sm text-center mt-3 text-gray-500 font-medium"></p>
            </div>
          </div>
        </div>

        <!-- Data & Privasi -->
        <div class="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-2xl p-8 border border-indigo-100 transition-all duration-500 hover:scale-105">
          <h3 class="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
            <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Data & Privasi
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button id="export-data" class="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10l-5.5 5.5m0 0L12 21l5.5-5.5m-5.5 0H20"/>
              </svg>
              <span>Export Data</span>
            </button>
            <button id="reset-all" class="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>Reset Semua</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

// ── getHabitData / saveHabitData ─────────────────────────────
function getHabitData() {
  const data = localStorage.getItem('habitTrackerData');
  return data ? JSON.parse(data) : [];
}
function saveHabitData(data) {
  localStorage.setItem('habitTrackerData', JSON.stringify(data));
}

// ── fetchAndRenderRekapitulasi ───────────────────────────────
function fetchAndRenderRekapitulasi() {
  const tableBody = document.querySelector("#rekapitulasi-table tbody");
  if (!tableBody) return;
  tableBody.innerHTML = '';
  const data = getHabitData();
  if (!data || data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="border px-4 py-2 text-center text-gray-500">⚠️ Belum ada data rekapitulasi.</td></tr>`;
    return;
  }
  tableBody.innerHTML = data.map((item, index) => `
    <tr>
      <td class="border px-4 py-2">${index + 1}</td>
      <td class="border px-4 py-2">${item.nama || 'N/A'}</td>
      <td class="border px-4 py-2">${item.status === 'selesai' ? 'Selesai' : 'Gagal'}</td>
      <td class="border px-4 py-2">${item.tanggal ? new Date(item.tanggal).toLocaleString() : 'N/A'}</td>
    </tr>
  `).join('');
}

function resetRekapitulasi() {
  if (confirm("Apakah Anda yakin ingin menghapus semua data rekapitulasi?")) {
    try {
      localStorage.removeItem("habitTrackerData");
      fetchAndRenderRekapitulasi();
      alert("Data rekapitulasi berhasil dihapus!");
    } catch (error) {
      alert("Gagal menghapus data rekapitulasi. Coba lagi!");
    }
  }
}

document.addEventListener("click", (event) => {
  if (event.target.id === "reset-rekap") resetRekapitulasi();
});

// ── initializeChart ──────────────────────────────────────────
function initializeChart() {
  const data = getHabitData() || [];
  let selesaiCount = 0, gagalCount = 0;
  data.forEach((item) => {
    if (item.status === "selesai") selesaiCount++;
    if (item.status === "gagal")   gagalCount++;
  });

  document.getElementById("habitChart").remove();
  const newCanvas = document.createElement("canvas");
  newCanvas.id = "habitChart";
  newCanvas.classList.add("w-full", "h-80", "md:h-96");
  document.getElementById("chartContainer").appendChild(newCanvas);
  const newCtx = newCanvas.getContext("2d");

  new Chart(newCtx, {
    type: "doughnut",
    data: {
      labels: ["Kebiasaan Selesai", "Kebiasaan Gagal"],
      datasets: [{
        data: [selesaiCount, gagalCount],
        backgroundColor: ["rgba(0, 192, 255, 0.8)", "rgba(255, 75, 75, 0.8)"],
        borderColor: ["rgba(0, 192, 255, 1)", "rgba(255, 75, 75, 1)"],
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { color: "#333", font: { size: 14, weight: "bold" } },
        },
      },
    },
  });
}

// ── saveTemporaryData (outer scope) ─────────────────────────
function saveTemporaryData(type, habitName) {
  const storageKey = "tempHabitData";
  const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];
  if (!habitName.trim()) {
    displayAlert("Nama kebiasaan tidak boleh kosong!", "error");
    return;
  }
  if (existingData.some(item => item.nama === habitName)) return;
  existingData.push({
    nama: habitName,
    tanggal: new Date().toISOString(),
    status: type === "completed"
  });
  localStorage.setItem(storageKey, JSON.stringify(existingData));
  displayAlert(`✅ Habit "${habitName}" berhasil disimpan!`, "success");
}

// ── initHabitTracker ─────────────────────────────────────────
function initHabitTracker() {
  const habitInput = document.getElementById('habit-input');
  const habitTime  = document.getElementById('habit-time');
  const habitList  = document.getElementById('habit-list');
  const storageKey = "tempHabitData";

  function saveTemp(habitName, time) {
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (existingData.some(item => item.nama === habitName)) return;
    existingData.push({ nama: habitName, waktu: time, targetTime: parseTime(time).getTime() });
    localStorage.setItem(storageKey, JSON.stringify(existingData));
  }

  function loadHabits() {
    let storedHabits = JSON.parse(localStorage.getItem(storageKey)) || [];
    const now = new Date();
    storedHabits = storedHabits.filter(({ targetTime }) => targetTime > now.getTime());
    habitList.innerHTML = "";
    storedHabits.forEach(({ nama, waktu, targetTime }) => {
      const habitItem = createHabitItem(nama, waktu);
      habitList.appendChild(habitItem);
      const delay = targetTime - now.getTime();
      if (delay > 0) setTimeout(() => handleTimeout(habitItem, nama, waktu), delay);
    });
    localStorage.setItem(storageKey, JSON.stringify(storedHabits));
  }

  document.getElementById('add-habit').addEventListener('click', () => {
    const habitName = habitInput.value.trim();
    const time = habitTime.value;
    if (!habitName || !time) { displayAlert('Harap masukkan kegiatan dan waktu.', 'error'); return; }
    const targetTime = parseTime(time);
    if (targetTime <= new Date()) { displayAlert('Waktu sudah terlewat.', 'error'); return; }
    const habitItem = createHabitItem(habitName, time);
    habitList.appendChild(habitItem);
    resetInputs(habitInput, habitTime);
    saveTemp(habitName, time);
    const delay = targetTime - new Date();
    setTimeout(() => handleTimeout(habitItem, habitName, time), delay);
  });

  loadHabits();
}

function createHabitItem(habitName, time) {
  const li = document.createElement('li');
  li.className = 'flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg shadow-md mb-4 transition-all hover:scale-105 hover:bg-gray-200';
  li.innerHTML = `
    <span class="text-gray-700 font-medium text-lg flex-1">${habitName} (Waktu: ${time})</span>
    <div class="flex items-center space-x-3">
      <button class="selesai-button bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 hidden transition-all">Selesai</button>
      <button class="gagal-button bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 hidden transition-all">Gagal</button>
    </div>`;
  return li;
}

function handleTimeout(habitItem, habitName, time) {
  // Bunyikan notifikasi jika sound aktif
  if (localStorage.getItem("sound") === "true") {
    playNotificationSound("default");
  }
  // Kirim browser notification jika aktif
  if (localStorage.getItem("notifications") === "true" && Notification.permission === "granted") {
    new Notification("⏰ Habit Tracker", { body: `Saatnya: ${habitName}!`, icon: "" });
  }
  displayAlert(`Saatnya ${habitName}!`, 'info');

  const selesaiButton = habitItem.querySelector('.selesai-button');
  const gagalButton   = habitItem.querySelector('.gagal-button');
  const finishButton  = document.getElementById('finish');

  selesaiButton.classList.remove('hidden');
  gagalButton.classList.remove('hidden');
  if (finishButton) finishButton.classList.remove('hidden');

  if (!selesaiButton.hasAttribute('data-listener-added')) {
    selesaiButton.addEventListener('click', () => {
      if (localStorage.getItem("sound") === "true") playNotificationSound("success");
      saveTemporaryData("completed", habitName);
      const completedList = document.getElementById('completed-list');
      if (completedList) {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-green-100 px-4 py-2 rounded-lg shadow-md mb-2';
        li.innerHTML = `${habitName} (Waktu: ${time}) <span class="text-green-600 font-semibold">Selesai!</span>`;
        completedList.appendChild(li);
        habitItem.remove();
      }
    }, { once: true });
    selesaiButton.setAttribute('data-listener-added', 'true');
  }

  if (!gagalButton.hasAttribute('data-listener-added')) {
    gagalButton.addEventListener('click', () => {
      if (localStorage.getItem("sound") === "true") playNotificationSound("error");
      saveTemporaryData("failed", habitName);
      const failedList = document.getElementById('failed-list');
      if (failedList) {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-red-100 px-4 py-2 rounded-lg shadow-md mb-2';
        li.innerHTML = `${habitName} (Waktu: ${time}) <span class="text-red-600 font-semibold">Gagal!</span>`;
        failedList.appendChild(li);
        habitItem.remove();
      }
    }, { once: true });
    gagalButton.setAttribute('data-listener-added', 'true');
  }

  if (finishButton) {
    finishButton.addEventListener('click', () => {
      try {
        const completedList = document.getElementById('completed-list');
        const failedList    = document.getElementById('failed-list');
        if (!completedList || !failedList) throw new Error("Elemen daftar tidak ditemukan.");
        const extractData = (list, status) =>
          Array.from(list.children)
            .map(li => ({ nama: li.textContent.split('(')[0].trim(), tanggal: new Date().toISOString(), status }))
            .filter(item => item.nama);
        const newData = [...extractData(completedList, "selesai"), ...extractData(failedList, "gagal")];
        if (newData.length === 0) return displayAlert('❌ Tidak ada data baru!', 'warning');
        if (!confirm("Apakah kamu yakin ingin menyimpan progress ini?")) return;
        const existingData = getHabitData();
        saveHabitData(Array.isArray(existingData) ? [...existingData, ...newData] : newData);
        if (localStorage.getItem("sound") === "true") playNotificationSound("success");
        displayAlert('✅ Data terbaru berhasil disimpan!', 'success');
        completedList.innerHTML = '';
        failedList.innerHTML    = '';
        localStorage.removeItem("tempHabitData");
      } catch (error) {
        displayAlert(`❌ Terjadi kesalahan: ${error.message}`, 'error');
      }
    });
  }
}

function resetInputs(habitInput, habitTime) {
  habitInput.value = '';
  habitTime.value  = '';
}

function displayAlert(message, type) {
  const alertBox = document.createElement('div');
  alertBox.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded-lg shadow-md transition-all ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error'   ? 'bg-red-500 text-white'   : 'bg-blue-500 text-white'
  }`;
  alertBox.textContent = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}

function parseTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}

function displayCurrentTime() {
  const timeElement = document.getElementById('currentTime');
  function updateTime() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2,'0');
    const m = now.getMinutes().toString().padStart(2,'0');
    const s = now.getSeconds().toString().padStart(2,'0');
    timeElement.innerHTML = `
      <div class="flex justify-center items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.25V4.75a.75.75 0 011.5 0v4h3.5a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
        </svg>
        <span class="text-4xl font-bold tracking-wide">${h}:${m}:${s}</span>
      </div>
      <p class="text-gray-200 text-sm mt-4">Zona waktu lokal Anda</p>`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

function updateCalendar() {
  const date = new Date();
  document.getElementById('calendarDay').textContent = date.getDate();
  document.getElementById('calendarMonthYear').textContent =
    `${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`;
  document.getElementById('calendarContainer').classList.add('animate-bounce');
}

// ── exportHabitsData ─────────────────────────────────────────
function exportHabitsData() {
  try {
    const data = getHabitData();
    if (!data || data.length === 0) { alert("Tidak ada data untuk diekspor."); return false; }
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), totalRecords: data.length, data }, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `habit-tracker-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    alert("Gagal mengekspor data."); return false;
  }
}

// ── resetAllData ─────────────────────────────────────────────
function resetAllData() {
  try {
    localStorage.removeItem("habitTrackerData");
    localStorage.removeItem("tempHabitData");
  } catch (e) {
    alert("Gagal mereset data.");
  }
}

// ── setting() — VERSI FINAL ──────────────────────────────────
function setting() {
  const notificationToggle  = document.getElementById("notification-toggle");
  const soundToggle         = document.getElementById("sound-toggle");
  const themeLightBtn       = document.getElementById("theme-light");
  const themeDarkBtn        = document.getElementById("theme-dark");
  const exportDataBtn       = document.getElementById("export-data");
  const resetAllBtn         = document.getElementById("reset-all");
  const themeStatus         = document.getElementById("theme-status");
  const soundPreviewContainer = document.getElementById("sound-preview-container");

  if (!notificationToggle || !soundToggle || !themeLightBtn || !themeDarkBtn) {
    console.warn("Elemen pengaturan tidak ditemukan.");
    return;
  }

  // Terapkan state tersimpan
  const savedTheme         = localStorage.getItem("theme") || "light";
  const savedNotifications = localStorage.getItem("notifications") === "true";
  const savedSound         = localStorage.getItem("sound") === "true";

  notificationToggle.checked = savedNotifications;
  soundToggle.checked        = savedSound;

  // Tampilkan/sembunyikan preview suara sesuai state awal
  if (soundPreviewContainer) {
    soundPreviewContainer.classList.toggle("hidden", !savedSound);
  }

  // Update indikator tema
  function updateThemeUI(theme) {
    themeLightBtn.classList.remove("ring-4", "ring-yellow-400", "ring-offset-2");
    themeDarkBtn.classList.remove("ring-4", "ring-blue-400", "ring-offset-2");
    if (theme === "dark") {
      themeDarkBtn.classList.add("ring-4", "ring-blue-400", "ring-offset-2");
      if (themeStatus) themeStatus.textContent = "🌙 Tema Gelap aktif";
    } else {
      themeLightBtn.classList.add("ring-4", "ring-yellow-400", "ring-offset-2");
      if (themeStatus) themeStatus.textContent = "☀️ Tema Terang aktif";
    }
  }

  updateThemeUI(savedTheme);

  // Simpan semua pengaturan
  function saveSettings() {
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme",         isDark ? "dark" : "light");
    localStorage.setItem("notifications", notificationToggle.checked);
    localStorage.setItem("sound",         soundToggle.checked);
  }

  // Toast notification
  function showToast(message, type = "info") {
    const existing = document.querySelector(".toast-notification");
    if (existing) existing.remove();
    const colorMap = { success: "bg-emerald-500", warning: "bg-amber-500", error: "bg-red-500", info: "bg-blue-500" };
    const toast = document.createElement("div");
    toast.className = `toast-notification fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl text-white font-medium transform translate-x-full transition-all duration-500 ${colorMap[type] || colorMap.info}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove("translate-x-full"));
    setTimeout(() => {
      toast.classList.add("translate-x-full");
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 500);
    }, 3000);
  }

  // ── Tombol tema ──
  themeLightBtn.addEventListener("click", () => {
    applyDarkMode(false);
    updateThemeUI("light");
    saveSettings();
    showToast("☀️ Tema Terang diaktifkan", "success");
    if (localStorage.getItem("sound") === "true") playNotificationSound("info");
  });

  themeDarkBtn.addEventListener("click", () => {
    applyDarkMode(true);
    updateThemeUI("dark");
    saveSettings();
    showToast("🌙 Tema Gelap diaktifkan", "success");
    if (localStorage.getItem("sound") === "true") playNotificationSound("info");
  });

  // ── Toggle notifikasi ──
  notificationToggle.addEventListener("change", function () {
    saveSettings();
    if (this.checked) {
      // Minta izin browser notification
      if (Notification.permission === "default") {
        Notification.requestPermission().then(perm => {
          showToast(perm === "granted" ? "Notifikasi browser diizinkan!" : "Izin notifikasi ditolak.", perm === "granted" ? "success" : "warning");
        });
      } else {
        showToast("Notifikasi diaktifkan", "success");
      }
    } else {
      showToast("Notifikasi dinonaktifkan", "info");
    }
    if (localStorage.getItem("sound") === "true") playNotificationSound("default");
  });

  // ── Toggle suara ──
  soundToggle.addEventListener("change", function () {
    saveSettings();
    // Tampilkan/sembunyikan preview
    if (soundPreviewContainer) {
      soundPreviewContainer.classList.toggle("hidden", !this.checked);
    }
    if (this.checked) {
      playNotificationSound("success"); // preview langsung saat diaktifkan
      showToast("🔊 Suara notifikasi diaktifkan", "success");
    } else {
      showToast("🔇 Suara notifikasi dimatikan", "info");
    }
  });

  // ── Tombol preview suara ──
  document.querySelectorAll(".sound-preview-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const soundType = btn.getAttribute("data-sound");
      playNotificationSound(soundType);
      btn.style.transform = "scale(0.95)";
      setTimeout(() => { btn.style.transform = "scale(1)"; }, 150);
    });
  });

  // ── Export data ──
  exportDataBtn.addEventListener("click", () => {
    const success = exportHabitsData();
    if (success) {
      showToast("📤 Data berhasil diekspor!", "success");
      if (localStorage.getItem("sound") === "true") playNotificationSound("success");
    }
  });

  // ── Reset semua ──
  resetAllBtn.addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin mereset SEMUA data? Tindakan ini tidak dapat dibatalkan!")) {
      resetAllData();
      if (localStorage.getItem("sound") === "true") playNotificationSound("warning");
      showToast("Semua data telah direset!", "warning");
    }
  });
}

}); // end DOMContentLoaded