# 🔧 Vercel Dependencies Fix - Cannot find module 'express'

## 🚨 Sorun

```
Error: Cannot find module 'express'
Require stack:
- /var/task/backend/server.js
- /var/task/api/index.js
```

Vercel'de `express` modülü bulunamıyor.

## ✅ Yapılan Düzeltmeler

### 1. vercel.json Güncellendi

`vercel.json` dosyasına `installCommand` ve `buildCommand` eklendi:

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm install"
}
```

### 2. .npmrc Dosyası Eklendi

Root dizine `.npmrc` dosyası eklendi:

```
legacy-peer-deps=true
```

## 🔍 Sorun Giderme

### Adım 1: Vercel Build Logs Kontrolü

1. **Vercel Dashboard** → **Deployments**
2. En son deployment'ın üzerine tıklayın
3. **"Build Logs"** sekmesine tıklayın
4. Şu mesajları arayın:

**Başarılı durumda:**
```
npm install
added 150 packages
```

**Hata durumunda:**
```
npm ERR! Cannot find module 'express'
```

### Adım 2: package.json Kontrolü

Root `package.json` dosyasında şu dependencies'lerin olduğundan emin olun:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### Adım 3: Vercel Project Settings

1. **Vercel Dashboard** → Projeniz → **Settings** → **General**
2. **"Install Command"** kontrol edin:
   - `npm install` olmalı
3. **"Build Command"** kontrol edin:
   - Boş bırakılabilir veya `npm run build` (eğer build script varsa)
4. **"Root Directory"** kontrol edin:
   - Boş bırakılmalı (root'ta package.json var)

### Adım 4: Redeploy (Cache Olmadan)

1. **Vercel Dashboard** → **Deployments**
2. En son deployment'ın yanındaki **"..."** menüsüne tıklayın
3. **"Redeploy"** seçeneğini seçin
4. ⚠️ **"Use existing Build Cache"** seçeneğini **KAPATIN**
5. **"Redeploy"** butonuna tıklayın

## 🐛 Alternatif Çözümler

### Çözüm 1: package-lock.json Sil ve Yeniden Oluştur

```bash
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Regenerate package-lock.json"
git push
```

### Çözüm 2: Vercel CLI ile Deploy

```bash
npm i -g vercel
vercel --prod
```

### Çözüm 3: Dependencies'leri Manuel Kontrol Et

Root `package.json` dosyasında tüm dependencies'lerin doğru olduğundan emin olun:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

## 📋 Kontrol Listesi

- [ ] `package.json` root'ta mı?
- [ ] `package.json`'da `express` dependency'si var mı?
- [ ] `vercel.json`'da `installCommand` var mı?
- [ ] `.npmrc` dosyası eklendi mi?
- [ ] Build logs'da `npm install` çalıştı mı?
- [ ] Redeploy yapıldı mı (cache olmadan)?

## 🚀 Sonraki Adımlar

1. ✅ Değişiklikler push edildi
2. ⏳ Vercel otomatik redeploy yapacak (2-3 dakika)
3. 📊 Build Logs'u kontrol edin
4. 🧪 Test edin

**Başarılar! 🎉**

