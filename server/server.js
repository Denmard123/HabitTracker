const express = require('express');
const path = require('path');

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Data sementara untuk menyimpan rekapitulasi
let rekapitulasiData = [];

// Middleware untuk parsing JSON (menggunakan express.json() yang sudah tersedia di Express)
app.use(express.json());

// Middleware untuk melayani file statis (misalnya HTML, CSS, dan JS)
app.use(express.static(path.join(__dirname, '../')));

// Endpoint untuk menyimpan data kebiasaan
app.post('/save-habits', (req, res) => {
  const { completedData, failedData } = req.body;

  console.log("Data yang diterima di server:", req.body);

  if (!completedData || !failedData || !Array.isArray(completedData) || !Array.isArray(failedData)) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap atau format tidak valid!' });
  }

  // Hanya menyimpan data terbaru (menghapus data lama)
  rekapitulasiData = [];

  completedData.forEach(item => {
    rekapitulasiData.push({
      habitName: item.habitName,
      status: 'Selesai',
      time: item.time,
    });
  });

  failedData.forEach(item => {
    rekapitulasiData.push({
      habitName: item.habitName,
      status: 'Gagal',
      time: item.time,
    });
  });

  res.status(200).json({ success: true, message: "Data terbaru telah disimpan!" });
});



// Endpoint untuk mendapatkan data rekapitulasi
app.get('/get-rekapitulasi', (req, res) => {
  res.status(200).json({ rekapitulasiData });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
