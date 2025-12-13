# 🌐 Vercel URL Nasıl Bulunur?

## 📍 Vercel Proje URL'inizi Bulma

### 1️⃣ Deployment Sonrası Otomatik URL

Vercel projenizi deploy ettikten sonra, URL otomatik olarak oluşturulur:

#### Format:
```
https://PROJE-ADI.vercel.app
```

#### Örnek:
```
https://noteflow.vercel.app
```

veya

```
https://noteflow-gamzeesgi.vercel.app
```

---

### 2️⃣ Vercel Dashboard'dan URL Bulma

#### Adım 1: Dashboard'a Gidin
1. [https://vercel.com/dashboard](https://vercel.com/dashboard) açın
2. GitHub hesabınızla giriş yapın

#### Adım 2: Projenizi Seçin
1. Dashboard'da **"noteflow"** projenizi bulun
2. Projenin üzerine tıklayın

#### Adım 3: URL'i Görün
Proje sayfasında **üst kısımda** URL'inizi göreceksiniz:

```
┌─────────────────────────────────────────┐
│  noteflow                                │
│  ─────────────────────────────────────  │
│  🌐 https://noteflow.vercel.app         │
│  📊 Last deployed: 2 minutes ago         │
│  ✅ Production                           │
└─────────────────────────────────────────┘
```

---

### 3️⃣ Deployments Sekmesinden

1. Proje sayfasında **"Deployments"** sekmesine tıklayın
2. En son deployment'ı bulun
3. Deployment'ın yanında **URL** görünecektir:

```
┌─────────────────────────────────────────┐
│ Deployments                             │
│ ──────────────────────────────────────  │
│ ✅ Production                            │
│    https://noteflow.vercel.app          │
│    Deployed 2 minutes ago                │
│                                          │
│ 📦 Preview                               │
│    https://noteflow-git-main-...        │
└─────────────────────────────────────────┘
```

---

### 4️⃣ Settings Sekmesinden

1. Proje sayfasında **"Settings"** sekmesine tıklayın
2. **"General"** altında **"Domains"** bölümünü bulun
3. Vercel otomatik domain'inizi göreceksiniz:

```
┌─────────────────────────────────────────┐
│ Domains                                 │
│ ──────────────────────────────────────  │
│ Production Domain:                      │
│ https://noteflow.vercel.app             │
│                                          │
│ Preview Domains:                        │
│ https://noteflow-*.vercel.app          │
└─────────────────────────────────────────┘
```

---

## 🔗 URL Türleri

### Production URL (Ana URL)
```
https://noteflow.vercel.app
```
- Canlı ortam
- Her zaman aynı
- Production deployment'lar için

### Preview URL (Geçici)
```
https://noteflow-git-main-gamzeesgi.vercel.app
```
- Pull request'ler için
- Her deployment için farklı
- Test için kullanılır

---

## 📝 URL'i Kopyalama

### Yöntem 1: Dashboard'dan
1. Proje sayfasında URL'in üzerine tıklayın
2. URL otomatik olarak kopyalanır
3. Veya URL'i seçip `Ctrl+C` yapın

### Yöntem 2: Deployments'tan
1. Deployments sekmesinde URL'in yanındaki **kopyala ikonu**na tıklayın
2. URL panoya kopyalanır

---

## 🧪 URL'i Test Etme

### 1. Ana Sayfa
```
https://noteflow.vercel.app
```
Tarayıcıda açın → Login sayfası görünmeli

### 2. API Health Check
```
https://noteflow.vercel.app/api/health
```
Tarayıcıda açın → JSON response görmeli:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 3. API Endpoints
```
https://noteflow.vercel.app/api/auth/register
https://noteflow.vercel.app/api/auth/login
https://noteflow.vercel.app/api/notes
```

---

## 🔄 URL Değişikliği

### Vercel Otomatik URL
- İlk deployment'da otomatik oluşturulur
- Proje adına göre belirlenir
- Değiştirilemez (ama custom domain eklenebilir)

### Custom Domain Ekleme (Opsiyonel)
1. Settings → Domains
2. "Add Domain" butonuna tıklayın
3. Kendi domain'inizi ekleyin (örn: `noteflow.com`)

---

## 📱 Frontend'de URL Kullanımı

### API URL'i Güncelleme

`frontend/app.js` dosyasında API URL'ini güncelleyin:

```javascript
// Local development
const API_URL = 'http://localhost:5000/api';

// Production (Vercel)
const API_URL = 'https://noteflow.vercel.app/api';
```

### Environment Variable ile (Önerilen)

```javascript
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
```

Vercel'de Environment Variable ekleyin:
- **Name:** `API_URL`
- **Value:** `https://noteflow.vercel.app/api`

---

## ✅ Kontrol Listesi

- [ ] Vercel Dashboard'a giriş yaptım
- [ ] Projemi buldum (noteflow)
- [ ] URL'i kopyaladım
- [ ] URL'i tarayıcıda test ettim
- [ ] API health check çalışıyor
- [ ] Frontend'de API URL'ini güncelledim

---

## 🎯 Hızlı Erişim

### Vercel Dashboard:
```
https://vercel.com/dashboard
```

### Proje URL'i (örnek):
```
https://noteflow.vercel.app
```

### API Health Check:
```
https://noteflow.vercel.app/api/health
```

---

## 📞 Sorun Giderme

### URL Çalışmıyor:
1. ✅ Deployment tamamlandı mı kontrol edin
2. ✅ Function Logs kontrol edin
3. ✅ Environment Variables eklenmiş mi kontrol edin
4. ✅ Redeploy yapın

### 404 Hatası:
1. ✅ `vercel.json` dosyası doğru yapılandırılmış mı?
2. ✅ API route'ları `/api/` ile başlıyor mu?
3. ✅ Root route (`/`) tanımlı mı?

---

**Not:** Vercel URL'iniz deployment sonrası otomatik olarak oluşturulur ve proje sayfasında görünür!



