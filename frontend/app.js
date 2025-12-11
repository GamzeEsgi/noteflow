// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// State
let currentEditingNoteId = null;
let allNotes = [];
let currentCalendarDate = new Date();

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeTheme();
    setupEventListeners();
    loadNotes();
    loadUserInfo();
    
    // Initialize calendar if calendar tab is active
    setTimeout(() => {
        if (document.getElementById('calendarTab')?.classList.contains('active')) {
            renderCalendar();
        }
    }, 500);
});

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
}

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Menu toggle (mobile)
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    // New note form
    document.getElementById('newNoteForm').addEventListener('submit', handleCreateNote);

    // Edit note form
    document.getElementById('editNoteForm').addEventListener('submit', handleUpdateNote);

    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelEdit').addEventListener('click', closeModal);

    // Delete note
    document.getElementById('deleteNoteBtn').addEventListener('click', handleDeleteNote);

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Close modal on outside click
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target.id === 'editModal') {
            closeModal();
        }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });

    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });

    // Toolbar buttons
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const command = btn.dataset.command;
            const value = btn.dataset.value;
            executeCommand(command, value);
            btn.classList.toggle('active');
        });
    });

    // Text color picker
    document.getElementById('textColorPicker').addEventListener('change', (e) => {
        document.execCommand('foreColor', false, e.target.value);
    });

    // Color presets
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', (e) => {
            e.preventDefault();
            const color = preset.dataset.color;
            document.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
            const colorInput = preset.closest('.color-picker').querySelector('input[type="color"]');
            if (colorInput) colorInput.value = color;
        });
    });
}

// Load User Info
async function loadUserInfo() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('userEmail').textContent = data.user.email;
            document.getElementById('planBadge').textContent = data.user.plan === 'free' ? 'Free' : 'Premium';
            document.getElementById('noteLimit').textContent = data.user.plan === 'free' ? '50' : '∞';
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

// API Helper
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load Notes
async function loadNotes() {
    try {
        const notes = await apiRequest('/notes');
        allNotes = notes;
        displayNotes(notes);
        updateStats(notes.length);
        
        // Render calendar if calendar tab is active
        if (document.getElementById('calendarTab')?.classList.contains('active')) {
            renderCalendar();
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        const grid = document.getElementById('notesGrid');
        if (grid) {
            grid.innerHTML = '<div class="empty-state"><h3>Notlar yüklenirken bir hata oluştu</h3></div>';
        }
    }
}

// Display Notes
function displayNotes(notes) {
    const grid = document.getElementById('notesGrid');

    if (notes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>Henüz notunuz yok</h3>
                <p>Yeni bir not oluşturmak için sol menüyü kullanın</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = notes.map(note => {
        const color = note.color || '#fef3c7';
        const content = note.content.replace(/<[^>]*>/g, ''); // Strip HTML tags for preview
        return `
        <div class="note-card" onclick="openEditModal('${note._id}')" data-color="${color}" style="background: linear-gradient(135deg, ${color}40 0%, rgba(255, 255, 255, 0.9) 100%); border-left: 4px solid ${color}">
            <div class="note-title">${escapeHtml(note.title)}</div>
            <div class="note-content">${escapeHtml(content)}</div>
            <div class="note-date">${note.date ? formatDate(note.date) : formatDate(note.createdAt)}</div>
        </div>
        `;
    }).join('');
}

// Create Note
async function handleCreateNote(e) {
    e.preventDefault();

    const title = document.getElementById('newNoteTitle').value.trim();
    const content = document.getElementById('newNoteContent').value.trim();
    const color = document.getElementById('newNoteColor').value;
    const date = document.getElementById('newNoteDate').value || null;

    if (!title || !content) {
        alert('Lütfen başlık ve içerik girin');
        return;
    }

    try {
        const note = await apiRequest('/notes', {
            method: 'POST',
            body: JSON.stringify({ title, content, color, date })
        });

        // Reset form
        document.getElementById('newNoteForm').reset();
        document.getElementById('newNoteColor').value = '#fef3c7';
        
        // Reload notes
        await loadNotes();
        if (document.getElementById('calendarTab').classList.contains('active')) {
            renderCalendar();
        }

        // Show success message
        showNotification('Not başarıyla oluşturuldu', 'success');
    } catch (error) {
        if (error.message.includes('limit')) {
            alert(error.message);
        } else {
            alert('Not oluşturulurken bir hata oluştu');
        }
    }
}

// Open Edit Modal
function openEditModal(noteId) {
    const note = allNotes.find(n => n._id === noteId);
    if (!note) return;

    currentEditingNoteId = noteId;
    document.getElementById('editNoteTitle').value = note.title;
    const editor = document.getElementById('editNoteContent');
    // Check if content has HTML tags
    if (note.content.includes('<') && note.content.includes('>')) {
        editor.innerHTML = note.content;
    } else {
        editor.innerHTML = escapeHtml(note.content).replace(/\n/g, '<br>');
    }
    document.getElementById('editNoteColor').value = note.color || '#fef3c7';
    document.getElementById('editNoteDate').value = note.date ? new Date(note.date).toISOString().split('T')[0] : '';
    
    // Set color preset active
    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.classList.remove('active');
        if (preset.dataset.color === (note.color || '#fef3c7')) {
            preset.classList.add('active');
        }
    });
    
    document.getElementById('editModal').classList.add('active');
}

