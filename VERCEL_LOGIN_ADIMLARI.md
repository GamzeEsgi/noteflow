# 🔐 Vercel'de Login Adımları

## ✅ Register İşlemi Tamamlandı

Eğer `test@example.com` ile kayıt olduysanız, şimdi login yapabilirsiniz.

---

## 🚀 Login Adımları

### 1. Login Sayfasına Gidin

```
https://your-project.vercel.app/login.html
```

### 2. Bilgileri Girin

- **Email:** `test@example.com`
- **Şifre:** `test123456`

### 3. "Giriş Yap" Butonuna Tıklayın

### 4. Başarılı Olursa

- Ana sayfaya (`index.html`) yönlendirileceksiniz
- Notlarınızı görebilirsiniz

---

## ❌ Hata Alıyorsanız

### Hata: "Email veya şifre hatalı"

**Çözüm:**
1. Email'in doğru yazıldığından emin olun: `test@example.com`
2. Şifrenin doğru olduğundan emin olun: `test123456`
3. Register işleminin başarılı olduğundan emin olun

### Hata: "Kullanıcı bulunamadı"

**Çözüm:**
1. Register sayfasından tekrar kayıt olun
2. Veya farklı bir email ile kayıt olun

### Hata: "Network Error" veya "CORS Error"

**Çözüm:**
1. Browser Console'u açın (F12)
2. Network sekmesine gidin
3. Login butonuna tıklayın
4. Hata mesajını kontrol edin
5. API URL'inin doğru olduğundan emin olun

---

## 🔍 Browser Console Kontrolü

### 1. Browser Console'u Açın
- `F12` tuşuna basın
- Veya sağ tık → "Inspect" → "Console" sekmesi

### 2. Login Butonuna Tıklayın

### 3. Console'da Hata Var mı Kontrol Edin

**Başarılı Login:**
```javascript
// Console'da göreceksiniz:
Token saved to localStorage
Redirecting to index...
```

**Hata Varsa:**
```javascript
// Console'da göreceksiniz:
Error: Email veya şifre hatalı
// veya
Error: Network request failed
```

---

## 📝 Test Kullanıcı Bilgileri

**Email:** `test@example.com`  
**Şifre:** `test123456`

**Not:** Bu kullanıcıyı register sayfasından oluşturmanız gerekiyor!

---

## 🎯 Hızlı Kontrol Listesi

- [ ] Register işlemi başarılı mı?
- [ ] Email doğru mu? (`test@example.com`)
- [ ] Şifre doğru mu? (`test123456`)
- [ ] Login sayfası açılıyor mu?
- [ ] API URL doğru mu?
- [ ] Browser Console'da hata var mı?

---

## 🚀 Başarılı Login Sonrası

Login başarılı olduğunda:

1. **Token localStorage'a kaydedilir**
2. **Ana sayfaya yönlendirilirsiniz**
3. **Notlarınızı görebilirsiniz**
4. **Yeni not ekleyebilirsiniz**
5. **Notları düzenleyebilir/silebilirsiniz**

---

## 💡 İpuçları

### Token Kontrolü

Browser Console'da:
```javascript
localStorage.getItem('token')
```

Eğer token varsa, login başarılı demektir.

### API Test

Browser Console'da:
```javascript
fetch('https://your-project.vercel.app/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(res => res.json())
.then(data => console.log('Kullanıcı bilgisi:', data));
```

---

**Özet:** Register işlemi tamamlandıysa, login sayfasından giriş yapabilirsiniz!



