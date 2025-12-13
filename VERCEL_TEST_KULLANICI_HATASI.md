# 🔐 Vercel'de Test Kullanıcı Hatası Çözümü

## ❌ Sorun

Vercel'de `test@example.com` ile giriş yaparken hata alıyorsunuz.

**Neden:** Test kullanıcısı sadece local MongoDB'de var, production (Vercel) MongoDB'de yok.

---

## ✅ Çözüm 1: Register Sayfasından Kayıt Olun (En Kolay)

### Adımlar:

1. **Vercel URL'inizi açın:**
   ```
   https://your-project.vercel.app/register.html
   ```

2. **Yeni kullanıcı oluşturun:**
   - Email: `test@example.com` (veya istediğiniz email)
   - Şifre: `test123456` (veya istediğiniz şifre)

3. **"Kayıt Ol" butonuna tıklayın**

4. **Login sayfasına yönlendirileceksiniz**

5. **Giriş yapın:**
   - Email: `test@example.com`
   - Şifre: `test123456`

---

## ✅ Çözüm 2: API ile Test Kullanıcısı Oluşturun

### Postman veya Browser Console Kullanarak:

1. **Browser Console'u açın** (F12)

2. **Şu kodu çalıştırın:**
   ```javascript
   fetch('https://your-project.vercel.app/api/auth/register', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       email: 'test@example.com',
       password: 'test123456'
     })
   })
   .then(res => res.json())
   .then(data => console.log('Kullanıcı oluşturuldu:', data))
   .catch(err => console.error('Hata:', err));
   ```

3. **Başarılı olursa:**
   - Login sayfasından giriş yapabilirsiniz

---

## ✅ Çözüm 3: Seed Endpoint'i Oluşturun (Gelişmiş)

Eğer sık sık test kullanıcısı oluşturmanız gerekiyorsa, bir seed endpoint'i ekleyebiliriz.

### backend/routes/auth.js'e ekleyin:

```javascript
// Test kullanıcısı oluşturma endpoint'i (sadece development için)
router.post('/seed-test-user', async (req, res) => {
  // Güvenlik: Sadece development'ta çalışsın
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SEED) {
    return res.status(403).json({ error: 'Bu endpoint production\'da devre dışı' });
  }

  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    
    const testEmail = 'test@example.com';
    const testPassword = 'test123456';

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      return res.json({ 
        message: 'Test kullanıcısı zaten mevcut',
        email: testEmail,
        password: testPassword
      });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);

    // Kullanıcı oluştur
    const user = new User({
      email: testEmail,
      password: hashedPassword,
      plan: 'free'
    });

    await user.save();

    res.json({
      success: true,
      message: 'Test kullanıcısı oluşturuldu',
      email: testEmail,
      password: testPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Kullanım:

```bash
# Browser Console'da:
fetch('https://your-project.vercel.app/api/auth/seed-test-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🎯 Önerilen Çözüm

**En kolay ve güvenli yöntem:** Register sayfasından kayıt olmak.

### Adımlar:

1. **Register sayfasına gidin:**
   ```
   https://your-project.vercel.app/register.html
   ```

2. **Formu doldurun:**
   - Email: `test@example.com`
   - Şifre: `test123456`
   - Şifre Tekrar: `test123456`

3. **"Kayıt Ol" butonuna tıklayın**

4. **Otomatik olarak login sayfasına yönlendirileceksiniz**

5. **Giriş yapın**

---

## 🔍 Hata Kontrolü

### Eğer hala hata alıyorsanız:

1. **Browser Console'u açın** (F12)
2. **Network sekmesine gidin**
3. **Login butonuna tıklayın**
4. **API isteğini kontrol edin:**
   - Status code nedir? (200, 400, 401, 500?)
   - Response mesajı nedir?

### Yaygın Hatalar:

#### 401 Unauthorized
- Email veya şifre yanlış
- Kullanıcı mevcut değil

#### 500 Internal Server Error
- MongoDB bağlantı sorunu
- Environment Variables eksik

#### CORS Hatası
- API URL'i yanlış
- CORS ayarları yanlış

---

## 📝 Test Kullanıcı Bilgileri

**Email:** `test@example.com`  
**Şifre:** `test123456`

**Not:** Bu kullanıcıyı önce register sayfasından oluşturmanız gerekiyor!

---

## 🚀 Hızlı Başlangıç

1. **Register sayfasına gidin:**
   ```
   https://your-project.vercel.app/register.html
   ```

2. **Kayıt olun:**
   - Email: `test@example.com`
   - Şifre: `test123456`

3. **Login yapın:**
   ```
   https://your-project.vercel.app/login.html
   ```

4. **Başarılı! 🎉**

---

**Özet:** Vercel'de test kullanıcısı yoksa, register sayfasından kayıt olarak oluşturabilirsiniz!



