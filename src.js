document.addEventListener('DOMContentLoaded', () => {
  const mulaiButton = document.getElementById('mulai');

  mulaiButton.addEventListener('click', () => {
    document.body.innerHTML = `
    <div class="bg-gray-100 h-screen p-5">
        <h1 class="text-4xl font-bold text-center mb-6">Habit Tracker</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="col-span-1 sm:col-span-2 lg:col-span-2">
                <div class="bg-white shadow-lg rounded-lg p-5">
                    <h2 class="text-2xl font-semibold mb-4">Daftar Kebiasaan</h2>
                    <ul id="habit-list" class="list-disc list-inside space-y-2"></ul>
                    <div class="mt-4">
                        <input id="habit-input" type="text" placeholder="Tambahkan kegiatan baru" 
                            class="w-full border border-gray-300 rounded px-3 py-2 mb-3">
                        <input id="habit-time" type="time" 
                            class="w-full border border-gray-300 rounded px-3 py-2 mb-3">
                        <button id="add-habit" 
                            class="mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                            Tambahkan Kegiatan
                        </button>
                    </div>
                </div>
            </div>
            <div id="summary-section" class="bg-white shadow-lg rounded-lg p-5 col-span-1 sm:col-span-2 lg:col-span-1">
                <h2 class="text-2xl font-semibold mb-4">Rekapitulasi</h2>
                <h3 class="text-lg font-semibold mb-2">Berhasil:</h3>
                <ul id="completed-list" class="list-disc list-inside space-y-2"></ul>
                <h3 class="text-lg font-semibold mb-2">Gagal:</h3>
                <ul id="failed-list" class="list-disc list-inside space-y-2"></ul>
            </div>
        </div>
    </div>
    `;

    // Variabel DOM
    const habitInput = document.getElementById('habit-input');
    const habitTime = document.getElementById('habit-time');
    const habitList = document.getElementById('habit-list');
    const completedList = document.getElementById('completed-list');
    const failedList = document.getElementById('failed-list');

    document.getElementById('add-habit').addEventListener('click', () => {
      const newHabit = habitInput.value.trim();
      const time = habitTime.value;

      if (newHabit && time) {
        const targetTime = parseTime(time);
        const now = new Date();

        if (targetTime <= now) {
          displayToast('Waktu yang dimasukkan sudah terlewat. Silakan pilih waktu yang valid.', 'error');
          return;
        }

        const habitItem = createHabitItem(newHabit, time);
        habitList.appendChild(habitItem);
        resetInputFields();

        const delay = targetTime - now;
        setTimeout(() => handleTimeout(habitItem, newHabit, time), delay);
      } else {
        displayToast('Harap masukkan kegiatan dan waktu.', 'error');
      }
    });

    // Parsing Waktu
    function parseTime(time) {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    }

    // Membuat Item Habit
    function createHabitItem(habitName, time) {
      const li = document.createElement('li');
      li.classList.add('flex', 'items-center', 'justify-between', 'space-x-3', 'bg-gray-50', 'p-3', 'rounded', 'shadow-sm');
      li.innerHTML = `
        <span class="flex-1">${habitName} (Waktu: ${time})</span>
        <div class="flex items-center space-x-3">
          <button class="selesai-button bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 hidden">Selesai</button>
          <button class="gagal-button bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 hidden">Gagal</button>
        </div>
      `;
      return li;
    }

    // Menangani Timeout
    function handleTimeout(habitItem, habitName, time) {
      displayToast(`Saatnya ${habitName}!`, 'info');
      const selesaiButton = habitItem.querySelector('.selesai-button');
      const gagalButton = habitItem.querySelector('.gagal-button');
      selesaiButton.classList.remove('hidden');
      gagalButton.classList.remove('hidden');

      selesaiButton.addEventListener('click', () => {
        completedList.innerHTML += `<li>${habitName} (Waktu: ${time})</li>`;
        habitItem.remove();
      });

      gagalButton.addEventListener('click', () => {
        failedList.innerHTML += `<li>${habitName} (Waktu: ${time})</li>`;
        habitItem.remove();
      });
    }

    // Reset Input
    function resetInputFields() {
      habitInput.value = '';
      habitTime.value = '';
    }

    // Fungsi Toast
    function displayToast(message, type) {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  });

  // Daftar Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => console.log('Service Worker berhasil didaftarkan:', registration))
        .catch((error) => console.error('Service Worker gagal didaftarkan:', error));
    });
  }
});
