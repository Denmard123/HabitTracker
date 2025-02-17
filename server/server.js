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
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.json')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache 1 tahun
    }
  }
}));

// Endpoint untuk mendapatkan data rekapitulasi dari Supabase
app.get('/get-rekapitulasi', async (req, res) => {
  try {
    console.log("🔄 Mengambil data rekapitulasi dari Supabase...");

    const { data, error } = await supabase
      .from('HT') // Pastikan nama tabel sudah benar
      .select('*');

    if (error) {
      console.error("❌ Error dari Supabase:", error);
      return res.status(500).json({ success: false, message: "Gagal mengambil data dari database.", error });
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ Tidak ada data rekapitulasi ditemukan.");
      return res.status(404).json({ success: false, message: "Data rekapitulasi tidak ditemukan." });
    }

    // Format data jika perlu (misalnya, convert status menjadi boolean)
    const formattedData = data.map(item => ({
      nama: item.nama,  // pastikan ini sesuai dengan field yang ada di database
      status: item.status ? 'Selesai' : 'Gagal',
      tanggal: item.tanggal
    }));

    console.log("✅ Data berhasil diambil:", formattedData);

    return res.json({
      success: true,
      message: "Data berhasil diambil.",
      rekapitulasiData: formattedData
    });

  } catch (err) {
    console.error("❌ Error di backend:", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server.", error: err.message });
  }
});

// Endpoint untuk menyimpan data kebiasaan ke Supabase
app.post('/save-habits', async (req, res) => {
  try {
    console.log("📥 Data yang diterima dari frontend:", req.body);

    const { completedData, failedData } = req.body;

    if ((!Array.isArray(completedData) || !Array.isArray(failedData)) ||
        (completedData.length === 0 && failedData.length === 0)) {
      return res.status(400).json({ success: false, message: 'Data completedData atau failedData harus ada' });
    }

    // Gabungkan completedData dan failedData
    const formattedData = [
      ...completedData.map(habit => ({
        nama: habit.habitName,
        status: true,  // Completed → true
        tanggal: habit.time.split('T')[0]
      })),
      ...failedData.map(habit => ({
        nama: habit.habitName,
        status: false,  // Failed → false
        tanggal: habit.time.split('T')[0]
      }))
    ];

    console.log("📤 Data yang akan dikirim ke Supabase:", formattedData);

    // Kirim ke Supabase
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
