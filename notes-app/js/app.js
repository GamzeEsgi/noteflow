/**
 * Ana Uygulama Modülü
 * Bu dosya genel uygulama fonksiyonlarını ve yardımcı fonksiyonları içerir
 */

// Global değişkenler
let currentTheme = 'light';
let notifications = [];

/**
 * Uygulamayı başlatır
 */
function initializeApp() {
    setupGlobalErrorHandling();
    setupNotifications();
    setupResponsiveFeatures();

    console.log('✅ Ana uygulama başlatıldı');
}

/**
 * Global hata yakalama kurar
 */
function setupGlobalErrorHandling() {
    // JavaScript hatalarını yakala
    window.addEventListener('error', function(e) {
        console.error('JavaScript hatası:', e.error);
        showNotification('Bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
    });

    // Promise hatalarını yakala
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promise hatası:', e.reason);
        showNotification('Bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
    });

    // Console hatalarını override et (geliştirme için)
    if (window.location.hostname === 'localhost') {
        const originalError = console.error;
        console.error = function(...args) {
            originalError.apply(console, args);
            // Geliştirme ortamında hataları göster
            if (args[0] && typeof args[0] === 'string' && args[0].includes('Error')) {
                showNotification('Console hatası: ' + args[0], 'warning');
            }
        };
    }
}

/**
 * Bildirim sistemini kurar
 */
function setupNotifications() {
    // Bildirim container'ını oluştur
    if (!document.getElementById('notification')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification';
        notificationContainer.className = 'notification';
        notificationContainer.style.display = 'none';
        document.body.appendChild(notificationContainer);
    }

    console.log('✅ Bildirim sistemi hazır');
}

/**
 * Responsive özelliklerini kurar
 */
function setupResponsiveFeatures() {
    // Mobil menü toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('show');
            }
        });
    }

    // Mobil overlay
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        // Sidebar dışına tıklandığında kapat
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !e.target.closest('#sidebarToggle')) {
                    sidebar.classList.remove('show');
                }
            }
        });
    }

    // Viewport height fix (iOS Safari için)
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    console.log('✅ Responsive özellikler aktif');
}

/**
 * Bildirim gösterir
 * @param {string} message - Bildirim mesajı
 * @param {string} type - Bildirim tipi (success, error, warning, info)
 * @param {number} duration - Gösterim süresi (ms)
 */
function showNotification(message, type = 'success', duration = 4000) {
    const notificationEl = document.getElementById('notification');
    if (!notificationEl) {
        console.warn('Bildirim elementi bulunamadı');
        return;
    }

    // Önceki bildirimleri temizle
    clearTimeout(notificationEl.timeoutId);

    // HTML oluştur
    notificationEl.innerHTML = `
        <div class="notification-content ${type}">
            <span id="notificationText">${message}</span>
        </div>
    `;

    // Göster
    notificationEl.style.display = 'block';

    // Auto-hide
    notificationEl.timeoutId = setTimeout(() => {
        hideNotification();
    }, duration);

    // Konsola logla
    console.log(`📢 Bildirim (${type}):`, message);
}

/**
 * Bildirimi gizler
 */
function hideNotification() {
    const notificationEl = document.getElementById('notification');
    if (notificationEl) {
        notificationEl.style.display = 'none';
    }
}

/**
 * Loading overlay gösterir/gizler
 * @param {boolean} show - Göster/gizle
 * @param {string} message - Loading mesajı
 */
function showLoadingOverlay(show = true, message = 'Yükleniyor...') {
    let overlay = document.getElementById('loadingOverlay');

    if (show) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    } else {
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
}

/**
 * Modal gösterir
 * @param {string} modalId - Modal ID'si
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Scroll'u engelle

        // ESC ile kapatma
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                hideModal(modalId);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Overlay tıklaması ile kapatma
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal(modalId);
            }
        });
    }
}

/**
 * Modal gizler
 * @param {string} modalId - Modal ID'si
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Scroll'u geri aç
    }
}

/**
 * Tüm modal'ları gizler
 */
function hideAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

/**
 * Form verilerini object'e çevirir
 * @param {HTMLFormElement} form - Form elementi
 * @returns {Object} Form verileri
 */
function getFormData(form) {
    const data = {};
    const formData = new FormData(form);

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    return data;
}

/**
 * Form'u temizler
 * @param {HTMLFormElement} form - Form elementi
 */
function clearForm(form) {
    form.reset();

    // Özel input tipleri için
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
}

/**
 * Elemente animasyon ekler
 * @param {HTMLElement} element - Animasyon eklenecek element
 * @param {string} animation - Animasyon sınıfı
 * @param {number} duration - Animasyon süresi (ms)
 */
function animateElement(element, animation = 'fade-in', duration = 300) {
    element.style.animation = `${animation} ${duration}ms ease forwards`;

    return new Promise(resolve => {
        setTimeout(() => {
            element.style.animation = '';
            resolve();
        }, duration);
    });
}

/**
 * Debounce fonksiyonu
 * @param {Function} func - Debounce edilecek fonksiyon
 * @param {number} wait - Bekleme süresi (ms)
 * @returns {Function} Debounce edilmiş fonksiyon
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle fonksiyonu
 * @param {Function} func - Throttle edilecek fonksiyon
 * @param {number} limit - Limit süresi (ms)
 * @returns {Function} Throttle edilmiş fonksiyon
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * LocalStorage'a güvenli veri yazar
 * @param {string} key - Anahtar
 * @param {any} value - Değer
 */
function setStorageItem(key, value) {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error('LocalStorage yazma hatası:', error);
    }
}

