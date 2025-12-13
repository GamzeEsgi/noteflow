# 📝 Not Tutma Web Uygulaması

Ücretsiz, SaaS tabanlı not tutma uygulaması. iPhone, iPad ve tüm cihazlarda çalışır. Supabase veritabanı kullanır, Expo ile mobil uygulamaya dönüştürülebilir.

## ✨ Özellikler

- 🔐 **Kullanıcı Sistemi**: E-posta/şifre ile kayıt ve giriş
- 📝 **Zengin Not Editörü**: Markdown destekli, otomatik kaydetme
- 🌙 **Karanlık/Aydınlık Tema**: Sistem tercihini algılar
- 📱 **Responsive Tasarım**: iPhone, iPad, Desktop uyumlu
- ☁️ **Bulut Senkronizasyon**: Tüm cihazlarda aynı notlar
- 🚀 **Expo Hazır**: Mobil uygulama geliştirmeye uygun API

## 🛠️ Teknoloji Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Modern CSS (Flexbox, Grid, CSS Variables)
- **Icons**: Emoji + CSS
- **Mobile**: Responsive Design + Touch Events

## 🚀 Kurulum

### 1. Supabase Kurulumu

1. [Supabase](https://supabase.com) hesabınıza giriş yapın
2. Yeni proje oluşturun
3. **Settings > API** bölümünden şu bilgileri alın:
   - `Project URL`
   - `anon public` key

### 2. Veritabanı Tablolarını Oluşturun

Supabase SQL Editor'da aşağıdaki kodu çalıştırın:

```sql
-- profiles tablosu (kullanıcı bilgileri için)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  plan text default 'free' check (plan in ('free', 'premium')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- profiles tablosu için RLS (Row Level Security) etkinleştirme
alter table public.profiles enable row level security;

-- profiles için güvenlik politikaları
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- notes tablosu (notlar için)
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- notes tablosu için index (performans için)
create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_created_at_idx on public.notes(created_at desc);

-- notes için RLS etkinleştirme
alter table public.notes enable row level security;

-- notes için güvenlik politikaları
create policy "Users can view own notes" on public.notes
  for select using (auth.uid() = user_id);

create policy "Users can insert own notes" on public.notes
  for insert with check (auth.uid() = user_id);

create policy "Users can update own notes" on public.notes
  for update using (auth.uid() = user_id);

create policy "Users can delete own notes" on public.notes
  for delete using (auth.uid() = user_id);

-- Profil oluşturma trigger fonksiyonu
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger oluşturma (yeni kullanıcı kayıt olduğunda profil oluştur)
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 3. Uygulama Konfigürasyonu

`js/supabaseClient.js` dosyasını açın ve şu bilgileri güncelleyin:

```javascript
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 4. Uygulamayı Çalıştırın

Proje dosyalarını herhangi bir web sunucusunda yayınlayın:

- **Local Geliştirme**: `python -m http.server 8080`
- **Vercel Deploy**: Dosyaları GitHub'a yükleyin ve Vercel'e bağlayın
- **Netlify**: Dosyaları sürükle-bırak ile yükleyin

## 📁 Proje Yapısı

```
notes-app/
├── public/
│   ├── index.html          # Ana sayfa
│   ├── login.html          # Giriş sayfası
│   ├── register.html       # Kayıt sayfası
│   ├── dashboard.html      # Dashboard
│   └── styles.css          # Ana CSS dosyası
├── js/
│   ├── supabaseClient.js   # Supabase bağlantısı
│   ├── auth.js             # Kimlik doğrulama
│   ├── notes.js            # Not işlemleri
│   └── app.js              # Genel uygulama fonksiyonları
├── assets/
│   ├── logo.svg            # Logo dosyası
│   └── icons/              # İkonlar
└── README.md               # Bu dosya
```

## 🎯 Kullanım

### Kullanıcı İşlemleri

1. **Kayıt**: `register.html` - E-posta ve şifre ile hesap oluşturun
2. **Giriş**: `login.html` - Hesabınıza giriş yapın
3. **Şifre Sıfırlama**: Giriş sayfasında "Şifremi unuttum" linkine tıklayın

### Not İşlemleri

1. **Yeni Not**: Dashboard'da "Yeni Not" butonuna tıklayın
2. **Düzenleme**: Not kartına tıklayarak düzenleyin
3. **Silme**: Not kartındaki çöp kutusu ikonuna tıklayın
4. **Arama**: Üst kısımdaki arama kutusunu kullanın

### Tema Değiştirme

- Dashboard'da sağ üstteki tema butonuna tıklayın
- Ayarlar bölümünden tercihlerinizi kaydedin

## 🔧 API Yapısı (Expo İçin)

Uygulama aşağıdaki RESTful API endpoint'lerini kullanır:

### Kimlik Doğrulama
- `POST /auth/signup` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/logout` - Çıkış

### Not İşlemleri
- `GET /notes` - Kullanıcının notlarını listele
- `POST /notes` - Yeni not oluştur
- `PATCH /notes/:id` - Not güncelle
- `DELETE /notes/:id` - Not sil

### Örnek Expo/React Native Kullanımı

```javascript
// Supabase client kurulumu
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Kullanıcı girişi
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Notları listele
const { data: notes, error } = await supabase
  .from('notes')
  .select('*')
  .order('created_at', { ascending: false })
```

## 🚀 Vercel'de Yayınlama

1. **GitHub Repository**: Kodları GitHub'a yükleyin
2. **Vercel Hesabı**: [vercel.com](https://vercel.com) hesabınıza giriş yapın
3. **Proje Bağlama**: GitHub repository'nizi bağlayın
4. **Environment Variables**: Supabase bilgilerini ekleyin:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. **Deploy**: Otomatik deploy başlayacak

## 🔒 Güvenlik

- **Row Level Security (RLS)**: Supabase'de etkin
- **JWT Tokens**: Oturum yönetimi için
- **HTTPS**: Üretim ortamında zorunlu
- **Input Validation**: Client-side validation
- **SQL Injection Protection**: Supabase ORM ile

## 📱 Mobil Uyumluluk

- **iOS Safari**: Full destek
- **Chrome Mobile**: Full destek
- **Touch Events**: Mobil cihazlar için optimize
- **Responsive Images**: Tüm ekran boyutlarında net

## 🐛 Bilinen Sorunlar

- Safari'de bazı CSS animasyonları çalışmayabilir
- Offline modda sınırlı işlevsellik

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya [email] adresinden iletişime geçebilirsiniz.

---

**Geliştirici**: Not Tutma Web Uygulaması Projesi 🚀



