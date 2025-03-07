import React, { useState } from 'react';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Ubah URL absolute menjadi relative agar proxy bekerja dengan baik
      const response = await fetch('/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_url: imageUrl, caption: caption })
      });

      if (!response.ok) {
        throw new Error('Terjadi kesalahan saat membuat postingan');
      }
      
      // Jika tidak membutuhkan data respons, cukup panggil await response.json();
      await response.json();

      setMessage('Postingan berhasil dipublish!');
      setImageUrl('');
      setCaption('');
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Buat Postingan Instagram Baru</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>URL Gambar:</label>
          <input 
            type="text" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder="Masukkan URL gambar" 
            style={{ width: '100%', padding: '0.5rem' }}
            required 
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Caption:</label>
          <textarea 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            placeholder="Masukkan caption" 
            style={{ width: '100%', padding: '0.5rem' }}
            required 
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Posting</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;