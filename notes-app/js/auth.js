/**
 * Kimlik Doğrulama İşlemleri
 * Bu dosya kullanıcı giriş, kayıt ve oturum yönetimini sağlar
 */

// DOM elementlerini global değişkenlere al
let loginForm, registerForm, resetForm;
let loginBtn, registerBtn, resetBtn;
let loginEmail, loginPassword, registerEmail, registerPassword, registerConfirmPassword, resetEmail;

// Sayfa yüklendiğinde çalışacak fonksiyon
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

/**
 * Auth modülünü başlatır
 */
function initializeAuth() {
    // Supabase kontrolü
    if (typeof window.SupabaseClient === 'undefined') {
        console.error('Supabase client bulunamadı!');
        showNotification('Uygulama başlatılamadı. Lütfen sayfayı yenileyin.', 'error');
        return;
    }

    // DOM elementlerini al
    initializeDOMElements();

    // Form event listener'larını ekle
    setupEventListeners();

    // Oturum kontrolü
    checkSession();

    console.log('✅ Auth modülü başlatıldı');
}

/**
 * DOM elementlerini başlatır
 */
function initializeDOMElements() {
    // Form elementleri
    loginForm = document.getElementById('loginForm');
    registerForm = document.getElementById('registerForm');
    resetForm = document.getElementById('resetForm');

    // Buton elementleri
    loginBtn = document.getElementById('loginBtn');
    registerBtn = document.getElementById('registerBtn');
    resetBtn = document.getElementById('resetBtn');

    // Input elementleri
    loginEmail = document.getElementById('loginEmail');
    loginPassword = document.getElementById('loginPassword');
    registerEmail = document.getElementById('registerEmail');
    registerPassword = document.getElementById('registerPassword');
    registerConfirmPassword = document.getElementById('registerConfirmPassword');
    resetEmail = document.getElementById('resetEmail');
}

/**
 * Event listener'ları kurar
 */
function setupEventListeners() {
    // Form submit eventleri
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordReset);
    }

    // Şifre sıfırlama linki
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', showResetForm);
    }

    // Geri dön linki
    const backToLogin = document.getElementById('backToLogin');
    if (backToLogin) {
        backToLogin.addEventListener('click', showLoginForm);
    }

    // Enter tuşu ile form submit
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const activeForm = document.activeElement.closest('form');
            if (activeForm) {
                activeForm.dispatchEvent(new Event('submit'));
            }
        }
    });
}

/**
 * Oturum durumunu kontrol eder
 */
async function checkSession() {
    try {
        const user = await window.SupabaseClient.getCurrentUser();

        if (user) {
            // Kullanıcı oturum açık, dashboard'a yönlendir
            console.log('✅ Aktif oturum bulundu, dashboard\'a yönlendiriliyor...');
            redirectToDashboard();
        } else {
            console.log('ℹ️ Aktif oturum bulunamadı');
        }
    } catch (error) {
        console.error('Oturum kontrol hatası:', error);
    }
}

/**
 * Kullanıcı giriş işlemini yönetir
 * @param {Event} e - Form submit eventi
 */
