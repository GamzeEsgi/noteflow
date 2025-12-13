# ⚙️ Vercel "Other" Framework Ayarları

## 📋 Vercel'de "Other" Seçeneği İçin Yapılacaklar

### 1️⃣ Framework Preset: "Other" Seçildi

Vercel'de proje eklerken **"Other"** seçeneğini seçtiyseniz, şu ayarları yapmanız gerekir:

---

## 🔧 Build Settings

### Root Directory
```
./
```
(Kök dizin - değiştirmeyin)

### Build Command
```
npm install
```
veya **boş bırakın** (Vercel otomatik yükler)

### Output Directory
```
.
```
veya **boş bırakın** (root directory)

### Install Command
```
npm install
```
veya **boş bırakın** (otomatik)

---

## 📝 Önerilen Ayarlar

### Minimal Ayarlar (Önerilen)

```
Framework Preset: Other
Root Directory: ./
Build Command: (boş bırakın)
Output Directory: (boş bırakın)
Install Command: (boş bırakın)
```

**Not:** Vercel `package.json` dosyanızı otomatik algılar ve gerekli komutları çalıştırır.

---

## ✅ Kontrol Listesi

### 1. Framework Preset
- [x] **Other** seçildi

### 2. Root Directory
- [ ] `./` (kök dizin)
- [ ] Veya boş bırakın

### 3. Build Command
- [ ] Boş bırakın (önerilen)
- [ ] Veya `npm install` yazın

### 4. Output Directory
- [ ] Boş bırakın (önerilen)
- [ ] Veya `./` yazın

### 5. Install Command
- [ ] Boş bırakın (önerilen)
- [ ] Veya `npm install` yazın

---

## 🚀 Deploy Butonuna Tıklayın

Tüm ayarları yaptıktan sonra:

1. **"Deploy"** butonuna tıklayın
2. Vercel otomatik olarak:
   - `package.json` dosyanızı okur
   - Bağımlılıkları yükler (`npm install`)
   - Projeyi deploy eder

---

## 📄 vercel.json Kontrolü

Projenizde `vercel.json` dosyası varsa, Vercel bu dosyayı otomatik kullanır:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

**Not:** `vercel.json` dosyanız zaten mevcut, Vercel bunu otomatik kullanacak.

---

## 🎯 Hızlı Adımlar

### 1. Framework Preset
```
Other ✅
```

### 2. Root Directory
```
./ (veya boş)
```

### 3. Build Settings
```
Build Command: (boş)
Output Directory: (boş)
Install Command: (boş)
```

### 4. Environment Variables
```
(Şimdilik atlayın, sonra ekleyeceğiz)
```

### 5. Deploy
```
"Deploy" butonuna tıklayın
```

---

## ⚠️ Önemli Notlar

### Build Command Boş Bırakılabilir
- Vercel `package.json`'daki `scripts` bölümünü otomatik kullanır
- Eğer özel bir build komutu yoksa boş bırakın

### Output Directory
- Node.js projeleri için genellikle boş bırakılır
- Vercel serverless functions kullanır

### Root Directory
- Proje kök dizininde ise `./` veya boş bırakın
- Alt klasörde ise (örn: `backend/`) o klasörü belirtin

---

## 🔍 Sorun Giderme

### Build Hatası Alıyorsanız:

1. **Build Command'ı kontrol edin:**
   - Boş bırakın veya `npm install` yazın
   - `npm run build` yazmayın (projenizde build script yoksa)

2. **package.json kontrol edin:**
   - `package.json` dosyası kök dizinde olmalı
   - `scripts` bölümü doğru olmalı

3. **vercel.json kontrol edin:**
   - Dosya formatı doğru mu?
   - JSON syntax hatası var mı?

---

## 📋 Örnek Ayarlar

### Minimal (Önerilen)
```
Framework: Other
Root Directory: ./
Build Command: (boş)
Output Directory: (boş)
Install Command: (boş)
```

### Manuel Ayarlar
```
Framework: Other
Root Directory: ./
Build Command: npm install
Output Directory: ./
Install Command: npm install
```

**Her iki yöntem de çalışır!** Minimal ayarlar önerilir.

---

## ✅ Sonraki Adımlar

Deploy tamamlandıktan sonra:

1. **Environment Variables ekleyin:**
   - Settings → Environment Variables
   - `MONGODB_URI` ekleyin
   - `JWT_SECRET` ekleyin

2. **Redeploy yapın:**
   - Deployments → Redeploy
   - Cache olmadan

3. **Test edin:**
   - URL'inizi açın
   - API health check yapın

---

**Özet:** "Other" seçeneğini seçtiyseniz, çoğu ayarı boş bırakabilirsiniz. Vercel otomatik olarak `package.json` ve `vercel.json` dosyalarınızı kullanır. Sadece **"Deploy"** butonuna tıklayın! 🚀



