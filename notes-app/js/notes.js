/**
 * Not İşlemleri Modülü
 * Bu dosya not oluşturma, düzenleme, silme ve listeleme işlemlerini yönetir
 */

// Global değişkenler
let currentUser = null;
let notes = [];
let currentView = 'notes'; // notes, new-note, settings
let currentEditingNote = null;
let autoSaveTimeout = null;
let isPreviewMode = false;

// Debounce için değişken
let debounceTimer = null;

/**
 * Notes modülünü başlatır
 */
function initializeNotes() {
    // Supabase kontrolü
    if (typeof window.SupabaseClient === 'undefined') {
        console.error('Supabase client bulunamadı!');
        showNotification('Uygulama başlatılamadı. Lütfen sayfayı yenileyin.', 'error');
        return;
    }

    // Kullanıcı kontrolü
    checkUserAndInitialize();

    console.log('✅ Notes modülü başlatıldı');
}

/**
 * Kullanıcıyı kontrol eder ve modülü başlatır
 */
async function checkUserAndInitialize() {
    try {
        currentUser = await window.SupabaseClient.getCurrentUser();

        if (!currentUser) {
            console.warn('Kullanıcı oturumu bulunamadı, giriş sayfasına yönlendiriliyor...');
            window.location.href = 'login.html';
            return;
        }

        // DOM elementlerini başlat
        initializeDOMElements();

        // Event listener'ları kur
        setupEventListeners();

        // Tema yükle
        loadTheme();

        // Notları yükle
        await loadNotes();

        console.log('✅ Notes modülü kullanıcı ile başlatıldı:', currentUser.email);
    } catch (error) {
        console.error('Kullanıcı kontrol hatası:', error);
        showNotification('Oturum hatası. Lütfen tekrar giriş yapın.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
}

/**
 * DOM elementlerini başlatır
 */
function initializeDOMElements() {
    // Sidebar elementleri
    window.sidebarToggle = document.getElementById('sidebarToggle');
    window.logoutBtn = document.getElementById('logoutBtn');

    // Header elementleri
    window.themeToggle = document.getElementById('themeToggle');
    window.viewToggle = document.getElementById('viewToggle');
    window.newNoteMobileBtn = document.getElementById('newNoteMobileBtn');
    window.pageTitle = document.getElementById('pageTitle');

    // İçerik elementleri
    window.notesView = document.getElementById('notesView');
    window.newNoteView = document.getElementById('newNoteView');
    window.settingsView = document.getElementById('settingsView');

    // Not listesi elementleri
    window.searchInput = document.getElementById('searchInput');
    window.notesContainer = document.getElementById('notesContainer');
    window.notesCount = document.getElementById('notesCount');
    window.loading = document.getElementById('loading');
    window.emptyState = document.getElementById('emptyState');

    // Editor elementleri
    window.noteTitle = document.getElementById('noteTitle');
    window.noteContent = document.getElementById('noteContent');
    window.saveNoteBtn = document.getElementById('saveNoteBtn');
    window.cancelNoteBtn = document.getElementById('cancelNoteBtn');
    window.previewToggle = document.getElementById('previewToggle');
    window.markdownPreview = document.getElementById('markdownPreview');
    window.autoSaveStatus = document.getElementById('autoSaveStatus');
    window.charCount = document.getElementById('charCount');

    // Ayarlar elementleri
    window.themeSelect = document.getElementById('themeSelect');
    window.userEmail = document.getElementById('userEmail');
    window.userCreatedAt = document.getElementById('userCreatedAt');
    window.exportNotesBtn = document.getElementById('exportNotesBtn');
    window.clearLocalDataBtn = document.getElementById('clearLocalDataBtn');

    // Modal elementleri
    window.noteModal = document.getElementById('noteModal');
    window.confirmModal = document.getElementById('confirmModal');
}

/**
 * Event listener'ları kurar
 */
function setupEventListeners() {
    // Sidebar
    if (window.sidebarToggle) {
        window.sidebarToggle.addEventListener('click', toggleSidebar);
    }

    if (window.logoutBtn) {
        window.logoutBtn.addEventListener('click', handleLogout);
    }

    // Navigasyon
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const view = e.currentTarget.getAttribute('data-view');
            switchView(view);
        });
    });

    // Header butonları
    if (window.themeToggle) {
        window.themeToggle.addEventListener('click', toggleTheme);
    }

    if (window.viewToggle) {
        window.viewToggle.addEventListener('click', toggleViewMode);
    }

    if (window.newNoteMobileBtn) {
        window.newNoteMobileBtn.addEventListener('click', () => switchView('new-note'));
    }

    // Arama
    if (window.searchInput) {
        window.searchInput.addEventListener('input', debounceSearch);
    }

    // Editor
    if (window.noteContent) {
        window.noteContent.addEventListener('input', handleContentChange);
    }

    if (window.saveNoteBtn) {
        window.saveNoteBtn.addEventListener('click', saveNote);
    }

    if (window.cancelNoteBtn) {
        window.cancelNoteBtn.addEventListener('click', cancelEdit);
    }

    if (window.previewToggle) {
        window.previewToggle.addEventListener('click', togglePreview);
    }

    // Boş durum butonu
    const createFirstNoteBtn = document.getElementById('createFirstNoteBtn');
    if (createFirstNoteBtn) {
        createFirstNoteBtn.addEventListener('click', () => switchView('new-note'));
    }

    // Ayarlar
    if (window.themeSelect) {
        window.themeSelect.addEventListener('change', handleThemeChange);
    }

    if (window.exportNotesBtn) {
        window.exportNotesBtn.addEventListener('click', exportNotes);
    }

    if (window.clearLocalDataBtn) {
        window.clearLocalDataBtn.addEventListener('click', clearLocalData);
    }

    // Modal'lar
    document.addEventListener('click', handleModalClick);

    // ESC tuşu ile modal kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Responsive sidebar
    window.addEventListener('resize', handleResize);
}