async function handleLogin(e) {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    // Validasyon
    if (!validateEmail(email)) {
        showNotification('Geçerli bir e-posta adresi girin', 'error');
        loginEmail.focus();
        return;
    }

    if (!password) {
        showNotification('Şifre gereklidir', 'error');
        loginPassword.focus();
        return;
    }

    // Loading durumu
    setLoading(loginBtn, true);

    try {
        const success = await loginUser(email, password);

        if (success) {
            showNotification('Giriş başarılı! Yönlendiriliyorsunuz...', 'success');
            setTimeout(() => {
                redirectToDashboard();
            }, 1000);
        } else {
            showNotification('Giriş bilgileri hatalı', 'error');
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        showNotification('Giriş yapılırken bir hata oluştu', 'error');
    } finally {
        setLoading(loginBtn, false);
    }
}

/**
 * Kullanıcı kayıt işlemini yönetir
 * @param {Event} e - Form submit eventi
 */
async function handleRegister(e) {
    e.preventDefault();

    const email = registerEmail.value.trim();
    const password = registerPassword.value.trim();
    const confirmPassword = registerConfirmPassword.value.trim();

    // Validasyon
    if (!validateEmail(email)) {
        showNotification('Geçerli bir e-posta adresi girin', 'error');
        registerEmail.focus();
        return;
    }

    if (password.length < 6) {
        showNotification('Şifre en az 6 karakter olmalıdır', 'error');
        registerPassword.focus();
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Şifreler eşleşmiyor', 'error');
        registerConfirmPassword.focus();
        return;
    }

    // Loading durumu
    setLoading(registerBtn, true);

    try {
        const success = await registerUser(email, password);

        if (success) {
            showNotification('Kayıt başarılı! E-posta adresinizi doğrulayın', 'success');
            // Formu temizle
            registerForm.reset();
        } else {
            showNotification('Kayıt işlemi başarısız', 'error');
        }
    } catch (error) {
        console.error('Kayıt hatası:', error);
        showNotification('Kayıt yapılırken bir hata oluştu', 'error');
    } finally {
        setLoading(registerBtn, false);
    }
}

/**
 * Şifre sıfırlama işlemini yönetir
 * @param {Event} e - Form submit eventi
 */
async function handlePasswordReset(e) {
    e.preventDefault();

    const email = resetEmail.value.trim();

    // Validasyon
    if (!validateEmail(email)) {
        showNotification('Geçerli bir e-posta adresi girin', 'error');
        resetEmail.focus();
        return;
    }

    // Loading durumu
    setLoading(resetBtn, true);

    try {
        const success = await resetPassword(email);

        if (success) {
            showNotification('Şifre sıfırlama e-postası gönderildi', 'success');
            // Formu temizle ve giriş formuna dön
            resetForm.reset();
            showLoginForm();
        } else {
            showNotification('Şifre sıfırlama başarısız', 'error');
        }
    } catch (error) {
        console.error('Şifre sıfırlama hatası:', error);
        showNotification('Şifre sıfırlama yapılırken bir hata oluştu', 'error');
    } finally {
        setLoading(resetBtn, false);
    }
}

/**
 * Kullanıcı giriş yapar
 * @param {string} email - Kullanıcı e-postası
 * @param {string} password - Kullanıcı şifresi
 * @returns {boolean} Başarı durumu
 */
async function loginUser(email, password) {
    try {
        const client = window.SupabaseClient.getClient();

        const { data, error } = await client.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            throw error;
        }

        console.log('✅ Kullanıcı giriş yaptı:', data.user.email);
        return true;
    } catch (error) {
        console.error('❌ Giriş hatası:', error.message);
        return false;
    }
}

/**
 * Yeni kullanıcı kaydı yapar
 * @param {string} email - Kullanıcı e-postası
 * @param {string} password - Kullanıcı şifresi
 * @returns {boolean} Başarı durumu
 */
async function registerUser(email, password) {
    try {
        const client = window.SupabaseClient.getClient();

        const { data, error } = await client.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            throw error;
        }

        console.log('✅ Kullanıcı kayıt oldu:', data.user.email);
        return true;
    } catch (error) {
        console.error('❌ Kayıt hatası:', error.message);
        return false;
    }
}

/**
 * Şifre sıfırlama e-postası gönderir
 * @param {string} email - Kullanıcı e-postası
 * @returns {boolean} Başarı durumu
 */
async function resetPassword(email) {
    try {
        const client = window.SupabaseClient.getClient();

        const { error } = await client.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login.html`
        });

        if (error) {
            throw error;
        }

        console.log('✅ Şifre sıfırlama e-postası gönderildi');
        return true;
    } catch (error) {
        console.error('❌ Şifre sıfırlama hatası:', error.message);
        return false;
    }
}

/**
 * E-posta formatını doğrular
 * @param {string} email - Doğrulanacak e-posta
 * @returns {boolean} Geçerli mi?
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Loading durumunu ayarlar
 * @param {HTMLElement} button - Buton elementi
 * @param {boolean} isLoading - Loading durumu
 */
function setLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.loading-spinner');

    if (isLoading) {
        button.disabled = true;
        btnText.style.opacity = '0';
        spinner.style.display = 'block';
    } else {
        button.disabled = false;
        btnText.style.opacity = '1';
        spinner.style.display = 'none';
    }
}

/**
 * Bildirim gösterir
 * @param {string} message - Bildirim mesajı
 * @param {string} type - Bildirim tipi (success, error, warning)
 */
function showNotification(message, type = 'success') {
    // Eğer global showNotification varsa kullan
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }

    // Yoksa basit alert kullan
    alert(message);
}

/**
 * Şifre sıfırlama formunu gösterir
 */
function showResetForm() {
    if (loginForm) loginForm.style.display = 'none';
    if (resetForm) resetForm.style.display = 'block';
}

/**
 * Giriş formunu gösterir
 */
function showLoginForm() {
    if (resetForm) resetForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
}

/**
 * Dashboard sayfasına yönlendirir
 */
function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

// Global değişkenlere ekleme
window.Auth = {
    loginUser: loginUser,
    registerUser: registerUser,
    resetPassword: resetPassword,
    signOut: window.SupabaseClient.signOut,
    getCurrentUser: window.SupabaseClient.getCurrentUser
};



