# 🔧 MongoDB 500 Hatası Çözümü

## ❌ Hata: 500 Internal Server Error (Kayıt Olurken)

Bu hata genellikle **MongoDB bağlantı sorunu** nedeniyle oluşur.

## 🔍 Sorunun Nedenleri

1. **MongoDB kullanıcısı oluşturulmamış**
2. **Kullanıcı adı veya şifre yanlış**
3. **IP whitelist'te IP adresiniz yok**
4. **Connection string yanlış**

## ✅ Çözüm Adımları

### 1. MongoDB Atlas'ta Kullanıcı Oluşturun

1. **MongoDB Atlas'a giriş yapın**: https://cloud.mongodb.com
2. **Database Access** menüsüne gidin (sol menüden)
3. **"Add New Database User"** butonuna tıklayın
4. Bilgileri girin:
   - **Username**: `gamze`
   - **Password**: `Gamze.Esgi27` (veya istediğiniz bir şifre)
   - **Database User Privileges**: "Read and write to any database"
5. **"Add User"** butonuna tıklayın

### 2. Network Access (IP İzinleri)

1. **Network Access** menüsüne gidin
2. **"Add IP Address"** butonuna tıklayın
3. Geliştirme için: `0.0.0.0/0` yazın (tüm IP'lere izin)
4. **"Confirm"** tıklayın

### 3. .env Dosyasını Kontrol Edin

Proje kök dizinindeki `.env` dosyasını açın ve şu şekilde olmalı:

```env
MONGODB_URI=mongodb+srv://gamze:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/notesaas?retryWrites=true&w=majority
JWT_SECRET=notesaas-super-secret-jwt-key-change-in-production-2024
PORT=5000
```

**ÖNEMLİ**: 
- Eğer şifrenizde özel karakterler varsa URL encode edin:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`

### 4. Sunucuyu Yeniden Başlatın

```bash
npm start
```

Console'da şu mesajı görmelisiniz:
```
✅ MongoDB bağlantısı başarılı
🚀 Server http://localhost:5000 adresinde çalışıyor
```

### 5. Test Edin

1. **Kayıt Ol**: http://localhost:5000/register.html
2. E-posta ve şifre girin
3. Başarılı olmalı!

## 🐛 Hata Devam Ediyorsa

### Terminal'de Hata Mesajını Kontrol Edin

Sunucuyu çalıştırdığınız terminal'de şu hatalardan birini görebilirsiniz:

- `bad auth : authentication failed` → Kullanıcı adı/şifre yanlış
- `IP not whitelisted` → IP adresiniz whitelist'te yok
- `connection timeout` → Network sorunu

### Connection String Formatı

Doğru format:
```
mongodb+srv://KULLANICI_ADI:ŞİFRE@cluster0.1lpagmv.mongodb.net/notesaas?retryWrites=true&w=majority
```

Yanlış format örnekleri:
- `mongodb+srv://<username>:<password>@...` (placeholder'lar değiştirilmemiş)
- `mongodb://localhost:27017/...` (yerel MongoDB, Atlas değil)

## 📝 Notlar

- MongoDB Atlas'ta kullanıcı oluşturduktan sonra birkaç dakika beklemeniz gerekebilir
- Şifre değiştirdiyseniz, .env dosyasını güncellemeyi unutmayın
- Production'da IP whitelist kullanın (0.0.0.0/0 kullanmayın)

