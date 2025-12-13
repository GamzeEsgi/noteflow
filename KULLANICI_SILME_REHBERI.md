# 🗑️ Kullanıcı Silme Rehberi

## 📋 İçindekiler

1. [Browser Console'dan Silme](#browser-consoledan-silme)
2. [MongoDB Atlas'tan Silme](#mongodb-atlastan-silme)
3. [API Endpoint'leri](#api-endpointleri)
4. [Tüm Kullanıcıları Listeleme](#tüm-kullanıcıları-listeleme)

---

## 🌐 Browser Console'dan Silme

### Adım 1: Console'u Açın

1. **F12** tuşuna basın (veya sağ tık → "Inspect")
2. **Console** sekmesine tıklayın

### Adım 2: Tüm Kullanıcıları Listeleyin

```javascript
fetch('https://noteflow-app-pearl.vercel.app/api/auth/users', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
  console.log('📋 Kullanıcılar:', data);
  console.table(data.users);
})
.catch(err => console.error('❌ Hata:', err));
```

### Adım 3: Belirli Bir Kullanıcıyı Silin

```javascript
// Email'e göre kullanıcı sil
fetch('https://noteflow-app-pearl.vercel.app/api/auth/user', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'silinecek@example.com'  // ⚠️ Silmek istediğiniz email'i yazın
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Kullanıcı silindi:', data);
  alert('✅ Kullanıcı ve notları silindi!\n\nEmail: ' + data.deletedUser.email);
})
.catch(err => {
  console.error('❌ Hata:', err);
  alert('Hata: ' + err.message);
});
```

### Adım 4: Tüm Kullanıcıları Silin (⚠️ DİKKAT!)

```javascript
// ⚠️ TÜM KULLANICILARI SİLER - GERİ ALINAMAZ!
if (confirm('⚠️ TÜM KULLANICILARI SİLMEK İSTEDİĞİNİZDEN EMİN MİSİNİZ?\n\nBu işlem geri alınamaz!')) {
  fetch('https://noteflow-app-pearl.vercel.app/api/auth/users/all', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Tüm kullanıcılar silindi:', data);
    alert('✅ Tüm kullanıcılar ve notlar silindi!\n\nSilinen kullanıcı: ' + data.deletedUsers + '\nSilinen not: ' + data.deletedNotes);
  })
  .catch(err => {
    console.error('❌ Hata:', err);
    alert('Hata: ' + err.message);
  });
}
```

---

## 🗄️ MongoDB Atlas'tan Silme

### Yöntem 1: MongoDB Atlas Web Arayüzü

1. **MongoDB Atlas'a giriş yapın:**
   - https://cloud.mongodb.com

2. **Cluster'ınızı seçin:**
   - `Cluster0` veya kullandığınız cluster'ı seçin

3. **"Browse Collections" butonuna tıklayın**

4. **Database ve Collection'ı seçin:**
   - Database: `notesaas` (veya kullandığınız database adı)
   - Collection: `users`

5. **Kullanıcıyı bulun:**
   - Email'e göre arama yapın
   - Silmek istediğiniz kullanıcıyı bulun

6. **Kullanıcıyı silin:**
   - Kullanıcının yanındaki **çöp kutusu** ikonuna tıklayın
   - Onaylayın

### Yöntem 2: MongoDB Compass

1. **MongoDB Compass'ı açın**

2. **Connection string'i girin:**
   ```
   mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/notesaas?retryWrites=true&w=majority
   ```

3. **Database ve Collection'ı seçin:**
   - Database: `notesaas`
   - Collection: `users`

4. **Kullanıcıyı bulun ve silin:**
   - Email'e göre filtreleme yapın: `{ "email": "silinecek@example.com" }`
   - Kullanıcıyı seçin ve **Delete** butonuna tıklayın

---

## 🔌 API Endpoint'leri

### 1. Tüm Kullanıcıları Listele

**Endpoint:** `GET /api/auth/users`

**Request:**
```javascript
fetch('https://noteflow-app-pearl.vercel.app/api/auth/users', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
```

**Response:**
```json
{
  "message": "Kullanıcılar listelendi",
  "count": 2,
  "users": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "email": "test@example.com",
      "plan": "free",
      "createdAt": "2025-01-11T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Email'e Göre Kullanıcı Sil

**Endpoint:** `DELETE /api/auth/user`

**Request:**
```javascript
fetch('https://noteflow-app-pearl.vercel.app/api/auth/user', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'silinecek@example.com'
  })
})
```

**Response:**
```json
{
  "message": "Kullanıcı başarıyla silindi",
  "deletedUser": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "silinecek@example.com"
  },
  "deletedNotes": 5
}
```

**Not:** Kullanıcının tüm notları da otomatik olarak silinir!

---

### 3. Tüm Kullanıcıları Sil (⚠️ DİKKAT!)

**Endpoint:** `DELETE /api/auth/users/all`

**Request:**
```javascript
fetch('https://noteflow-app-pearl.vercel.app/api/auth/users/all', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' }
})
```

**Response:**
```json
{
  "message": "Tüm kullanıcılar ve notlar silindi",
  "deletedUsers": 10,
  "deletedNotes": 50
}
```

**⚠️ UYARI:** Bu işlem geri alınamaz! Tüm kullanıcılar ve notlar silinir!

---

## 📝 Örnek Kullanım Senaryoları

### Senaryo 1: Test Kullanıcısını Sil

```javascript
// 1. Test kullanıcısını sil
fetch('https://noteflow-app-pearl.vercel.app/api/auth/user', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
})
.then(res => res.json())
.then(data => console.log('✅ Silindi:', data));
```

### Senaryo 2: Belirli Email'leri Toplu Sil

```javascript
// Silinecek email'ler
const emailsToDelete = [
  'user1@example.com',
  'user2@example.com',
  'user3@example.com'
];

