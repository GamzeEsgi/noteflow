# 🔧 Vercel Mongoose Modül Hatası Çözümü

## ❌ Hata Mesajı

```
Cannot find module 'mongoose'
Require stack:
- /var/task/backend/config/database.js
- /var/task/backend/server.js
Did you forget to add it to "dependencies" in `package.json`?
```

## 🔍 Sorun

Vercel, build sırasında `mongoose` modülünü bulamıyor. Bu genellikle şu nedenlerden kaynaklanır:

1. **Vercel build sırasında `package.json`'ı bulamıyor**
2. **`npm install` komutu çalışmıyor**
3. **Build ayarları eksik**

---

## ✅ Çözüm: vercel.json Güncellemesi

### Yapılan Değişiklik:

`vercel.json` dosyasına build komutları eklendi:

```json
{
  "version": 2,
  "buildCommand": "npm install",
  "installCommand": "npm install",
  "builds": [
    { "src": "backend/server.js", "use": "@vercel/node" },
    { "src": "frontend/**/*", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/server.js" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ]
}
```

### Açıklama:

- **`buildCommand`**: Build sırasında çalışacak komut
- **`installCommand`**: Bağımlılıkları yüklemek için komut
- Bu ayarlar, Vercel'in `package.json`'ı bulup `npm install` yapmasını sağlar

---

## ✅ Kontrol Listesi

### 1. package.json Kontrolü

Kök dizindeki `package.json` dosyasında `mongoose` var mı?

```json
{
  "dependencies": {
    "mongoose": "^7.5.0",
    ...
  }
}
```

✅ **Kontrol:** `package.json` dosyasında `mongoose` var.

### 2. vercel.json Kontrolü

`vercel.json` dosyasında build komutları var mı?

✅ **Kontrol:** `buildCommand` ve `installCommand` eklendi.

### 3. GitHub'a Push Edildi mi?

Değişiklikler GitHub'a push edildi mi?

✅ **Kontrol:** `vercel.json` ve `package.json` GitHub'a push edildi.

---

## 🚀 Sonraki Adımlar

### 1. Vercel'de Redeploy Yapın

1. **Vercel Dashboard** → Projeniz → **Deployments**
2. En son deployment'ı bulun
3. **"..."** menüsü → **"Redeploy"**
4. ⚠️ **"Use existing Build Cache"** seçeneğini **KAPATIN**
5. **"Redeploy"** butonuna tıklayın

### 2. Build Logs Kontrolü

1. Deployment sırasında **"Build Logs"** sekmesine tıklayın
2. Şu mesajları görmelisiniz:
   ```
   Installing dependencies...
   npm install
   added X packages
   ```

### 3. Function Logs Kontrolü

1. Deployment tamamlandıktan sonra **"Function Logs"** sekmesine tıklayın
2. Artık `mongoose` hatası olmamalı

---

## 🔍 Sorun Devam Ediyorsa

### 1. Vercel Build Settings Kontrolü

1. **Vercel Dashboard** → Projeniz → **Settings** → **General**
2. **Build & Development Settings** bölümünü kontrol edin:
   - **Framework Preset:** Other
   - **Build Command:** `npm install` (veya boş)
   - **Output Directory:** (boş)
   - **Install Command:** `npm install` (veya boş)

### 2. Root Directory Kontrolü

1. **Settings** → **General** → **Root Directory**
2. Kök dizin doğru mu? (`./` veya boş)

### 3. package.json Konumu

`package.json` dosyası kök dizinde mi?

```
/project-root
  ├── package.json  ✅ (Burada olmalı)
  ├── vercel.json
  ├── backend/
  └── frontend/
```

---

## 💡 İpuçları

### Vercel Build Süreci

1. **Install:** `npm install` çalışır (bağımlılıklar yüklenir)
2. **Build:** `npm run build` çalışır (eğer varsa)
3. **Deploy:** Serverless function'lar deploy edilir

### package.json Önemli

- ✅ `package.json` kök dizinde olmalı
- ✅ Tüm bağımlılıklar `dependencies` içinde olmalı
- ✅ `devDependencies` production'da yüklenmez

### Build Cache

- ⚠️ İlk deployment'da cache olmadan deploy yapın
- ✅ Sonraki deployment'larda cache kullanılabilir

---

## 📋 Kontrol Listesi

- [ ] `package.json` kök dizinde mi?
- [ ] `mongoose` `dependencies` içinde mi?
- [ ] `vercel.json` güncellendi mi?
- [ ] GitHub'a push edildi mi?
- [ ] Vercel'de redeploy yapıldı mı? (cache olmadan)
- [ ] Build logs'da `npm install` görünüyor mu?
- [ ] Function logs'da `mongoose` hatası yok mu?

---

## 🎯 Özet

**Sorun:** Vercel build sırasında `mongoose` modülünü bulamıyor.

**Çözüm:** `vercel.json`'a `buildCommand` ve `installCommand` eklendi.

**Sonraki Adım:** Vercel'de redeploy yapın (cache olmadan).

---

**Not:** Değişiklikler GitHub'a push edildi. Vercel otomatik olarak yeni deployment yapacak veya manuel redeploy yapabilirsiniz.



