# 🔐 Test Kullanıcısı Oluşturma

## ❌ Hata

```
POST https://noteflow-app-pearl.vercel.app/api/auth/login 400 (Bad Request)
```

**Neden:** Kullanıcı kayıtlı değil!

---

## ✅ Çözüm: Test Kullanıcısı Oluşturun

### Adım 1: Browser Console'u Açın

1. **F12** tuşuna basın (veya sağ tık → "Inspect")
2. **Console** sekmesine tıklayın

### Adım 2: Test Kullanıcısı Oluşturun

Console'da şu kodu yazın ve **Enter** tuşuna basın:

```javascript
fetch('https://noteflow-app-pearl.vercel.app/api/auth/create-test-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Test kullanıcısı:', data);
  alert('✅ Test kullanıcısı oluşturuldu!\n\nEmail: test@example.com\nŞifre: test123456');
})
.catch(err => {
  console.error('❌ Hata:', err);
  alert('Hata: ' + err.message);
});
```

### Adım 3: Login Yapın

**Login sayfasında:**
- Email: `test@example.com`
- Şifre: `test123456`

---

## 📋 Test Kullanıcı Bilgileri

**Email:** `test@example.com`  
**Şifre:** `test123456`

---

## 🧪 Alternatif: Register Sayfasından Kayıt Olun

1. **Register sayfasına gidin:**
   ```
   https://noteflow-app-pearl.vercel.app/register.html
   ```

2. **Formu doldurun:**
   - Email: `test@example.com`
   - Şifre: `test123456`
   - Şifre Tekrar: `test123456`

3. **"Kayıt Ol" butonuna tıklayın**

4. **Otomatik olarak login sayfasına yönlendirileceksiniz**

5. **Giriş yapın**

---

## 🔍 Browser Console'da Hata Kontrolü

1. **F12** tuşuna basın
2. **Network** sekmesine gidin
3. **Login butonuna tıklayın**
4. **`/api/auth/login`** isteğini bulun
5. **Response** sekmesine tıklayın
6. **Hata mesajını okuyun**

**Olası mesajlar:**
- `"Invalid credentials"` → Kullanıcı kayıtlı değil
- `"Please provide email and password"` → Form boş

---

## ✅ Hızlı Test

**Browser Console'da (F12):**

```javascript
// 1. Test kullanıcısı oluştur
fetch('https://noteflow-app-pearl.vercel.app/api/auth/create-test-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Test kullanıcısı:', data);
  alert('✅ Test kullanıcısı oluşturuldu!\nEmail: test@example.com\nŞifre: test123456');
})
.catch(err => console.error('❌ Hata:', err));

// 2. Login test
fetch('https://noteflow-app-pearl.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123456'
  })
})
.then(res => res.json())
.then(data => {
  if (data.token) {
    console.log('✅ Login başarılı!');
    localStorage.setItem('token', data.token);
    alert('✅ Login başarılı!');
  } else {
    console.error('❌ Login başarısız:', data.message);
  }
})
.catch(err => console.error('❌ Hata:', err));
```

---

## 📝 Özet

1. **Browser Console'u açın** (F12)
2. **Test kullanıcısı oluşturun** (yukarıdaki kod)
3. **Login yapın** (`test@example.com` / `test123456`)

---

**Not:** 400 hatası kullanıcının kayıtlı olmadığını gösterir. Test kullanıcısı oluşturduktan sonra login yapabilirsiniz!



