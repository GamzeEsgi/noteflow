# 📦 GitHub Repository Kurulumu - NoteFlow

## 🚀 Hızlı Başlangıç

### 1. Yeni GitHub Repository Oluştur

1. [GitHub](https://github.com) hesabınıza giriş yapın
2. Sağ üstteki **"+"** butonuna tıklayın → **"New repository"**
3. Repository bilgilerini doldurun:
   - **Repository name:** `noteflow` (veya istediğiniz isim)
   - **Description:** `Modern not tutma SaaS uygulaması - NoteFlow`
   - **Visibility:** Public veya Private seçin
   - ⚠️ **"Initialize with README" seçmeyin** (zaten README var)

4. **"Create repository"** butonuna tıklayın

### 2. Local Repository'yi GitHub'a Bağla

Terminal/PowerShell'de proje dizinine gidin ve şu komutları çalıştırın:

```bash
# Proje dizinine git
cd c:\projeler

# Mevcut remote'u kontrol et
git remote -v

# Eğer farklı bir projeye bağlıysa, remote'u kaldır
git remote remove origin

# Yeni GitHub repository'nizi ekle
# KULLANICI_ADI yerine GitHub kullanıcı adınızı yazın
git remote add origin https://github.com/KULLANICI_ADI/noteflow.git

# Branch'i main olarak ayarla (zaten main ise gerek yok)
git branch -M main

# Tüm değişiklikleri GitHub'a push et
git push -u origin main
```

### 3. GitHub Authentication

Eğer push sırasında authentication hatası alırsanız:

#### Yöntem 1: Personal Access Token (Önerilen)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" tıklayın
3. Token'a bir isim verin (örn: "noteflow-deployment")
4. **repo** scope'unu seçin
5. Token'ı kopyalayın (bir daha gösterilmeyecek!)
6. Push yaparken şifre yerine bu token'ı kullanın

#### Yöntem 2: GitHub CLI

```bash
# GitHub CLI yükle (eğer yoksa)
winget install GitHub.cli

# GitHub'a login ol
gh auth login

# Push yap
git push -u origin main
```

### 4. Repository'yi Kontrol Et

1. GitHub'da repository'nizi açın
2. Tüm dosyaların yüklendiğini kontrol edin:
   - ✅ `frontend/` klasörü
   - ✅ `backend/` klasörü
   - ✅ `package.json`
   - ✅ `vercel.json`
   - ✅ `README.md`

### 5. Vercel'e Bağla

1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. "Add New Project" → GitHub repository'nizi seçin
3. `VERCEL_DEPLOYMENT.md` dosyasındaki adımları takip edin

## 📝 Önemli Notlar

### .env Dosyası
- `.env` dosyası **Git'e commit edilmemeli** (`.gitignore`'da zaten var)
- Vercel'de Environment Variables olarak ekleyeceksiniz

### .gitignore Kontrolü
Aşağıdaki dosyalar Git'e eklenmemeli:
- `node_modules/`
- `.env`
- `.vercel/`
- `*.log`

### Commit Mesajları
Proje zaten commit edilmiş durumda. Yeni değişiklikler için:

```bash
git add .
git commit -m "feat: yeni özellik açıklaması"
git push
```

## 🎉 Başarılı!

Repository'niz GitHub'da hazır. Şimdi Vercel deployment'a geçebilirsiniz!



