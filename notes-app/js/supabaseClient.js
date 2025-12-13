/**
 * Supabase Client Yapılandırması
 * Bu dosya Supabase bağlantısı ve temel veritabanı işlemlerini yönetir
 */

// Supabase konfigürasyonu
// NOT: Bu değerleri kendi Supabase projenizden alın
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Supabase client oluşturma
let supabaseClient = null;

/**
 * Supabase client'ı başlatır
 * @returns {Object} Supabase client instance
 */
function initializeSupabase() {
    try {
        // Supabase JS SDK kontrolü
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase JS SDK bulunamadı. Lütfen sayfaya supabase-js script\'ini ekleyin.');
        }

        // Client oluşturma
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        console.log('✅ Supabase client başarıyla başlatıldı');
        return supabaseClient;
    } catch (error) {
        console.error('❌ Supabase client başlatma hatası:', error);
        throw error;
    }
}

/**
 * Supabase client'ı döndürür (lazy initialization)
 * @returns {Object} Supabase client instance
 */
function getSupabaseClient() {
    if (!supabaseClient) {
        supabaseClient = initializeSupabase();
    }
    return supabaseClient;
}

/**
 * Veritabanı tablolarını oluşturmak için SQL komutları
 * Bu komutları Supabase SQL Editor'da çalıştırın
 */
const DATABASE_SCHEMA = `
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
`;

/**
 * Kullanıcı oturum durumunu kontrol eder
 * @returns {Object|null} Kullanıcı bilgileri veya null
 */
async function getCurrentUser() {
    try {
        const client = getSupabaseClient();
        const { data: { user }, error } = await client.auth.getUser();

        if (error) {
            console.warn('Oturum kontrol hatası:', error.message);
            return null;
        }

        return user;
    } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error);
        return null;
    }
}

/**
 * Kullanıcı oturumunu sonlandırır
 * @returns {boolean} Başarı durumu
 */
async function signOut() {
    try {
        const client = getSupabaseClient();
        const { error } = await client.auth.signOut();

        if (error) {
            throw error;
        }

        console.log('✅ Kullanıcı başarıyla çıkış yaptı');
        return true;
    } catch (error) {
        console.error('❌ Çıkış hatası:', error);
        return false;
    }
}

/**
 * Supabase bağlantısını test eder
 * @returns {boolean} Bağlantı durumu
 */
async function testConnection() {
    try {
        const client = getSupabaseClient();
        const { data, error } = await client.from('notes').select('count').limit(1);

        if (error) {
            throw error;
        }

        console.log('✅ Supabase bağlantısı başarılı');
        return true;
    } catch (error) {
        console.error('❌ Supabase bağlantı hatası:', error);
        return false;
    }
}

// Global değişkenlere ekleme (diğer modüllerin kullanımına)
window.SupabaseClient = {
    getClient: getSupabaseClient,
    getCurrentUser: getCurrentUser,
    signOut: signOut,
    testConnection: testConnection,
    DATABASE_SCHEMA: DATABASE_SCHEMA
};



