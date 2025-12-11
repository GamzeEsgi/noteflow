# 🔗 MongoDB Connection String Alma Rehberi

## ✅ En Kolay Yöntem: MongoDB Atlas'tan Direkt Alın

### Adım 1: MongoDB Atlas'a Giriş Yapın
1. https://cloud.mongodb.com adresine gidin
2. Giriş yapın

### Adım 2: Connection String'i Alın
1. **Clusters** menüsüne gidin (sol menüden)
2. Cluster'ınıza tıklayın (cluster0.1lpagmv)
3. **"Connect"** butonuna tıklayın
4. **"Connect your application"** seçeneğini seçin
5. **Driver**: `Node.js` seçin
6. **Version**: En son versiyonu seçin
7. Connection string'i kopyalayın

### Adım 3: Connection String'i Düzenleyin

Kopyaladığınız string şuna benzer olacak:
```
mongodb+srv://<username>:<password>@cluster0.1lpagmv.mongodb.net/?retryWrites=true&w=majority
```

**Şimdi düzenleyin:**
1. `<username>` yerine: `Gamze` yazın
2. `<password>` yerine: `Gamze.Esgi27` yazın
3. Sonuna database adını ekleyin: `...mongodb.net/notesaas?retryWrites=true&w=majority`

**Örnek tam string:**
```
mongodb+srv://Gamze:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/notesaas?retryWrites=true&w=majority
```

### Adım 4: .env Dosyasına Ekleyin

`.env` dosyasını açın ve şu şekilde güncelleyin:

```env
MONGODB_URI=mongodb+srv://Gamze:Gamze.Esgi27@cluster0.1lpagmv.mongodb.net/notesaas?retryWrites=true&w=majority
JWT_SECRET=notesaas-super-secret-jwt-key-change-in-production-2024
PORT=5000
```

### Adım 5: Sunucuyu Yeniden Başlatın

```bash
npm start
```

Console'da şunu görmelisiniz:
```
✅ MongoDB bağlantısı başarılı
```

## ⚠️ Önemli Notlar

1. **Kullanıcı Adı**: MongoDB Atlas'ta oluşturduğunuz kullanıcı adı (Gamze)
2. **Şifre**: MongoDB Atlas'ta oluşturduğunuz şifre (Gamze.Esgi27)
3. **Database Adı**: `notesaas` (otomatik oluşturulur)
4. **Network Access**: IP whitelist'te `0.0.0.0/0` olmalı

## 🐛 Hala Hata Alıyorsanız

1. MongoDB Atlas → **Database Access** → Kullanıcıyı kontrol edin
2. MongoDB Atlas → **Network Access** → IP adresinizi kontrol edin
3. Connection string'deki kullanıcı adı ve şifrenin doğru olduğundan emin olun