/**
 * LocalStorage'dan güvenli veri okur
 * @param {string} key - Anahtar
 * @param {any} defaultValue - Varsayılan değer
 * @returns {any} Okunan değer
 */
function getStorageItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('LocalStorage okuma hatası:', error);
        return defaultValue;
    }
}

/**
 * URL parametrelerini alır
 * @param {string} param - Parametre adı
 * @returns {string|null} Parametre değeri
 */
function getURLParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * URL'e parametre ekler
 * @param {string} param - Parametre adı
 * @param {string} value - Parametre değeri
 */
function setURLParameter(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
}

/**
 * URL parametresini siler
 * @param {string} param - Parametre adı
 */
function removeURLParameter(param) {
    const url = new URL(window.location);
    url.searchParams.delete(param);
    window.history.replaceState({}, '', url);
}

/**
 * Copy to clipboard
 * @param {string} text - Kopyalanacak metin
 * @returns {Promise<boolean>} Başarı durumu
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Metin panoya kopyalandı', 'success');
        return true;
    } catch (error) {
        console.error('Clipboard hatası:', error);

        // Fallback: Eski yöntem
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Metin panoya kopyalandı', 'success');
            return true;
        } catch (fallbackError) {
            console.error('Fallback clipboard hatası:', fallbackError);
            showNotification('Metin kopyalanamadı', 'error');
            return false;
        }
    }
}

/**
 * Dosya indirme fonksiyonu
 * @param {string} content - Dosya içeriği
 * @param {string} filename - Dosya adı
 * @param {string} mimeType - MIME tipi
 */
function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

/**
 * JSON dosyası indir
 * @param {Object} data - JSON veri
 * @param {string} filename - Dosya adı
 */
function downloadJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, filename, 'application/json');
}

/**
 * Sayfayı yeniler
 * @param {boolean} force - Cache'i bypass et
 */
function refreshPage(force = false) {
    if (force) {
        window.location.reload(true);
    } else {
        window.location.reload();
    }
}

/**
 * Sayfa başlığını günceller
 * @param {string} title - Yeni başlık
 */
function setPageTitle(title) {
    document.title = title;
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.textContent = title;
    }
}

/**
 * Kullanıcı ajanı bilgilerini alır
 * @returns {Object} Tarayıcı bilgileri
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    const browser = {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        isIOS: /iPad|iPhone|iPod/.test(ua),
        isAndroid: /Android/.test(ua),
        isSafari: /^((?!chrome|android).)*safari/i.test(ua),
        isChrome: /Chrome/.test(ua),
        isFirefox: /Firefox/.test(ua),
        isEdge: /Edge/.test(ua)
    };

    return {
        userAgent: ua,
        ...browser,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
    };
}

/**
 * Performans ölçümü
 * @param {string} name - Ölçüm adı
 * @param {Function} fn - Ölçülecek fonksiyon
 * @returns {any} Fonksiyon sonucu
 */
async function measurePerformance(name, fn) {
    const start = performance.now();
    try {
        const result = await fn();
        const end = performance.now();
        console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    } catch (error) {
        const end = performance.now();
        console.error(`❌ ${name} hatası (${(end - start).toFixed(2)}ms):`, error);
        throw error;
    }
}

/**
 * Service Worker kaydı (PWA için)
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker kaydedildi:', registration.scope);
        } catch (error) {
            console.error('❌ Service Worker kayıt hatası:', error);
        }
    }
}

/**
 * PWA kurulum prompt'u
 */
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Kurulum butonu göster
    showInstallPrompt();
});

function showInstallPrompt() {
    if (deferredPrompt) {
        // Özel kurulum UI göster
        showNotification('Uygulamayı yüklemek için tarayıcı menüsüne bakın', 'info');
    }
}

/**
 * Uygulamayı yükle
 */
async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA kurulum sonucu: ${outcome}`);
        deferredPrompt = null;
    }
}

/**
 * Sayfa görünürlüğü değiştiğinde
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('📱 Sayfa arka plana geçti');
    } else {
        console.log('📱 Sayfa öne geldi');
        // Sayfa öne geldiğinde gerekli güncellemeleri yap
        if (typeof window.Notes !== 'undefined') {
            window.Notes.loadNotes();
        }
    }
});

/**
 * Online/offline durumunu izle
 */
window.addEventListener('online', function() {
    console.log('🌐 Online mod');
    showNotification('İnternet bağlantısı geri geldi', 'success');
});

window.addEventListener('offline', function() {
    console.log('🌐 Offline mod');
    showNotification('İnternet bağlantısı kesildi', 'warning');
});

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', initializeApp);

// Global değişkenlere ekleme
window.App = {
    showNotification: showNotification,
    hideNotification: hideNotification,
    showLoadingOverlay: showLoadingOverlay,
    showModal: showModal,
    hideModal: hideModal,
    hideAllModals: hideAllModals,
    getFormData: getFormData,
    clearForm: clearForm,
    animateElement: animateElement,
    debounce: debounce,
    throttle: throttle,
    setStorageItem: setStorageItem,
    getStorageItem: getStorageItem,
    getURLParameter: getURLParameter,
    setURLParameter: setURLParameter,
    removeURLParameter: removeURLParameter,
    copyToClipboard: copyToClipboard,
    downloadFile: downloadFile,
    downloadJSON: downloadJSON,
    refreshPage: refreshPage,
    setPageTitle: setPageTitle,
    getBrowserInfo: getBrowserInfo,
    measurePerformance: measurePerformance,
    registerServiceWorker: registerServiceWorker,
    installApp: installApp
};



