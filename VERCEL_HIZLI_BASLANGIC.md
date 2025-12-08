# 🚀 Vercel'de Yayınlama - Hızlı Başlangıç

Projeniz zaten Vercel için hazır! Sadece şu adımları takip edin:

## ✅ 1. Vercel'e Giriş Yapın

1. https://vercel.com adresine gidin
2. **"Sign Up"** → **GitHub ile giriş yapın**
3. GitHub hesabınızı bağlayın

## ✅ 2. Yeni Proje Oluşturun

1. Dashboard'da **"Add New..."** veya **"New Project"** butonuna tıklayın
2. **"Import Git Repository"** seçin
3. **`GamzeEsgi/apartman-sikayet`** repository'nizi seçin
4. **"Import"** butonuna tıklayın

## ✅ 3. Proje Ayarları (Otomatik Algılanır)

Vercel otomatik olarak ayarları algılayacak:
- ✅ Framework: React
- ✅ Build Command: `npm run build` (backend/frontend)
- ✅ Output Directory: `backend/frontend/build`
- ✅ Root Directory: `.`

**Değişiklik yapmanıza gerek yok!** Direkt **"Deploy"** butonuna tıklayabilirsiniz.

## ✅ 4. Veritabanı Ekleyin (ÖNEMLİ!)

### Vercel Postgres Oluşturun:

1. Proje sayfasında **"Storage"** sekmesine tıklayın
2. **"Create Database"** butonuna tıklayın
3. **"Postgres"** seçin
4. Database adı girin (örn: `apartman-db`)
5. **Region** seçin (en yakın bölgeyi seçin)
6. **"Create"** butonuna tıklayın

✅ **`POSTGRES_URL` otomatik olarak environment variable olarak eklenecek!**

## ✅ 5. Environment Variables Ekleyin

**Settings** → **Environment Variables** sekmesine gidin:

### Zorunlu Değişkenler:

1. **JWT_SECRET**
   ```
   Key: JWT_SECRET
   Value: apartman_sikayet_2024_gizli_anahtar_xyz123
   ```
   ⚠️ Güçlü bir secret key oluşturun!

2. **REACT_APP_API_URL**
   ```
   Key: REACT_APP_API_URL
   Value: https://your-app-name.vercel.app
   ```
   ⚠️ Deploy sonrası gerçek URL'inizi buraya yazacaksınız!

### Opsiyonel (Önerilir):

3. **INIT_DB_SECRET**
   ```
   Key: INIT_DB_SECRET
   Value: güvenli_bir_secret_key_12345
   ```
   Veritabanı kurulumu için kullanılacak.

4. **NODE_ENV**
   ```
   Key: NODE_ENV
   Value: production
   ```

**Her değişken için:**
- ✅ **Production** işaretleyin
- ✅ **Preview** işaretleyin (opsiyonel)
- ✅ **Development** işaretleyin (opsiyonel)
- **"Save"** butonuna tıklayın

## ✅ 6. İlk Deploy

1. **"Deployments"** sekmesine gidin
2. **"Deploy"** butonuna tıklayın
3. 2-5 dakika bekleyin
4. Deploy tamamlandığında yeşil tik görünecek ✅

## ✅ 7. REACT_APP_API_URL'i Güncelleyin

Deploy tamamlandıktan sonra:

1. Vercel URL'inizi kopyalayın (örn: `https://apartman-sikayet-xyz.vercel.app`)
2. **Settings** → **Environment Variables**
3. `REACT_APP_API_URL` değerini gerçek URL ile güncelleyin
4. **"Save"** butonuna tıklayın
5. **"Deployments"** sekmesine gidin
6. En son deployment'ın yanındaki **"..."** menüsünden **"Redeploy"** seçin

## ✅ 8. Veritabanını Başlatın

Tarayıcıda şu URL'i açın:

```
https://your-app-name.vercel.app/api/init-db?secret=INIT_DB_SECRET_DEĞERİNİZ
```

**Örnek:**
```
https://apartman-sikayet-xyz.vercel.app/api/init-db?secret=güvenli_bir_secret_key_12345
```

Başarılı olduğunda şu mesajı göreceksiniz:
```json
{
  "success": true,
  "message": "Veritabanı başarıyla kuruldu!",
  "kategoriler": 8,
  "kullanicilar": 3,
  "testHesaplari": {
    "yonetici": "admin@test.com / 123456",
    "personel": "personel@test.com / 123456",
    "sakin": "sakin@test.com / 123456"
  }
}
```

## ✅ 9. Test Edin!

1. Sitenizi açın: `https://your-app-name.vercel.app`
2. Test hesaplarıyla giriş yapın:
   - **Yönetici:** admin@test.com / 123456
   - **Personel:** personel@test.com / 123456
   - **Sakin:** sakin@test.com / 123456

## 🎉 Başarılı!

Projeniz artık canlıda! 🚀

---

## 🔧 Sorun Giderme

### "Database connection error"
- `POSTGRES_URL` environment variable'ının olduğundan emin olun
- Vercel Postgres'in aktif olduğunu kontrol edin (Storage sekmesi)

### Frontend API'ye bağlanamıyor
- `REACT_APP_API_URL` değerinin doğru olduğundan emin olun
- Redeploy yaptığınızdan emin olun

### "Cannot find module"
- Deploy loglarını kontrol edin (Deployments → Logs)
- Tüm dependencies'in `package.json`'da olduğundan emin olun

### Veritabanı tabloları yok
- `/api/init-db` endpoint'ini çağırdığınızdan emin olun
- Secret key'in doğru olduğunu kontrol edin

---

## 📝 Önemli Notlar

- ✅ **Otomatik Deploy:** GitHub'a push yaptığınızda otomatik deploy olur
- ✅ **Custom Domain:** Settings'ten kendi domain'inizi ekleyebilirsiniz
- ✅ **Environment Variables:** Production'da değişiklik yapmak için Settings → Environment Variables
- ✅ **Logs:** Deployments sekmesinden logları görüntüleyebilirsiniz

---

**Hazırsınız! Vercel'de deploy edin! 🚀**

