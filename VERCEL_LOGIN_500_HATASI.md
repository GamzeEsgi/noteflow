# 🔧 Vercel Login 500 Hatası Çözümü

## ❌ Hata Mesajı

```
api/auth/login:1 Failed to load resource: the server responded with a status of 500
```

## 🔍 500 Hatası Nedir?

Login endpoint'inde 500 hatası, sunucu tarafında bir hata olduğunu gösterir. Olası nedenler:

1. **MongoDB bağlantı sorunu**
2. **JWT_SECRET eksik/yanlış**
3. **Environment Variables eksik**
4. **Kod hatası**

---

## ✅ Çözüm 1: Vercel Function Logs Kontrolü (ÖNEMLİ!)

### Adımlar:

1. **Vercel Dashboard** → Projeniz → **"Deployments"** sekmesi
2. En son deployment'ı bulun
3. Deployment'ın üzerine tıklayın
4. **"Function Logs"** sekmesine tıklayın
5. **Login işlemi sırasında** oluşan hata mesajını okuyun

### Örnek Hata Mesajları:

```
❌ MongoDB bağlantı hatası: authentication failed
❌ MONGODB_URI environment variable eksik!
❌ JWT_SECRET is not defined
❌ Cannot read property 'findOne' of undefined
❌ Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin.
```

**Not:** Function Logs'daki hata mesajı, sorunun tam nedenini gösterir!

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

### MONGODB_URI Değeri:

```
mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
```

**Kontrol:**
- ✅ Kullanıcı adı: `gamze07`
- ✅ Şifre: `Gamze.Esgi27`
- ✅ Cluster ID: `cluster0.1lpagmv`
- ✅ Database: `noteflow`

### JWT_SECRET Değeri:

```
noteflow-super-secret-jwt-key-2025-change-this
```

**Not:** Production için daha güçlü bir secret kullanın!

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

### 3. Connection String Test

Browser Console'da test edin:
```javascript
// MongoDB bağlantısını test etmek için (sadece kontrol amaçlı)
fetch('https://your-project.vercel.app/api/health')
  .then(res => res.json())
  .then(data => console.log('Health:', data))
  .catch(err => console.error('Hata:', err));
```

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

### 1. "Database bağlantısı yok. Lütfen MongoDB bağlantısını kontrol edin."

**Neden:** MongoDB bağlantısı başarısız

**Çözüm:**
- ✅ `MONGODB_URI` Environment Variable'ı ekleyin
- ✅ MongoDB Atlas IP whitelist kontrol edin
- ✅ Kullanıcı adı ve şifre doğru mu kontrol edin
- ✅ Redeploy yapın

### 2. "JWT_SECRET is not defined"

**Neden:** JWT_SECRET Environment Variable eksik

**Çözüm:**
- ✅ Vercel Dashboard → Settings → Environment Variables
- ✅ `JWT_SECRET` ekleyin
- ✅ Tüm environment'ları seçin
- ✅ Redeploy yapın

### 3. "MongoDB bağlantı hatası: authentication failed"

**Neden:** MongoDB kullanıcı adı veya şifre yanlış

**Çözüm:**
- ✅ MongoDB Atlas → Database Access
- ✅ Kullanıcı adı: `gamze07` kontrol edin
- ✅ Şifre: `Gamze.Esgi27` kontrol edin
- ✅ Connection string'deki şifreyi kontrol edin
- ✅ Özel karakterler URL-encoded olmalı

### 4. "Invalid credentials"

**Neden:** Email veya şifre yanlış (bu 400 hatası, ama kontrol edin)

**Çözüm:**
- ✅ Email doğru mu? (`test@example.com`)
- ✅ Şifre doğru mu? (`test123456`)
- ✅ Kullanıcı kayıtlı mı? (Register sayfasından kayıt olun)

---

## 🧪 API Test

### Browser Console'da Test Edin:

```javascript
// 1. Health check
fetch('https://your-project.vercel.app/api/health')
  .then(res => res.json())
  .then(data => console.log('Health:', data))
  .catch(err => console.error('Hata:', err));

// 2. Login test
fetch('https://your-project.vercel.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123456'
  })
})
.then(res => {
  console.log('Status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Response:', data);
  if (data.token) {
    console.log('✅ Login başarılı!');
    localStorage.setItem('token', data.token);
  }
})
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
- [ ] Kullanıcı kayıtlı mı? (Register sayfasından kayıt olun)

---

## 🚀 Hızlı Çözüm Adımları

1. **Vercel Dashboard** → Deployments → Function Logs
2. **Hata mesajını okuyun** (en önemli adım!)
3. **Environment Variables kontrol edin**
4. **MongoDB Atlas kontrol edin**
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

### Environment Variables Formatı

**Doğru:**
```
MONGODB_URI = mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
JWT_SECRET = noteflow-super-secret-jwt-key-2025
```

**Yanlış:**
```
MONGODB_URI = @mongodb_uri  (Secret yoksa hata verir)
JWT_SECRET = (boş)
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

1. ✅ **Function Logs** → Hata mesajını okuyun
2. ✅ **Environment Variables** → `MONGODB_URI` ve `JWT_SECRET` var mı?
3. ✅ **MongoDB Atlas** → IP whitelist ve kullanıcı kontrolü
4. ✅ **Redeploy** → Cache olmadan

---

**Özet:** Login 500 hatası genellikle MongoDB bağlantı sorunu veya eksik Environment Variables'dan kaynaklanır. **Function Logs'u kontrol ederek** hatanın tam nedenini bulabilirsiniz!



