# 🔧 Environment Variables Kurulumu

## Randevu Sistemindeki MongoDB'yi Kullanma

Randevu sisteminde kullandığınız MongoDB cluster'ını NoteSaaS projesinde de kullanmak için:

### 1. MongoDB Atlas'tan Connection String Alın

1. MongoDB Atlas'a giriş yapın: https://cloud.mongodb.com
2. Randevu sisteminde kullandığınız cluster'ı seçin
3. **"Connect"** butonuna tıklayın
4. **"Connect your application"** seçeneğini seçin
5. Connection string'i kopyalayın

### 2. .env Dosyasını Güncelleyin

Proje kök dizinindeki `.env` dosyasını açın ve şu şekilde güncelleyin:

```env
# Randevu sistemindeki MongoDB cluster'ını kullan
# Sadece database adını değiştirin: randevu-sistemi → notesaas
MONGODB_URI=mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.xxxxx.mongodb.net/notesaas?retryWrites=true&w=majority

# JWT Secret (güçlü bir random string)
JWT_SECRET=notesaas-super-secret-jwt-key-change-in-production-2024

# Port
PORT=5000
```

**ÖNEMLİ:**
- Connection string'deki `<username>` ve `<password>` kısımlarını gerçek değerlerle değiştirin
- Database adını `randevu-sistemi` yerine `notesaas` yapın (veya istediğiniz bir isim)
- Şifrede özel karakterler varsa URL encode edin:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`

### 3. Aynı Cluster, Farklı Database

Randevu sistemi ve NoteSaaS aynı MongoDB cluster'ını kullanabilir, sadece database adları farklı olur:
- Randevu sistemi: `randevu-sistemi` database'ini kullanır
- NoteSaaS: `notesaas` database'ini kullanır

Bu şekilde aynı cluster'da iki farklı proje çalışabilir.

### 4. Sunucuyu Yeniden Başlatın

```bash
npm start
```

Console'da şu mesajı görmelisiniz:
```
✅ MongoDB bağlantısı başarılı
🚀 Server http://localhost:5000 adresinde çalışıyor
📡 API: http://localhost:5000/api
```

## ✅ Test

1. **Health Check:**
   ```
   http://localhost:5000/api/health
   ```

2. **Kayıt Ol:**
   ```
   http://localhost:5000/register.html
   ```

3. **Giriş Yap:**
   ```
   http://localhost:5000/login.html
   ```

## 🔒 Güvenlik Notları

- `.env` dosyasını asla Git'e commit etmeyin (zaten .gitignore'da)
- Production'da güçlü bir JWT_SECRET kullanın
- MongoDB Atlas'ta IP whitelist kullanın (production için)

