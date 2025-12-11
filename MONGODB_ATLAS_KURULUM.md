# 🗄️ MongoDB Atlas Cluster Oluşturma Rehberi

## 📋 Adım Adım Kurulum

### 1. MongoDB Atlas Hesabı Oluşturma

1. **MongoDB Atlas'a gidin**: https://www.mongodb.com/cloud/atlas
2. **"Try Free"** veya **"Sign Up"** butonuna tıklayın
3. Email, şifre ve kullanıcı adı ile hesap oluşturun
4. Email doğrulamasını yapın

### 2. Cluster Oluşturma

1. **Giriş yaptıktan sonra** "Build a Database" butonuna tıklayın
2. **Free (M0) tier'ı seçin** (ücretsiz)
3. **Cloud Provider seçin**: AWS, Google Cloud veya Azure (AWS önerilir)
4. **Region seçin**: Size en yakın bölgeyi seçin (örn: `eu-central-1` - Frankfurt)
5. **Cluster Name**: İstediğiniz bir isim verin (örn: `Cluster0`)
6. **"Create"** butonuna tıklayın
7. Cluster oluşturma işlemi 3-5 dakika sürebilir

### 3. Database Kullanıcısı Oluşturma

1. **"Database Access"** menüsüne gidin (sol menüden)
2. **"Add New Database User"** butonuna tıklayın
3. **Authentication Method**: "Password" seçin
4. **Username**: Bir kullanıcı adı girin (örn: `notesaas_user`)
5. **Password**: Güçlü bir şifre oluşturun
   - **ÖNEMLİ**: Bu şifreyi kaydedin, bir daha göremeyeceksiniz!
6. **Database User Privileges**: "Read and write to any database" seçin
7. **"Add User"** butonuna tıklayın

### 4. Network Access (IP Whitelist) Ayarlama

1. **"Network Access"** menüsüne gidin (sol menüden)
2. **"Add IP Address"** butonuna tıklayın
3. **İki seçenek var**:
   
   **Seçenek 1: Tüm IP'lere İzin Ver (Geliştirme için)**
   - `0.0.0.0/0` yazın ve "Confirm" tıklayın
   - ⚠️ **Güvenlik Uyarısı**: Production'da kullanmayın!
   
   **Seçenek 2: Sadece Kendi IP'nize İzin Ver (Önerilen)**
   - "Add Current IP Address" butonuna tıklayın
   - Veya manuel olarak IP adresinizi girin
   - "Confirm" tıklayın

### 5. Connection String Alma

1. **"Database"** menüsüne gidin (sol menüden)
2. **"Connect"** butonuna tıklayın
3. **"Connect your application"** seçeneğini seçin
4. **Driver**: `Node.js` seçin
5. **Version**: En son versiyonu seçin (4.1 veya üzeri)
6. **Connection string'i kopyalayın**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Connection String'i Düzenleme

Kopyaladığınız connection string'de:

1. `<username>` yerine oluşturduğunuz database kullanıcı adını yazın
2. `<password>` yerine oluşturduğunuz şifreyi yazın
3. Sonuna database adını ekleyin: `...mongodb.net/notesaas?retryWrites=true&w=majority`

**Örnek tam connection string:**
```
mongodb+srv://notesaas_user:MySecurePassword123@cluster0.abc123.mongodb.net/notesaas?retryWrites=true&w=majority
```

### 7. .env Dosyasına Ekleme

Projenizin kök dizinindeki `.env` dosyasını açın ve şu şekilde güncelleyin:

```env
MONGODB_URI=mongodb+srv://notesaas_user:MySecurePassword123@cluster0.abc123.mongodb.net/notesaas?retryWrites=true&w=majority
JWT_SECRET=notesaas-super-secret-jwt-key-change-in-production-2024
PORT=5000
```

**ÖNEMLİ**: 
- Şifrelerde özel karakterler varsa URL encode edin:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

### 8. Bağlantıyı Test Etme

Sunucuyu yeniden başlatın:
```bash
npm start
```

Console'da şu mesajı görmelisiniz:
```
MongoDB Connected
Server running on port 5000
```

## 🔒 Güvenlik İpuçları

1. **Production'da**:
   - IP whitelist kullanın (0.0.0.0/0 kullanmayın)
   - Güçlü şifreler kullanın
   - JWT_SECRET'i güçlü bir random string yapın
   - Environment variables'ı asla commit etmeyin

2. **Şifre Özel Karakterler İçeriyorsa**:
   - MongoDB Atlas'ta şifre oluştururken özel karakterlerden kaçının
   - Veya URL encode edin

## ❓ Sık Karşılaşılan Sorunlar

### "Authentication failed" hatası
- Kullanıcı adı veya şifreyi kontrol edin
- Özel karakterleri URL encode edin

### "IP not whitelisted" hatası
- Network Access'te IP'nizi eklediğinizden emin olun
- Geliştirme için 0.0.0.0/0 kullanabilirsiniz

### "Connection timeout" hatası
- Cluster'ın oluşturulmasını bekleyin (3-5 dakika)
- Region'ı kontrol edin
- Firewall ayarlarınızı kontrol edin

## 📚 Ek Kaynaklar

- [MongoDB Atlas Dokümantasyonu](https://docs.atlas.mongodb.com/)
- [MongoDB Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)