// Her birini sil
emailsToDelete.forEach(async (email) => {
  const res = await fetch('https://noteflow-app-pearl.vercel.app/api/auth/user', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  console.log(`✅ ${email} silindi:`, data);
});
```

### Senaryo 3: Tüm Kullanıcıları Temizle ve Yeniden Başlat

```javascript
// 1. Tüm kullanıcıları sil
fetch('https://noteflow-app-pearl.vercel.app/api/auth/users/all', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Temizlendi:', data);
  
  // 2. Test kullanıcısını yeniden oluştur
  return fetch('https://noteflow-app-pearl.vercel.app/api/auth/create-test-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
})
.then(res => res.json())
.then(data => console.log('✅ Test kullanıcısı oluşturuldu:', data));
```

---

## 🔍 Kullanıcı Notlarını da Silme

**Önemli:** Kullanıcı silindiğinde, o kullanıcıya ait **tüm notlar** da otomatik olarak silinir (cascade delete).

**Not sayısını kontrol etmek için:**
```javascript
// Kullanıcının notlarını kontrol et (silmeden önce)
fetch('https://noteflow-app-pearl.vercel.app/api/notes', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(res => res.json())
.then(data => console.log('📝 Notlar:', data));
```

---

## ✅ Hızlı Referans

| İşlem | Endpoint | Method | Body |
|-------|----------|--------|------|
| Listele | `/api/auth/users` | GET | - |
| Sil (Email) | `/api/auth/user` | DELETE | `{ "email": "..." }` |
| Tümünü Sil | `/api/auth/users/all` | DELETE | - |

---

## ⚠️ Güvenlik Notları

1. **Production'da dikkatli olun:** Kullanıcı silme işlemleri geri alınamaz!
2. **Yedek alın:** Önemli verileri silmeden önce yedekleyin
3. **Test ortamında deneyin:** Önce test ortamında deneyin
4. **Yetkilendirme:** Production'da bu endpoint'leri sadece admin kullanıcılarına açın

---

**Not:** Tüm endpoint'ler Vercel deployment'ınızda çalışır. Local'de test etmek için `http://localhost:3000/api/auth/...` kullanın.