/**
 * Tüm notları yükler
 */
async function loadNotes() {
    try {
        showLoading(true);

        const client = window.SupabaseClient.getClient();
        const { data, error } = await client
            .from('notes')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        notes = data || [];
        renderNotes();

        // Kullanıcı bilgilerini güncelle
        updateUserInfo();

        console.log(`✅ ${notes.length} not yüklendi`);
    } catch (error) {
        console.error('Not yükleme hatası:', error);
        showNotification('Notlar yüklenirken hata oluştu', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Notları render eder
 */
function renderNotes() {
    if (!window.notesContainer) return;

    const searchTerm = window.searchInput ? window.searchInput.value.toLowerCase() : '';
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );

    // Not sayısını güncelle
    if (window.notesCount) {
        window.notesCount.textContent = `${filteredNotes.length} not`;
    }

    // Boş durum kontrolü
    if (filteredNotes.length === 0) {
        showEmptyState(searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz notun yok');
        window.notesContainer.innerHTML = '';
        return;
    }

    hideEmptyState();

    // Notları render et
    window.notesContainer.innerHTML = filteredNotes.map(note => createNoteCard(note)).join('');
}

/**
 * Not kartı HTML'ini oluşturur
 * @param {Object} note - Not objesi
 * @returns {string} HTML string
 */
function createNoteCard(note) {
    const date = new Date(note.created_at).toLocaleDateString('tr-TR');
    const preview = note.content.length > 100 ?
        note.content.substring(0, 100) + '...' : note.content;

    return `
        <div class="note-card" data-id="${note.id}">
            <div class="note-header">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <div class="note-actions">
                    <button class="note-action-btn edit-btn" onclick="editNote('${note.id}')" title="Düzenle">
                        ✏️
                    </button>
                    <button class="note-action-btn delete-btn" onclick="deleteNote('${note.id}')" title="Sil">
                        🗑️
                    </button>
                </div>
            </div>
            <div class="note-content">${escapeHtml(preview)}</div>
            <div class="note-meta">
                <span>Oluşturulma: ${date}</span>
                <span>${note.content.length} karakter</span>
            </div>
        </div>
    `;
}

/**
 * Yeni not oluşturur
 */
async function createNote() {
    try {
        const client = window.SupabaseClient.getClient();
        const { data, error } = await client
            .from('notes')
            .insert([{
                user_id: currentUser.id,
                title: 'Yeni Not',
                content: ''
            }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        notes.unshift(data);
        renderNotes();

        // Düzenleme moduna geç
        editNote(data.id);

        console.log('✅ Yeni not oluşturuldu');
    } catch (error) {
        console.error('Not oluşturma hatası:', error);
        showNotification('Not oluşturulamadı', 'error');
    }
}

/**
 * Notu düzenler
 * @param {string} noteId - Not ID'si
 */
function editNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    currentEditingNote = note;

    // Formu doldur
    if (window.noteTitle) window.noteTitle.value = note.title;
    if (window.noteContent) window.noteContent.value = note.content;

    // Karakter sayısını güncelle
    updateCharCount();

    // Görünümü değiştir
    switchView('edit-note');

    console.log('✅ Not düzenleme modu açıldı:', noteId);
}

/**
 * Notu kaydeder
 */
async function saveNote() {
    if (!currentEditingNote) return;

    const title = window.noteTitle ? window.noteTitle.value.trim() : '';
    const content = window.noteContent ? window.noteContent.value : '';

    if (!title) {
        showNotification('Not başlığı gereklidir', 'error');
        window.noteTitle.focus();
        return;
    }

    try {
        const client = window.SupabaseClient.getClient();
        const { data, error } = await client
            .from('notes')
            .update({
                title: title,
                content: content,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentEditingNote.id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Local array'i güncelle
        const index = notes.findIndex(n => n.id === currentEditingNote.id);
        if (index !== -1) {
            notes[index] = data;
        }

        renderNotes();
        switchView('notes');

        showNotification('Not kaydedildi', 'success');
        console.log('✅ Not kaydedildi:', currentEditingNote.id);
    } catch (error) {
        console.error('Not kaydetme hatası:', error);
        showNotification('Not kaydedilemedi', 'error');
    }
}

/**
 * Not silme işlemini başlatır
 * @param {string} noteId - Not ID'si
 */
function deleteNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    showConfirmModal(
        'Notu Sil',
        `"${note.title}" başlıklı notu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
        () => confirmDeleteNote(noteId)
    );
}

/**
 * Not silme işlemini onaylar
 * @param {string} noteId - Not ID'si
 */
async function confirmDeleteNote(noteId) {
    try {
        const client = window.SupabaseClient.getClient();
        const { error } = await client
            .from('notes')
            .delete()
            .eq('id', noteId);

        if (error) {
            throw error;
        }

        // Local array'den kaldır
        notes = notes.filter(n => n.id !== noteId);
        renderNotes();

        showNotification('Not silindi', 'success');
        console.log('✅ Not silindi:', noteId);
    } catch (error) {
        console.error('Not silme hatası:', error);
        showNotification('Not silinemedi', 'error');
    }

    closeAllModals();
}

/**
 * İçerik değişikliğini yönetir (auto-save için)
 */
function handleContentChange() {
    updateCharCount();

    // Auto-save
    if (currentEditingNote) {
        clearTimeout(autoSaveTimeout);
        updateAutoSaveStatus('saving');

        autoSaveTimeout = setTimeout(async () => {
            try {
                const title = window.noteTitle ? window.noteTitle.value.trim() : '';
                const content = window.noteContent ? window.noteContent.value : '';

                const client = window.SupabaseClient.getClient();
                await client
                    .from('notes')
                    .update({
                        title: title,
                        content: content,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', currentEditingNote.id);

                updateAutoSaveStatus('saved');

                // Local array'i güncelle
                const index = notes.findIndex(n => n.id === currentEditingNote.id);
                if (index !== -1) {
                    notes[index].title = title;
                    notes[index].content = content;
                    notes[index].updated_at = new Date().toISOString();
                }
            } catch (error) {
                console.error('Auto-save hatası:', error);
                updateAutoSaveStatus('error');
            }
        }, 2000); // 2 saniye sonra kaydet
    }
}

/**
 * Karakter sayısını günceller
 */
function updateCharCount() {
    if (!window.charCount || !window.noteContent) return;

    const count = window.noteContent.value.length;
    window.charCount.textContent = `${count} karakter`;
}

/**
 * Auto-save durumunu günceller
 * @param {string} status - Durum (saving, saved, error)
 */
function updateAutoSaveStatus(status) {
    if (!window.autoSaveStatus) return;

    window.autoSaveStatus.className = 'auto-save-status';

    switch (status) {
        case 'saving':
            window.autoSaveStatus.classList.add('saving');
            window.autoSaveStatus.textContent = 'Kaydediliyor...';
            break;
        case 'saved':
            window.autoSaveStatus.classList.add('saved');
            window.autoSaveStatus.textContent = 'Kaydedildi';
            break;
        case 'error':
            window.autoSaveStatus.textContent = 'Kaydetme hatası';
            break;
        default:
            window.autoSaveStatus.textContent = 'Hazır';
    }
}

/**
 * Arama işlemini debounce ile yönetir
 */
function debounceSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        renderNotes();
    }, 300);
}

/**
 * Görünüm modunu değiştirir
 * @param {string} view - Yeni görünüm (notes, new-note, edit-note, settings)
 */
function switchView(view) {
    // Aktif nav item'ı güncelle
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const navItem = document.querySelector(`[data-view="${view}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }

    // View'ları gizle
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });

    // İlgili view'ı göster
    let targetView = view;
    if (view === 'new-note' || view === 'edit-note') {
        targetView = 'new-note';
        currentView = view;
    } else {
        currentView = view;
    }

    const viewElement = document.getElementById(targetView + 'View');
    if (viewElement) {
        viewElement.classList.add('active');
    }

    // Sayfa başlığını güncelle
    updatePageTitle(view);

    console.log('✅ Görünüm değiştirildi:', view);
}

/**
 * Sayfa başlığını günceller
 * @param {string} view - Aktif görünüm
 */
function updatePageTitle(view) {
    if (!window.pageTitle) return;

    const titles = {
        'notes': 'Notlarım',
        'new-note': 'Yeni Not',
        'edit-note': 'Notu Düzenle',
        'settings': 'Ayarlar'
    };

    window.pageTitle.textContent = titles[view] || 'Not App';
}

/**
 * Sidebar'ı aç/kapat
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }

    if (mainContent) {
        mainContent.classList.toggle('sidebar-collapsed');
    }
}

/**
 * Tema değiştirme işlemini yönetir
 */
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);
}

/**
 * Tema ayarlar
 * @param {string} theme - Tema adı (light, dark, auto)
 */
function setTheme(theme) {
    let actualTheme = theme;

    if (theme === 'auto') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', actualTheme);
    localStorage.setItem('theme', theme);

    // Tema toggle butonunu güncelle
    if (window.themeToggle) {
        const icon = window.themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = actualTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Select elementini güncelle
    if (window.themeSelect) {
        window.themeSelect.value = theme;
    }

    console.log('✅ Tema değiştirildi:', actualTheme);
}

/**
 * Tema değişikliğini select'ten yönetir
 */
function handleThemeChange() {
    if (window.themeSelect) {
        const selectedTheme = window.themeSelect.value;
        setTheme(selectedTheme);
    }
}

/**
 * Tema yükler
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    setTheme(savedTheme);
}

/**
 * Görünüm modunu değiştirir (grid/list)
 */
function toggleViewMode() {
    const notesContainer = document.getElementById('notesContainer');
    if (!notesContainer) return;

    const isGrid = notesContainer.classList.contains('grid-view');
    const icon = window.viewToggle ? window.viewToggle.querySelector('.view-icon') : null;

    if (isGrid) {
        notesContainer.classList.remove('grid-view');
        notesContainer.classList.add('list-view');
        if (icon) icon.textContent = '📋';
        localStorage.setItem('viewMode', 'list');
    } else {
        notesContainer.classList.remove('list-view');
        notesContainer.classList.add('grid-view');
        if (icon) icon.textContent = '⊞';
        localStorage.setItem('viewMode', 'grid');
    }
}

/**
 * Önizleme modunu aç/kapat
 */
function togglePreview() {
    isPreviewMode = !isPreviewMode;

    if (isPreviewMode) {
        renderMarkdownPreview();
        window.markdownPreview.style.display = 'block';
        window.previewToggle.innerHTML = '<span class="preview-icon">📝</span> Düzenle';
    } else {
        window.markdownPreview.style.display = 'none';
        window.previewToggle.innerHTML = '<span class="preview-icon">👁️</span> Önizleme';
    }
}

/**
 * Markdown önizlemesi render eder
 */
function renderMarkdownPreview() {
    if (!window.noteContent || !window.markdownPreview) return;

    const content = window.noteContent.value;
    // Basit markdown parsing (gerçek uygulamada marked.js kullanabilirsiniz)
    const html = content
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2">')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br>');

    window.markdownPreview.innerHTML = `<p>${html}</p>`;
}

/**
 * Kullanıcı bilgilerini günceller
 */
function updateUserInfo() {
    if (window.userEmail) {
        window.userEmail.textContent = currentUser.email;
    }

    if (window.userCreatedAt) {
        const date = new Date(currentUser.created_at).toLocaleDateString('tr-TR');
        window.userCreatedAt.textContent = date;
    }
}

/**
 * Notları dışa aktarır
 */
function exportNotes() {
    try {
        const exportData = {
            user: currentUser.email,
            exportDate: new Date().toISOString(),
            notes: notes.map(note => ({
                title: note.title,
                content: note.content,
                createdAt: note.created_at,
                updatedAt: note.updated_at
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notlar-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Notlar dışa aktarıldı', 'success');
    } catch (error) {
        console.error('Dışa aktarma hatası:', error);
        showNotification('Dışa aktarma başarısız', 'error');
    }
}

/**
 * Yerel veriyi temizler
 */
function clearLocalData() {
    showConfirmModal(
        'Yerel Veriyi Temizle',
        'Yerel olarak kaydedilmiş tüm veriler silinecek. Bu işlem geri alınamaz.',
        () => {
            localStorage.clear();
            showNotification('Yerel veri temizlendi', 'success');
            closeAllModals();
        }
    );
}

/**
 * Loading durumunu göster/gizle
 * @param {boolean} show - Göster/gizle
 */
function showLoading(show) {
    if (window.loading) {
        window.loading.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Boş durum mesajını göster
 * @param {string} message - Mesaj
 */
function showEmptyState(message = 'Henüz notun yok') {
    if (window.emptyState) {
        const title = window.emptyState.querySelector('h3');
        if (title) title.textContent = message;
        window.emptyState.style.display = 'block';
    }
}

/**
 * Boş durum mesajını gizle
 */
function hideEmptyState() {
    if (window.emptyState) {
        window.emptyState.style.display = 'none';
    }
}

/**
 * Onay modal'ını gösterir
 * @param {string} title - Modal başlığı
 * @param {string} message - Modal mesajı
 * @param {Function} onConfirm - Onay fonksiyonu
 */
function showConfirmModal(title, message, onConfirm) {
    if (!window.confirmModal) return;

    const titleElement = window.confirmModal.querySelector('#confirmTitle');
    const messageElement = window.confirmModal.querySelector('#confirmMessage');
    const confirmBtn = window.confirmModal.querySelector('#confirmOk');
    const cancelBtn = window.confirmModal.querySelector('#confirmCancel');

    if (titleElement) titleElement.textContent = title;
    if (messageElement) messageElement.textContent = message;

    // Event listener'ları temizle
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);

    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Yeni event listener'lar ekle
    newConfirmBtn.addEventListener('click', onConfirm);
    newCancelBtn.addEventListener('click', closeAllModals);

    // Modal'ı göster
    window.confirmModal.style.display = 'flex';
}

/**
 * Tüm modal'ları kapat
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

/**
 * Modal dışına tıklandığında kapat
 * @param {Event} e - Click eventi
 */
function handleModalClick(e) {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
}

/**
 * Çıkış işlemini yönetir
 */
async function handleLogout() {
    try {
        const success = await window.SupabaseClient.signOut();
        if (success) {
            showNotification('Çıkış yapıldı', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } else {
            showNotification('Çıkış yapılamadı', 'error');
        }
    } catch (error) {
        console.error('Çıkış hatası:', error);
        showNotification('Çıkış yapılırken hata oluştu', 'error');
    }
}

/**
 * Düzenlemeyi iptal eder
 */
function cancelEdit() {
    switchView('notes');
    currentEditingNote = null;
}

/**
 * Ekran boyutu değişikliğini yönetir
 */
function handleResize() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (window.innerWidth > 768) {
        // Desktop
        if (sidebar) sidebar.classList.remove('show');
        if (mainContent) mainContent.classList.remove('sidebar-collapsed');
    }
}

/**
 * HTML karakterlerini escape eder
 * @param {string} text - Escape edilecek metin
 * @returns {string} Escape edilmiş metin
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Bildirim gösterir
 * @param {string} message - Bildirim mesajı
 * @param {string} type - Bildirim tipi
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

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', initializeNotes);

// Global değişkenlere ekleme
window.Notes = {
    loadNotes: loadNotes,
    createNote: createNote,
    editNote: editNote,
    deleteNote: deleteNote,
    saveNote: saveNote,
    switchView: switchView,
    exportNotes: exportNotes
};



