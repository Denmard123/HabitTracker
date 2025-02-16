const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi Supabase Client
const SUPABASE_URL = 'https://kxmnvtgnwuhdkrzzpwxi.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bW52dGdud3VoZGtyenpwd3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTA3OTgsImV4cCI6MjA1NTI2Njc5OH0.l0DeaGtDKbr-EhNX5DpEUDSNtF1Y3L_Rdqn2bUC7JcA';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.use(express.json());

// Melayani file statis (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.json')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache 1 tahun
    }
  }
}));

// Pastikan service worker bisa diakses
app.get('/service-worker.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '../service-worker.js'));
});

// Endpoint untuk mendapatkan data rekapitulasi dari Supabase
app.get('/get-rekapitulasi', async (req, res) => {
  try {
    const { data, error } = await supabase.from('HT').select('*');

    if (error) throw error;

    res.status(200).json({ success: true, rekapitulasiData: data });
  } catch (error) {
    console.error("❌ Gagal mengambil data dari Supabase:", error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data rekapitulasi.' });
  }
});

// Endpoint untuk menyimpan data kebiasaan ke Supabase
app.post('/save-habits', async (req, res) => {
  try {
    console.log("📥 Data yang diterima dari frontend:", req.body);

    if (!Array.isArray(req.body.completedData) || req.body.completedData.length === 0) {
      return res.status(400).json({ success: false, message: 'Data completedData harus berupa array dan tidak boleh kosong' });
    }

    // Sesuaikan nama kolom dengan tabel Supabase (HT)
    const formattedData = req.body.completedData.map(habit => ({
      nama: habit.habitName, // Ubah dari `habitName` ke `nama`
      status: habit.status,  // Sesuai dengan `status`
      tanggal: habit.time.split('T')[0] // Ambil hanya bagian `YYYY-MM-DD`
    }));

    // Kirim data ke Supabase
    const { data, error } = await supabase.from('HT').insert(formattedData);

    if (error) throw error;

    res.status(201).json({ success: true, message: 'Data berhasil disimpan!', data });
  } catch (error) {
    console.error("❌ Error saat menyimpan data ke Supabase:", error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan data.' });
  }
});


// Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
