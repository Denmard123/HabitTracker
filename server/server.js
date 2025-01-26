const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname, '../')));

// Endpoint untuk menyimpan data kebiasaan
app.post('http://localhost:3000/save-habit', (req, res) => {
    const habits = req.body;
  
    // Di sini, kamu bisa menyimpan habits ke database atau melakukan tindakan lain
    console.log('Data kebiasaan diterima:', habits);
  
    // Mengirim respons sukses
    res.status(200).json({ message: 'Data kebiasaan berhasil disimpan' });
  }); 
// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