// Close Modal
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditingNoteId = null;
    document.getElementById('editNoteForm').reset();
    const editor = document.getElementById('editNoteContent');
    editor.innerHTML = '';
}

// Update Note
async function handleUpdateNote(e) {
    e.preventDefault();

    const title = document.getElementById('editNoteTitle').value.trim();
    const editor = document.getElementById('editNoteContent');
    const content = editor.innerHTML.trim() || editor.innerText.trim();
    const color = document.getElementById('editNoteColor').value;
    const date = document.getElementById('editNoteDate').value || null;

    if (!title || !content) {
        alert('Lütfen başlık ve içerik girin');
        return;
    }

    try {
        await apiRequest(`/notes/${currentEditingNoteId}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content, color, date })
        });

        closeModal();
        await loadNotes();
        if (document.getElementById('calendarTab').classList.contains('active')) {
            renderCalendar();
        }
        showNotification('Not başarıyla güncellendi', 'success');
    } catch (error) {
        alert('Not güncellenirken bir hata oluştu');
    }
}

// Delete Note
async function handleDeleteNote() {
    if (!confirm('Bu notu silmek istediğinize emin misiniz?')) {
        return;
    }

    try {
        await apiRequest(`/notes/${currentEditingNoteId}`, {
            method: 'DELETE'
        });

        closeModal();
        await loadNotes();
        showNotification('Not başarıyla silindi', 'success');
    } catch (error) {
        alert('Not silinirken bir hata oluştu');
    }
}

// Search
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (!query) {
        displayNotes(allNotes);
        return;
    }

    const filtered = allNotes.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );

    displayNotes(filtered);
}

// Update Stats
function updateStats(count) {
    document.getElementById('totalNotes').textContent = count;
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
        return date.toLocaleDateString('tr-TR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } else if (days > 0) {
        return `${days} gün önce`;
    } else if (hours > 0) {
        return `${hours} saat önce`;
    } else if (minutes > 0) {
        return `${minutes} dakika önce`;
    } else {
        return 'Az önce';
    }
}

function showNotification(message, type = 'info') {
    // Simple notification - can be enhanced
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#27ae60' : '#4a90e2'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Tab Switching
function switchTab(tab) {
    try {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        const tabBtn = document.querySelector(`[data-tab="${tab}"]`);
        const tabContent = document.getElementById(`${tab}Tab`);
        
        if (tabBtn) {
            tabBtn.classList.add('active');
        } else {
            console.error(`Tab button not found for: ${tab}`);
        }
        
        if (tabContent) {
            tabContent.classList.add('active');
        } else {
            console.error(`Tab content not found for: ${tab}`);
        }
        
        if (tab === 'calendar') {
            // Wait for DOM to update
            setTimeout(() => {
                const calendarGrid = document.getElementById('calendarGrid');
                if (calendarGrid) {
                    renderCalendar();
                } else {
                    console.error('calendarGrid element not found');
                    // Try again after a longer delay
                    setTimeout(() => {
                        renderCalendar();
                    }, 300);
                }
            }, 150);
        }
    } catch (error) {
        console.error('Error switching tab:', error);
    }
}

// Calendar Functions
function renderCalendar() {
    try {
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        
        // Update month header
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                           'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const monthElement = document.getElementById('calendarMonth');
        if (monthElement) {
            monthElement.textContent = `${monthNames[month]} ${year}`;
        }
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Day names
        const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        
        let html = '';
        
        // Day headers
        dayNames.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        
        // Adjust first day (Monday = 0)
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        
        // Empty cells for days before month starts
        for (let i = 0; i < adjustedFirstDay; i++) {
            html += '<div class="calendar-day empty-day"></div>';
        }
        
        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const notesForDay = allNotes.filter(note => {
                if (!note.date) return false;
                try {
                    const noteDate = new Date(note.date).toISOString().split('T')[0];
                    return noteDate === dateStr;
                } catch (e) {
                    return false;
                }
            });
            
            const isToday = date.toDateString() === today.toDateString() && 
                           date.getMonth() === today.getMonth() && 
                           date.getFullYear() === today.getFullYear();
            const hasNotes = notesForDay.length > 0;
            
            html += `
                <div class="calendar-day ${isToday ? 'today' : ''} ${hasNotes ? 'has-notes' : ''}" 
                     data-date="${dateStr}" onclick="showDayNotes('${dateStr}')">
                    <span class="calendar-day-number">${day}</span>
                    ${hasNotes ? `<span class="note-count">${notesForDay.length}</span>` : ''}
                </div>
            `;
        }
        
        const gridElement = document.getElementById('calendarGrid');
        if (gridElement) {
            gridElement.innerHTML = html;
        } else {
            console.error('calendarGrid element not found');
        }
        
        // Clear notes section initially
        const notesElement = document.getElementById('calendarNotes');
        if (notesElement) {
            if (!notesElement.querySelector('.calendar-note-item') && !notesElement.querySelector('.empty-calendar-state')) {
                notesElement.innerHTML = `
                    <div class="empty-calendar-state">
                        <p>📝 Bir tarihe tıklayarak o güne ait notları görüntüleyin</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error rendering calendar:', error);
    }
}

function showDayNotes(dateStr) {
    try {
        const notesForDay = allNotes.filter(note => {
            if (!note.date) return false;
            try {
                const noteDate = new Date(note.date).toISOString().split('T')[0];
                return noteDate === dateStr;
            } catch (e) {
                return false;
            }
        });
        
        const container = document.getElementById('calendarNotes');
        if (!container) {
            console.error('calendarNotes container not found');
            return;
        }
        
        const date = new Date(dateStr);
        const dateFormatted = date.toLocaleDateString('tr-TR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            weekday: 'long'
        });
        
        if (notesForDay.length === 0) {
            container.innerHTML = `
                <div class="empty-calendar-state">
                    <h4>${dateFormatted}</h4>
                    <p>Bu tarihte not yok</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.6;">Yeni not eklemek için sol menüyü kullanın</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <h4>${dateFormatted}</h4>
            ${notesForDay.map(note => {
                const content = note.content.replace(/<[^>]*>/g, ''); // Strip HTML
                return `
                <div class="calendar-note-item" onclick="openEditModal('${note._id}')" style="border-left-color: ${note.color || '#fef3c7'}">
                    <strong style="display: block; margin-bottom: 0.5rem; color: var(--text-primary);">${escapeHtml(note.title)}</strong>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${escapeHtml(content.substring(0, 120))}${content.length > 120 ? '...' : ''}</p>
                </div>
            `;
            }).join('')}
        `;
    } catch (error) {
        console.error('Error showing day notes:', error);
    }
}

// Make showDayNotes globally accessible
window.showDayNotes = showDayNotes;

// Toolbar Commands
function executeCommand(command, value) {
    if (command === 'formatBlock' && value) {
        document.execCommand(command, false, value);
    } else {
        document.execCommand(command, false, null);
    }
}

// Make functions available globally
window.openEditModal = openEditModal;
window.showDayNotes = showDayNotes;

