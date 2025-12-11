# 🔐 Tüm Projeler - Environment Variables Özeti

Bu dosya, tüm projelerinizde kullanılan environment variables'ların özetini içerir.

---

## 📝 NoteFlow (Mevcut Proje)

### Vercel Environment Variables:

```env
MONGODB_URI=mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=production
```

### Kullanım:
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: JWT token imzalama için secret key
- `PORT`: Server port (Vercel'de otomatik)
- `NODE_ENV`: Environment tipi (production/development)

### Dosya Konumu:
- `backend/config/database.js` - MongoDB bağlantısı
- `backend/server.js` - Server yapılandırması
- `backend/controllers/authController.js` - JWT kullanımı

---

## 📅 Randevu Sistemi

### Vercel Environment Variables:

```env
MONGODB_URI=mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.xxxxx.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
JWT_SECRET=abc123secret456xyz789
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app (opsiyonel)
```

### Kullanım:
- `MONGODB_URI`: MongoDB Atlas connection string (database: `randevu-sistemi`)
- `JWT_SECRET`: JWT token imzalama için secret key (en az 32 karakter önerilir)
- `NODE_ENV`: Environment tipi
- `FRONTEND_URL`: CORS için frontend URL'i (opsiyonel)

### Dosya Konumu:
- `randevu-sistemi/backend/config/database.js` - MongoDB bağlantısı
- `randevu-sistemi/backend/server.js` - Server yapılandırması
- `randevu-sistemi/ENVIRONMENT_VARIABLES.md` - Detaylı rehber

### Örnek JWT_SECRET Oluşturma:
```bash
openssl rand -base64 32
```

---

## 🏢 Apartman Yönetim

### Vercel Environment Variables:

```env
MONGODB_URI=mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.xxxxx.mongodb.net/apartman-yonetim?retryWrites=true&w=majority
JWT_SECRET=gizli_anahtar (production'da değiştirin!)
NODE_ENV=production
VERCEL=1 (otomatik, Vercel tarafından set edilir)
```

### Kullanım:
- `MONGODB_URI`: MongoDB Atlas connection string (database: `apartman-yonetim`)
- `JWT_SECRET`: JWT token imzalama için secret key
- `NODE_ENV`: Environment tipi
- `VERCEL`: Vercel ortamında otomatik olarak `1` değerini alır

### Dosya Konumu:
- `apartman-yonetim/api/index.js` - Vercel serverless function
- `apartman-yonetim/middleware/auth.js` - JWT middleware
- `apartman-yonetim/routes/auth.js` - Auth routes

### Önemli Not:
- `JWT_SECRET` için default değer `gizli_anahtar` kullanılıyor, **production'da mutlaka değiştirin!**

---

## ☁️ CloudNotes

### Vercel Environment Variables:

```env
MONGODB_URI=mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.xxxxx.mongodb.net/cloudnotes?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
PORT=5000
VERCEL=1 (otomatik)
```

### Kullanım:
- `MONGODB_URI`: MongoDB Atlas connection string (database: `cloudnotes`)
- `JWT_SECRET`: JWT token imzalama için secret key
- `FRONTEND_URL`: CORS ve frontend redirect için URL
- `NODE_ENV`: Environment tipi
- `PORT`: Server port (Vercel'de otomatik)

### Dosya Konumu:
- `cloudnotes/backend/src/config/database.js` - MongoDB bağlantısı
- `cloudnotes/backend/src/server.js` - Server yapılandırması
- `cloudnotes/backend/src/controllers/authController.js` - Auth controller

---

## 🔄 Ortak Özellikler

### Tüm Projelerde Kullanılan:

1. **MongoDB Atlas Connection String Formatı:**
   ```
   mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.xxxxx.mongodb.net/DATABASE_ADI?retryWrites=true&w=majority
   ```

2. **JWT_SECRET:**
   - En az 32 karakter önerilir
   - Production'da mutlaka güçlü bir değer kullanın
   - Her proje için farklı olmalı

3. **NODE_ENV:**
   - `production`: Production ortamı
   - `development`: Development ortamı
   - Vercel'de otomatik olarak `production` set edilir

4. **Vercel Otomatik Variables:**
   - `VERCEL=1`: Vercel ortamında otomatik set edilir
   - `PORT`: Vercel tarafından otomatik atanır

---

## 📋 Vercel'de Environment Variables Ekleme

### Adımlar:

1. **Vercel Dashboard** → Projenizi seçin
2. **Settings** → **Environment Variables**
3. Her değişkeni ekleyin:
   - **Name**: Değişken adı (örn: `MONGODB_URI`)
   - **Value**: Değişken değeri
   - **Environment**: Production, Preview, Development (hepsini seçin)
4. **Save** butonuna tıklayın
5. **Deployments** → En son deployment → **Redeploy** (önemli!)

### Önemli Notlar:

- ✅ Environment Variables ekledikten sonra **mutlaka redeploy yapın**
- ✅ "Use existing Build Cache" seçeneğini **KAPATIN**
- ✅ Production, Preview ve Development için ayrı ayrı ekleyebilirsiniz
- ✅ Sensitive bilgiler (şifreler, secret'lar) asla Git'e commit edilmemeli

---

## 🔒 Güvenlik Önerileri

1. **JWT_SECRET:**
   - Her proje için farklı bir secret kullanın
   - En az 32 karakter, random string
   - Production'da mutlaka güçlü bir değer

2. **MongoDB URI:**
   - Şifreler URL-encoded olmalı (özel karakterler için)
   - IP whitelist'i kontrol edin (0.0.0.0/0 development için)
   - Database kullanıcısının sadece gerekli yetkilere sahip olduğundan emin olun

3. **Environment Variables:**
   - `.env` dosyası `.gitignore`'da olmalı
   - Production secret'ları asla Git'e commit edilmemeli
   - Vercel'de Environment Variables kullanın

---

## 📝 MongoDB Atlas Connection String Örnekleri

### NoteFlow:
```
mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
```

### Randevu Sistemi:
```
mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.xxxxx.mongodb.net/randevu-sistemi?retryWrites=true&w=majority
```

### Apartman Yönetim:
```
mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.xxxxx.mongodb.net/apartman-yonetim?retryWrites=true&w=majority
```

### CloudNotes:
```
mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.xxxxx.mongodb.net/cloudnotes?retryWrites=true&w=majority
```

---

## 🚀 Hızlı Başlangıç

### Yeni Proje İçin:

1. MongoDB Atlas'ta yeni database oluştur
2. Connection string'i al
3. Vercel'de Environment Variables ekle:
   - `MONGODB_URI`
   - `JWT_SECRET` (güçlü bir değer)
   - `NODE_ENV=production`
4. Redeploy yap

---

## 📞 Sorun Giderme

### MongoDB Bağlantı Hatası:
- ✅ IP whitelist kontrolü (0.0.0.0/0)
- ✅ Kullanıcı adı ve şifre doğru mu?
- ✅ Connection string formatı doğru mu?
- ✅ Database adı doğru mu?

### JWT Hatası:
- ✅ `JWT_SECRET` set edilmiş mi?
- ✅ Secret yeterince güçlü mü?
- ✅ Token expire süresi kontrol edin

### Vercel Deployment Hatası:
- ✅ Environment Variables eklenmiş mi?
- ✅ Redeploy yapıldı mı?
- ✅ Function Logs kontrol edin

---

**Son Güncelleme:** 2025-01-27
**Not:** Bu dosya tüm projelerinizin environment variables özetini içerir. Production'da mutlaka güçlü secret'lar kullanın!

