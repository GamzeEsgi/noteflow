# 🚀 Vercel Deployment Rehberi - NoteFlow

## 📋 Adım Adım Deployment

### 1. GitHub Repository Oluşturma

1. GitHub'da yeni bir repository oluşturun:
   - Repository adı: `noteflow` (veya istediğiniz isim)
   - Public veya Private seçin
   - **Initialize with README seçmeyin** (zaten README var)

2. Local repository'yi GitHub'a bağlayın:

```bash
# Mevcut remote'u kaldır (eğer farklı bir projeye bağlıysa)
git remote remove origin

# Yeni repository'yi ekle
git remote add origin https://github.com/KULLANICI_ADI/noteflow.git

# Branch'i main olarak ayarla
git branch -M main

# GitHub'a push et
git push -u origin main
```

### 2. Vercel'e Proje Ekleme

1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. "Add New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. "Import" butonuna tıklayın

### 3. Vercel Proje Ayarları

#### Framework Preset
- **Framework Preset:** Other
- **Root Directory:** `./` (kök dizin)

#### Build Settings
- **Build Command:** (boş bırakın veya `npm install`)
- **Output Directory:** (boş bırakın)
- **Install Command:** `npm install`

#### Environment Variables
Vercel dashboard'da "Environment Variables" sekmesine gidin ve şunları ekleyin:

```
MONGODB_URI=mongodb+srv://gamze07:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/noteflow?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

**ÖNEMLİ:** 
- `JWT_SECRET` değerini güçlü bir random string ile değiştirin
- Production için farklı bir MongoDB database adı kullanabilirsiniz

### 4. Deploy

1. "Deploy" butonuna tıklayın
2. Vercel otomatik olarak projeyi deploy edecek
3. Deployment tamamlandığında size bir URL verecek (örn: `noteflow.vercel.app`)

### 5. API URL'ini Güncelleme

Frontend'deki API URL'lerini Vercel URL'iniz ile güncelleyin:

`frontend/app.js` dosyasında:

```javascript
const API_URL = 'https://your-project.vercel.app/api';
```

Veya environment variable kullanın:

```javascript
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
```

### 6. MongoDB Atlas Ayarları

1. MongoDB Atlas dashboard'a gidin
2. **Network Access** sekmesine gidin
3. **IP Whitelist**'e `0.0.0.0/0` ekleyin (tüm IP'lere izin verir)
   - Veya Vercel'in IP adreslerini ekleyin (daha güvenli)

### 7. Test

1. Vercel URL'inizi açın
2. Register sayfasından yeni kullanıcı oluşturun
3. Login yapın
4. Not ekleyin ve test edin

## 🔧 Sorun Giderme

### MongoDB Bağlantı Hatası

- MongoDB Atlas'ta IP whitelist kontrolü yapın
- Connection string'in doğru olduğundan emin olun
- Database kullanıcısının doğru yetkilere sahip olduğunu kontrol edin

### API 404 Hatası

- `vercel.json` dosyasının doğru yapılandırıldığından emin olun
- API route'larının `/api/` ile başladığından emin olun

### CORS Hatası

- `backend/server.js` dosyasında CORS ayarlarını kontrol edin
- Vercel URL'inizi CORS origin listesine ekleyin

## 📝 Notlar

- Vercel serverless functions kullanır, bu yüzden MongoDB bağlantısı her istekte yeniden kurulabilir
- `backend/config/database.js` dosyasında connection caching kullanılıyor
- Production'da `JWT_SECRET` mutlaka güçlü bir değer olmalı
- `.env` dosyası Git'e commit edilmemeli (`.gitignore`'da var)

## 🎉 Başarılı Deployment Sonrası

1. Vercel URL'inizi not alın
2. Frontend'deki API URL'lerini güncelleyin
3. Test kullanıcısı oluşturun
4. Tüm özellikleri test edin

