# 📝 NoteFlow

Modern, hızlı ve responsive Not Tutma SaaS uygulaması. Soft renkler ve motivasyonel tasarım ile notlarınızı organize edin.

## 🚀 Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ JWT tabanlı kimlik doğrulama
- ✅ Not oluşturma, düzenleme, silme ve listeleme
- ✅ Rich text editor (kalem, silgi, formatlama araçları)
- ✅ Ajanda/Takvim görünümü (defter görünümü)
- ✅ Notlara renk ve tarih ekleme
- ✅ Free plan: 50 not limiti
- ✅ Tam responsive tasarım (mobil, tablet, desktop)
- ✅ Karanlık mod desteği
- ✅ Arama özelliği
- ✅ Soft, motivasyonel renk paleti
- ✅ Vercel deployment uyumlu
- ✅ Expo ile uyumlu API yapısı

## 📂 Proje Yapısı

```
/project-root
  /backend
    server.js
    /routes
      auth.js
      notes.js
    /controllers
      authController.js
      notesController.js
    /models
      User.js
      Note.js
    /middleware
      authMiddleware.js
  /frontend
    index.html
    login.html
    register.html
    app.js
    styles.css
  vercel.json
  package.json
```

## 🛠️ Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarla

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri doldurun:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notesaas
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

### 3. MongoDB Atlas Kurulumu

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Yeni bir cluster oluşturun
3. Database Access'te kullanıcı oluşturun
4. Network Access'te IP adresinizi ekleyin (veya 0.0.0.0/0 ile tüm IP'lere izin verin)
5. Connection string'i alın ve `.env` dosyasına ekleyin

### 4. Uygulamayı Çalıştır

```bash
# Development
npm run dev

# Production
npm start
```

Uygulama `http://localhost:5000` adresinde çalışacaktır.

## 🌐 Vercel Deployment

### 1. Vercel CLI ile Deploy

```bash
npm i -g vercel
vercel
```

### 2. Ortam Değişkenlerini Ayarla

Vercel dashboard'da projenize gidin ve Environment Variables ekleyin:

- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Güçlü bir secret key

### 3. Vercel.json Yapılandırması

`vercel.json` dosyası zaten yapılandırılmıştır. API rotaları `/api/*` altında çalışacaktır.

## 📱 API Endpoints

### Auth

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### Notes

- `GET /api/notes` - Tüm notları listele
- `POST /api/notes` - Yeni not oluştur
- `PUT /api/notes/:id` - Notu güncelle
- `DELETE /api/notes/:id` - Notu sil

Tüm notes endpoint'leri JWT token gerektirir.

## 🎨 Frontend Kullanımı

1. `register.html` - Yeni kullanıcı kaydı
2. `login.html` - Giriş yap
3. `index.html` - Ana not yönetim ekranı

Token localStorage'da saklanır ve tüm API isteklerinde `Authorization: Bearer <token>` header'ı ile gönderilir.

## 📱 Mobil Uyumluluk

- Tam responsive tasarım
- Mobilde hamburger menü
- Touch-friendly arayüz
- Tablet/iPad optimizasyonu

## 🔒 Güvenlik

- Şifreler bcrypt ile hashlenir
- JWT token ile kimlik doğrulama
- Kullanıcılar sadece kendi notlarına erişebilir
- CORS yapılandırması

## 🚀 Expo Entegrasyonu

API yapısı Expo ile uyumludur. Frontend'deki fetch yapısı aynen Expo'da da kullanılabilir:

```javascript
fetch("https://your-vercel-url.vercel.app/api/notes", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
})
```

## 📝 Lisans

MIT
