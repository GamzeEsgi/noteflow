import React, { useState } from 'react';
import API_URL from '../config';

/**
 * Giris Bileşeni
 * Kullanıcının email ve şifre ile sisteme giriş yapmasını sağlar
 * @param {Function} onGirisBasarili - Giriş başarılı olduğunda çağrılacak callback fonksiyonu
 */
export default function Giris({ onGirisBasarili }) {
  // Form state değişkenleri
  const [email, setEmail] = useState('');        // Kullanıcı email adresi
  const [sifre, setSifre] = useState('');        // Kullanıcı şifresi
  const [hata, setHata] = useState('');          // Hata mesajı
  const [loading, setLoading] = useState(false); // Yükleniyor durumu

  /**
   * Giriş formunu submit ettiğinde çalışan fonksiyon
   * Backend API'ye POST isteği gönderir
   */
  const handleGiris = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHata('');

    try {
      console.log('API URL:', API_URL);
      console.log('Giriş isteği gönderiliyor:', `${API_URL}/api/auth/giris`);
      
      // Backend API'ye giriş isteği gönder
      const response = await fetch(`${API_URL}/api/auth/giris`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sifre })
      });

      console.log('Response status:', response.status);
      
      // Response'un JSON olup olmadığını kontrol et
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        setHata(`Sunucu hatası: ${response.status} - ${text.substring(0, 100)}`);
        return;
      }

      if (response.ok) {
        // Giriş başarılı - token ve kullanıcı rolünü üst bileşene gönder
        onGirisBasarili(data.token, data.kullanici.rol);
      } else {
        // Backend'den gelen hata mesajını göster
        setHata(data.mesaj || data.error || 'Giriş başarısız');
      }
    } catch (err) {
      // Ağ hatası veya sunucu erişim sorunu
      console.error('Giriş hatası:', err);
      setHata(`Sunucuya bağlanılamadı: ${err.message}. API URL: ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleGiris}>
        <h2>Giriş Yap</h2>
        {hata && <p className="error-message">{hata}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
}
