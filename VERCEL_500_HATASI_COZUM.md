# 🔧 Vercel 500 Hatası Çözümü

## ❌ Hata Mesajı

```
Failed to load resource: the server responded with a status of 500 ()
```

## 🔍 500 Hatası Nedir?

500 Internal Server Error, sunucu tarafında bir hata olduğunu gösterir. Vercel'de bu genellikle şu nedenlerden kaynaklanır:

1. **MongoDB bağlantı sorunu**
2. **Environment Variables eksik/yanlış**
3. **API endpoint'inde kod hatası**
4. **Serverless function timeout**

---

## ✅ Çözüm 1: Vercel Function Logs Kontrolü

### Adımlar:

1. **Vercel Dashboard** → Projeniz → **"Deployments"** sekmesi
2. En son deployment'ı bulun
3. Deployment'ın üzerine tıklayın
4. **"Function Logs"** sekmesine tıklayın
5. Hata mesajını okuyun

### Örnek Hata Mesajları:

```
❌ MongoDB bağlantı hatası: authentication failed
❌ MONGODB_URI environment variable eksik!
❌ JWT_SECRET is not defined
❌ Cannot read property 'findOne' of undefined
```

---

## ✅ Çözüm 2: Environment Variables Kontrolü

### Kontrol Edin:

1. **Vercel Dashboard** → Projeniz → **Settings** → **Environment Variables**
2. Şu variables'ların olduğundan emin olun:
   - ✅ `MONGODB_URI`
   - ✅ `JWT_SECRET`
3. Her variable'ın **tüm environment'larda** seçili olduğundan emin:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### MONGODB_URI Formatı:

```
mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
```

**Kontrol:**
- ✅ Kullanıcı adı doğru mu? (`gamze07`)
- ✅ Şifre doğru mu? (`Gamze.Esgi27`)
- ✅ Cluster ID doğru mu? (`cluster0.1lpagmv`)
- ✅ Database adı doğru mu? (`noteflow`)

---

## ✅ Çözüm 3: MongoDB Atlas Kontrolü

### 1. IP Whitelist

1. **MongoDB Atlas** → **Network Access**
2. **IP Whitelist** kontrol edin
3. `0.0.0.0/0` ekli mi? (Tüm IP'lere izin verir)

### 2. Database User

1. **MongoDB Atlas** → **Database Access**
2. Kullanıcı adı: `gamze07` var mı?
3. Şifre: `Gamze.Esgi27` doğru mu?
4. Yetkiler: **"Read and write to any database"** seçili mi?

### 3. Connection String

1. **MongoDB Atlas** → **Clusters** → **Connect**
2. **"Connect your application"** seçin
3. Connection string'i kopyalayın
4. `<password>` kısmını şifrenizle değiştirin
5. `<dbname>` kısmını `noteflow` ile değiştirin

---

## ✅ Çözüm 4: Redeploy Yapın

Environment Variables ekledikten sonra **mutlaka redeploy yapın:**

1. **Deployments** sekmesine gidin
2. En son deployment'ı bulun
3. **"..."** menüsü → **"Redeploy"**
4. ⚠️ **"Use existing Build Cache"** seçeneğini **KAPATIN**
5. **"Redeploy"** butonuna tıklayın

---

## 🔍 Yaygın Hata Mesajları ve Çözümleri

### 1. "MONGODB_URI environment variable eksik!"

**Çözüm:**
- Vercel Dashboard → Settings → Environment Variables
- `MONGODB_URI` ekleyin
- Redeploy yapın

### 2. "MongoDB bağlantı hatası: authentication failed"

**Çözüm:**
- MongoDB Atlas → Database Access
- Kullanıcı adı ve şifre doğru mu kontrol edin
- Connection string'deki şifreyi kontrol edin
- Özel karakterler URL-encoded olmalı (örn: `@` → `%40`)

### 3. "JWT_SECRET is not defined"

**Çözüm:**
- Vercel Dashboard → Settings → Environment Variables
- `JWT_SECRET` ekleyin
- Redeploy yapın

### 4. "Cannot read property 'findOne' of undefined"

**Çözüm:**
- MongoDB bağlantısı başarısız olmuş
- `MONGODB_URI` kontrol edin
- Function Logs'da MongoDB hata mesajını kontrol edin

### 5. "Network timeout" veya "Connection timeout"

**Çözüm:**
- MongoDB Atlas → Network Access
- IP whitelist'te `0.0.0.0/0` var mı kontrol edin
- Vercel'in IP adreslerini ekleyin (daha güvenli)

---

## 🧪 API Test

### Browser Console'da Test Edin:

```javascript
// Health check
fetch('https://your-project.vercel.app/api/health')
  .then(res => res.json())
  .then(data => console.log('Health:', data))
  .catch(err => console.error('Hata:', err));

// Register test
fetch('https://your-project.vercel.app/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123456'
  })
})
.then(res => res.json())
.then(data => console.log('Register:', data))
.catch(err => console.error('Hata:', err));
```

---

## 📋 Kontrol Listesi

- [ ] Vercel Function Logs kontrol edildi mi?
- [ ] Environment Variables eklendi mi?
  - [ ] `MONGODB_URI`
  - [ ] `JWT_SECRET`
- [ ] Tüm environment'lar seçili mi?
- [ ] MongoDB Atlas IP whitelist kontrol edildi mi?
- [ ] MongoDB kullanıcı adı ve şifre doğru mu?
- [ ] Redeploy yapıldı mı? (cache olmadan)
- [ ] API health check çalışıyor mu?

---

## 🚀 Hızlı Çözüm Adımları

1. **Vercel Dashboard** → Deployments → Function Logs
2. Hata mesajını okuyun
3. Environment Variables kontrol edin
4. MongoDB Atlas kontrol edin
5. Redeploy yapın (cache olmadan)
6. Test edin

---

## 💡 İpuçları

### Function Logs Nasıl Okunur?

1. **Deployments** → En son deployment
2. **Function Logs** sekmesi
3. Hata mesajını bulun (genellikle kırmızı)
4. İlk hata mesajı en önemlisidir

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

---

**Özet:** 500 hatası genellikle MongoDB bağlantı sorunu veya eksik Environment Variables'dan kaynaklanır. Function Logs'u kontrol ederek hatanın tam nedenini bulabilirsiniz!



