require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID; // Instagram Business Account ID

// Endpoint API untuk mengupload postingan ke Instagram
app.post('/post', async (req, res) => {
  try {
    const { image_url, caption } = req.body;

    // Langkah 1: Buat media container dengan URL gambar dan caption
    const createContainerUrl = `https://graph.facebook.com/v15.0/${IG_USER_ID}/media`;
    const containerResponse = await axios.post(createContainerUrl, null, {
      params: {
        image_url,
        caption,
        access_token: ACCESS_TOKEN
      }
    });

    const creationId = containerResponse.data.id;

    // Langkah 2: Publish media container untuk membuat postingan
    const publishUrl = `https://graph.facebook.com/v15.0/${IG_USER_ID}/media_publish`;
    const publishResponse = await axios.post(publishUrl, null, {
      params: {
        creation_id: creationId,
        access_token: ACCESS_TOKEN
      }
    });

    res.json({
      message: 'Postingan berhasil dipublish!',
      data: publishResponse.data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Terjadi error saat melakukan posting ke Instagram',
      error: error.response ? error.response.data : error.message
    });
  }
});

// Jika dalam mode produksi, sajikan file build React
if (process.env.NODE_ENV === 'production') {
  // Folder build React di dalam direktori client
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handler untuk route yang tidak dikenali, kembalikan index.html React
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  // Untuk pengembangan, Anda bisa menggunakan route default untuk memastikan server berjalan
  app.get('/', (req, res) => {
    res.send('Server API Instagram berjalan. Pastikan Anda menjalankan React client secara terpisah.');
  });
}

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});