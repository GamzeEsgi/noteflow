# 🔐 Vercel'de Environment Variables Ekleme Rehberi

## 📋 Adım Adım Vercel Dashboard'da Environment Variables Ekleme

### 1️⃣ Vercel Dashboard'a Giriş

1. [https://vercel.com/dashboard](https://vercel.com/dashboard) adresine gidin
2. GitHub hesabınızla giriş yapın
3. **"Add New Project"** veya mevcut projenizi seçin

---

### 2️⃣ Projeyi Seçin veya Oluşturun

#### Yeni Proje İçin:
1. **"Add New Project"** butonuna tıklayın
2. GitHub repository'nizi seçin: `GamzeEsgi/noteflow`
3. **"Import"** butonuna tıklayın
4. Framework Preset: **"Other"** seçin
5. **"Deploy"** butonuna tıklayın (ilk deployment)

#### Mevcut Proje İçin:
1. Dashboard'da projenizi bulun
2. Projenizin üzerine tıklayın

---

### 3️⃣ Environment Variables Ekleme

1. Proje sayfasında üst menüden **"Settings"** sekmesine tıklayın
2. Sol menüden **"Environment Variables"** seçeneğine tıklayın
3. Sağ üstteki **"Add New"** butonuna tıklayın

---

### 4️⃣ Her Variable'ı Tek Tek Ekleyin

#### ✅ 1. MONGODB_URI

**Name:**
```
MONGODB_URI
```

**Value:**
```
mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
```

**Environment:**
- ✅ Production
- ✅ Preview  
- ✅ Development

**"Save"** butonuna tıklayın

---

#### ✅ 2. JWT_SECRET

**Name:**
```
JWT_SECRET
```

**Value:**
```
noteflow-super-secret-jwt-key-2025-change-this-in-production
```

**Not:** Production için daha güçlü bir secret kullanın. Örnek:
```bash
# Terminal'de şunu çalıştırabilirsiniz:
openssl rand -base64 32
```

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development

**"Save"** butonuna tıklayın

---

#### ✅ 3. PORT (Opsiyonel)

**Name:**
```
PORT
```

**Value:**
```
5000
```

**Not:** Vercel otomatik olarak port atar, bu opsiyonel.

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development

**"Save"** butonuna tıklayın

---

#### ✅ 4. NODE_ENV (Opsiyonel)

**Name:**
```
NODE_ENV
```

**Value:**
```
production
```

**Environment:**
- ✅ Production
- ✅ Preview
- ✅ Development

**"Save"** butonuna tıklayın

---

### 5️⃣ Environment Variables Listesi

Ekledikten sonra şu şekilde görünmelidir:

| Name | Value (masked) | Environments |
|------|----------------|--------------|
| MONGODB_URI | `mongodb+srv://gamze07:****@...` | Production, Preview, Development |
| JWT_SECRET | `noteflow-super-secret-****` | Production, Preview, Development |
| PORT | `5000` | Production, Preview, Development |
| NODE_ENV | `production` | Production, Preview, Development |

---

### 6️⃣ Redeploy Yapın (ÇOK ÖNEMLİ!)

Environment Variables ekledikten sonra **mutlaka redeploy yapmalısınız:**

1. Üst menüden **"Deployments"** sekmesine tıklayın
2. En son deployment'ı bulun
3. Sağ üstteki **"..."** (üç nokta) menüsüne tıklayın
4. **"Redeploy"** seçeneğini seçin
5. ⚠️ **"Use existing Build Cache"** seçeneğini **KAPATIN** (önemli!)
6. **"Redeploy"** butonuna tıklayın

---

## 📸 Görsel Rehber

### Settings Sayfası:
```
Vercel Dashboard
  └─ Your Project
      └─ Settings (üst menü)
          └─ Environment Variables (sol menü)
              └─ Add New (sağ üst)
```

### Add New Form:
```
┌─────────────────────────────────────┐
│ Name: [MONGODB_URI            ]      │
│                                     │
│ Value: [mongodb+srv://...    ]     │
│                                     │
│ Environment:                        │
│ ☑ Production                        │
│ ☑ Preview                           │
│ ☑ Development                       │
│                                     │
│ [Cancel]  [Save]                   │
└─────────────────────────────────────┘
```

---

## ✅ Kontrol Listesi

Deployment öncesi kontrol edin:

- [ ] `MONGODB_URI` eklendi mi?
- [ ] `JWT_SECRET` eklendi mi?
- [ ] Tüm environment'lar seçildi mi? (Production, Preview, Development)
- [ ] Redeploy yapıldı mı?
- [ ] "Use existing Build Cache" kapatıldı mı?

---

## 🧪 Test

Deployment tamamlandıktan sonra:

1. **Health Check:**
   ```
   https://your-project.vercel.app/api/health
   ```

2. **Function Logs Kontrol:**
   - Vercel Dashboard → Deployments → En son deployment
   - **"Function Logs"** sekmesine tıklayın
   - MongoDB bağlantı mesajlarını kontrol edin

3. **Frontend Test:**
   - Register sayfasından yeni kullanıcı oluşturun
   - Login yapın
   - Not ekleyin

---

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası:

**Function Logs'da şunu görüyorsanız:**
```
❌ MongoDB bağlantı hatası: authentication failed
```

**Çözüm:**
1. `MONGODB_URI` değerini kontrol edin
2. Kullanıcı adı ve şifre doğru mu?
3. MongoDB Atlas'ta IP whitelist kontrol edin (0.0.0.0/0)
4. Redeploy yapın

---

### JWT Hatası:

**Function Logs'da şunu görüyorsanız:**
```
Error: jwt malformed
```

**Çözüm:**
1. `JWT_SECRET` eklendi mi kontrol edin
2. Redeploy yapın
3. "Use existing Build Cache" kapalı mı kontrol edin

---

### Environment Variable Bulunamadı:

**Function Logs'da şunu görüyorsanız:**
```
MONGODB_URI environment variable eksik!
```

**Çözüm:**
1. Settings → Environment Variables kontrol edin
2. Variable'ın tüm environment'larda seçili olduğundan emin olun
3. Redeploy yapın (cache olmadan)

---

## 📝 Önemli Notlar

1. **Sensitive Data:**
   - Environment Variables'lar masked (gizlenmiş) görünür
   - Value'ları görmek için "Show" butonuna tıklayın
   - Production secret'ları asla paylaşmayın

2. **Environment Seçimi:**
   - **Production:** Canlı ortam
   - **Preview:** Pull request'ler için
   - **Development:** Local development için

3. **Redeploy:**
   - Her environment variable ekledikten sonra redeploy yapın
   - "Use existing Build Cache" mutlaka kapatın
   - Redeploy olmadan yeni variable'lar kullanılmaz

4. **MongoDB Atlas:**
   - IP whitelist'te `0.0.0.0/0` olmalı (tüm IP'lere izin)
   - Database kullanıcısı "Read and write to any database" yetkisine sahip olmalı

---

## 🚀 Hızlı Başlangıç

### 1. Vercel Dashboard'a Git
```
https://vercel.com/dashboard
```

### 2. Projenizi Seçin
```
GamzeEsgi/noteflow
```

### 3. Settings → Environment Variables
```
Settings → Environment Variables → Add New
```

### 4. Variables Ekle
```
MONGODB_URI = mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
JWT_SECRET = noteflow-super-secret-jwt-key-2025
```

### 5. Redeploy
```
Deployments → ... → Redeploy (cache olmadan)
```

---

**Hazır! 🎉**

Artık projeniz Vercel'de çalışmaya hazır!



