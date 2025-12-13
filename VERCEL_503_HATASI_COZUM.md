# 🔧 Vercel 503 Hatası Çözümü

## ❌ Hata Mesajı

```
Failed to load resource: the server responded with a status of 503
```

## 🔍 503 Hatası Nedir?

503 Service Unavailable hatası, sunucunun geçici olarak kullanılamadığını gösterir. Bu projede genellikle **MongoDB bağlantı sorunu** anlamına gelir.

### Kodda 503 Döndüren Yer:

```javascript
// backend/controllers/authController.js
if (mongoose.connection.readyState !== 1) {
  return res.status(503).json({ 
    message: 'Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin.',
    error: 'MongoDB not connected'
  });
}
```

---

## ✅ Çözüm 1: Vercel Function Logs Kontrolü (ÖNEMLİ!)

### Adımlar:

1. **Vercel Dashboard** → Projeniz → **"Deployments"** sekmesi
2. En son deployment'ı bulun
3. Deployment'ın üzerine tıklayın
4. **"Function Logs"** sekmesine tıklayın
5. **Login butonuna tıklayın** (hata oluşturmak için)
6. **Logs'u yenileyin** (F5)
7. **MongoDB bağlantı hatalarını** okuyun

### Örnek Hata Mesajları:

```
❌ MongoDB bağlantı hatası: authentication failed
❌ MongoDB bağlantı hatası: ENOTFOUND
❌ MongoDB bağlantı hatası: timeout
❌ MONGODB_URI environment variable eksik!
```

---

## ✅ Çözüm 2: Environment Variables Kontrolü

### Kontrol Edin:

1. **Vercel Dashboard** → Projeniz → **Settings** → **Environment Variables**
2. Şu variable'ın olduğundan emin olun:
   - ✅ `MONGODB_URI`
3. Variable'ın **tüm environment'larda** seçili olduğundan emin:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### MONGODB_URI Değeri:

```
mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
```

**Kontrol:**
- ✅ Kullanıcı adı: `gamze07`
- ✅ Şifre: `Gamze.Esgi27`
- ✅ Cluster ID: `cluster0.1lpagmv`
- ✅ Database: `noteflow`

---

## ✅ Çözüm 3: MongoDB Atlas Kontrolü

### 1. IP Whitelist

1. **MongoDB Atlas** → **Network Access**
2. **IP Whitelist** kontrol edin
3. `0.0.0.0/0` ekli mi? (Tüm IP'lere izin verir)

**Eğer yoksa:**
1. **"Add IP Address"** butonuna tıklayın
2. **"Allow Access from Anywhere"** seçeneğini seçin
3. **"Confirm"** butonuna tıklayın

### 2. Database User

1. **MongoDB Atlas** → **Database Access**
2. Kullanıcı adı: `gamze07` var mı?
3. Şifre: `Gamze.Esgi27` doğru mu?
4. Yetkiler: **"Read and write to any database"** seçili mi?

**Eğer kullanıcı yoksa:**
1. **"Add New Database User"** butonuna tıklayın
2. Kullanıcı adı: `gamze07`
3. Şifre: `Gamze.Esgi27`
4. Database User Privileges: **"Read and write to any database"**
5. **"Add User"** butonuna tıklayın

### 3. Connection String Test

Browser Console'da test edin:
```javascript
// MongoDB bağlantısını test etmek için
fetch('https://your-project.vercel.app/api/health')
  .then(res => res.json())
  .then(data => console.log('Health:', data))
  .catch(err => console.error('Hata:', err));
```

---

## ✅ Çözüm 4: Redeploy Yapın

Environment Variables ekledikten veya MongoDB Atlas ayarlarını değiştirdikten sonra **mutlaka redeploy yapın:**

1. **Deployments** sekmesine gidin
2. En son deployment'ı bulun
3. **"..."** menüsü → **"Redeploy"**
4. ⚠️ **"Use existing Build Cache"** seçeneğini **KAPATIN**
5. **"Redeploy"** butonuna tıklayın

---

## 🔍 Yaygın Hata Mesajları ve Çözümleri

### ❌ "Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin."

**Neden:** MongoDB bağlantısı başarısız

**Çözüm:**
1. ✅ `MONGODB_URI` Environment Variable'ı ekleyin
2. ✅ MongoDB Atlas IP whitelist kontrol edin (`0.0.0.0/0`)
3. ✅ MongoDB Atlas kullanıcı kontrol edin (`gamze07`)
4. ✅ Redeploy yapın

---

### ❌ "MongoDB bağlantı hatası: authentication failed"

**Neden:** MongoDB kullanıcı adı veya şifre yanlış

**Çözüm:**
1. ✅ MongoDB Atlas → Database Access
2. ✅ Kullanıcı adı: `gamze07` kontrol edin
3. ✅ Şifre: `Gamze.Esgi27` kontrol edin
4. ✅ Connection string'deki şifreyi kontrol edin
5. ✅ Özel karakterler URL-encoded olmalı (örn: `@` → `%40`)

---

### ❌ "MongoDB bağlantı hatası: ENOTFOUND"

**Neden:** MongoDB sunucusu bulunamadı

**Çözüm:**
1. ✅ Connection string formatını kontrol edin
2. ✅ Cluster ID doğru mu? (`cluster0.1lpagmv`)
3. ✅ MongoDB Atlas'ta cluster aktif mi?

---

### ❌ "MongoDB bağlantı hatası: timeout"

**Neden:** MongoDB bağlantı zaman aşımı

**Çözüm:**
1. ✅ MongoDB Atlas → Network Access → IP whitelist kontrol edin
2. ✅ `0.0.0.0/0` ekli mi?
3. ✅ Vercel'in IP adreslerini ekleyin (daha güvenli)

---

## 📋 Kontrol Listesi

- [ ] Vercel Function Logs kontrol edildi mi? (Hata mesajı okundu mu?)
- [ ] `MONGODB_URI` Environment Variable eklendi mi?
- [ ] Tüm environment'lar seçili mi? (Production, Preview, Development)
- [ ] MongoDB Atlas IP whitelist kontrol edildi mi? (`0.0.0.0/0`)
- [ ] MongoDB kullanıcı adı ve şifre doğru mu?
- [ ] MongoDB Atlas'ta cluster aktif mi?
- [ ] Redeploy yapıldı mı? (cache olmadan)

---

## 🚀 Hızlı Çözüm Adımları

1. **Vercel Dashboard** → Deployments → Function Logs
2. **Hata mesajını okuyun** (en önemli adım!)
3. **Environment Variables kontrol edin** (`MONGODB_URI`)
4. **MongoDB Atlas kontrol edin** (IP whitelist, kullanıcı)
5. **Redeploy yapın** (cache olmadan)
6. **Test edin**

---

## 💡 İpuçları

### Function Logs Nasıl Okunur?

1. **Deployments** → En son deployment
2. **Function Logs** sekmesi
3. **Login butonuna tıklayın** (hata oluşturmak için)
4. **Logs'u yenileyin** (F5)
5. **Kırmızı hata mesajını bulun**

### MongoDB Bağlantı Testi

Browser Console'da:
```javascript
// Health check
fetch('https://your-project.vercel.app/api/health')
  .then(res => res.json())
  .then(data => console.log('Health:', data))
  .catch(err => console.error('Hata:', err));
```

### Environment Variables Formatı

**Doğru:**
```
MONGODB_URI = mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
```

**Yanlış:**
```
MONGODB_URI = @mongodb_uri  (Secret yoksa hata verir)
MONGODB_URI = (boş)
```

---

## 📞 Hata Devam Ediyorsa

1. **Function Logs'daki tam hata mesajını** kopyalayın
2. **Environment Variables'ları** kontrol edin
3. **MongoDB Atlas** bağlantısını test edin
4. **Redeploy** yapın
5. **Browser Console**'da API test yapın

---

## 🎯 Öncelikli Kontroller

1. ✅ **Function Logs** → MongoDB bağlantı hata mesajını okuyun
2. ✅ **Environment Variables** → `MONGODB_URI` var mı?
3. ✅ **MongoDB Atlas** → IP whitelist ve kullanıcı kontrolü
4. ✅ **Redeploy** → Cache olmadan

---

**Özet:** 503 hatası MongoDB bağlantı sorununu gösterir. **Function Logs'u kontrol ederek** hatanın tam nedenini bulabilirsiniz!



