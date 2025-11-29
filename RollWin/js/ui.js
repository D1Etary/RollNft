// ui.js - АДАПТИРОВАННЫЙ ДЛЯ TELEGRAM MINI APP

// ФУНКЦИИ ОБНОВЛЕНИЯ ИНТЕРФЕЙСА
function updateUI() {
    if (!window.userData) return;
    
    // Обновление главной страницы
    if (window.topstars) {
        window.topstars.textContent = window.userData.stars?.toLocaleString() || '0';
    }
    
    if (window.username) {
        window.username.textContent = window.userData.username || 'Игрок';
    }
    
    if (window.userLevel) {
        const level = window.userData.level || 1;
        window.userLevel.textContent = `Уровень ${level} • ${getRankName(level)}`;
    }
    
    // Обновляем статистику истории
    if (window.totalOpened) {
        window.totalOpened.textContent = window.userData.casesOpened || 0;
    }
    
    if (window.totalSpent) {
        window.totalSpent.textContent = `${window.userData.starsSpent || 0}★`;
    }
    
    // Обновляем историю если на странице истории
    if (window.historyList && isPageActive('page-history')) {
        renderHistory();
    }
    
    // Обновляем профиль если на странице профиля
    if (window.profileName && isPageActive('page-profile')) {
        updateProfile();
    }
    
    // Обновляем рейтинг если на странице рейтинга
    if (window.leaderboardList && isPageActive('page-rate')) {
        renderLeaderboard();
    }
    
    // Обновляем достижения если на странице профиля
    if (window.achievementsGrid && isPageActive('page-profile')) {
        renderAchievements();
    }
}

function updateProfile() {
    if (!window.userData) return;
    
    if (window.profileName) {
        window.profileName.textContent = window.userData.username || 'Игрок';
    }
    
    if (window.profileLevel) {
        window.profileLevel.textContent = window.userData.level || 1;
    }
    
    if (window.profileStars) {
        window.profileStars.textContent = window.userData.stars?.toLocaleString() || '0';
    }
    
    if (window.profileOpened) {
        window.profileOpened.textContent = window.userData.casesOpened || 0;
    }
    
    if (window.profileSpent) {
        window.profileSpent.textContent = `${window.userData.starsSpent || 0}★`;
    }
    
    if (window.profileLuck) {
        window.profileLuck.textContent = `${calculateLuck()}%`;
    }
    
    // Обновление аватара из Telegram
    updateProfileAvatar();
}

function updateProfileAvatar() {
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar && window.userData?.photoUrl) {
        profileAvatar.src = window.userData.photoUrl;
    }
}

function renderAchievements() {
    if (!window.achievementsGrid || !window.DB) return;
    
    const achievements = window.DB.getAchievements();
    window.achievementsGrid.innerHTML = '';
    
    if (achievements.length === 0) {
        window.achievementsGrid.innerHTML = `
            <div class="empty-achievements">
                <div class="empty-history-icon">🏆</div>
                <div>Достижения загружаются...</div>
            </div>
        `;
        return;
    }
    
    achievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = `achievement-item ${achievement.unlocked ? '' : 'achievement-locked'}`;
        
        const progress = achievement.progress || 0;
        const target = achievement.target || 1;
        const progressPercent = Math.min((progress / target) * 100, 100);
        
        achievementItem.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
            ${!achievement.unlocked ? `
                <div class="achievement-progress">
                    <div class="achievement-progress-bar">
                        <div class="achievement-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="achievement-progress-text">${progress}/${target}</div>
                </div>
            ` : `
                <div class="achievement-unlocked">✓ Разблокировано</div>
            `}
        `;
        
        // Добавляем анимацию для разблокированных достижений
        if (achievement.unlocked) {
            achievementItem.style.animation = 'fadeIn 0.6s ease-out';
        }
        
        window.achievementsGrid.appendChild(achievementItem);
    });
}

function renderLeaderboard() {
    if (!window.leaderboardList || !window.DB) return;
    
    const leaderboard = window.DB.getLeaderboard(window.currentLeaderboardTab || 'stars');
    window.leaderboardList.innerHTML = '';
    
    if (leaderboard.length === 0) {
        window.leaderboardList.innerHTML = `
            <div class="empty-leaderboard">
                <div class="empty-history-icon">🏆</div>
                <div>Рейтинг пуст</div>
                <div style="margin-top:10px;font-size:14px;color:var(--tg-dark-hint);">Будьте первым в рейтинге!</div>
            </div>
        `;
        return;
    }
    
    const currentUserId = window.userData?.id;
    
    leaderboard.forEach((player, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        const isCurrentUser = player.id === currentUserId;
        
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = `leaderboard-item ${isCurrentUser ? 'current-user-highlight' : ''}`;
        leaderboardItem.innerHTML = `
            <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
            <img class="leaderboard-avatar" src="${player.avatar || getDefaultAvatar()}" alt="${player.name}" onerror="this.src='${getDefaultAvatar()}'">
            <div class="leaderboard-info">
                <div class="leaderboard-name">${player.name}</div>
                <div class="leaderboard-level">Уровень ${player.level}</div>
            </div>
            <div class="leaderboard-stats">
                <div class="leaderboard-stars">${formatNumber(player.stars)}★</div>
                <div class="leaderboard-wins">${player.wins} побед</div>
            </div>
        `;
        
        // Добавляем анимацию для текущего пользователя
        if (isCurrentUser) {
            leaderboardItem.style.animation = 'pulse 2s infinite';
        }
        
        window.leaderboardList.appendChild(leaderboardItem);
    });
}

function renderHistory() {
    if (!window.historyList || !window.userData) return;
    
    const history = window.userData.history || [];
    window.historyList.innerHTML = '';
    
    if (history.length === 0) {
        window.historyList.innerHTML = `
            <div class="empty-history">
                <div class="empty-history-icon">📭</div>
                <div>История открытий пуста</div>
                <div style="margin-top:10px;font-size:14px;color:var(--tg-dark-hint);">Откройте первый кейс чтобы начать историю!</div>
            </div>
        `;
        return;
    }
    
    // Ограничиваем показ последними 20 записями для производительности
    const recentHistory = history.slice(0, 20);
    
    recentHistory.forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const rarityClass = record.rarity ? `history-${record.rarity}` : '';
        const prizeIcon = record.icon || getPrizeEmoji(record.rarity);
        
        historyItem.innerHTML = `
            <div class="history-icon ${rarityClass}">${prizeIcon}</div>
            <div class="history-info">
                <div class="history-case">${record.caseName || 'Неизвестный кейс'}</div>
                <div class="history-prize">${record.prize || 'Неизвестный приз'}</div>
            </div>
            <div style="text-align:right;">
                <div class="history-stars">-${record.cost || 0}★</div>
                <div class="history-date">${formatDate(record.timestamp || record.date)}</div>
            </div>
        `;
        
        // Добавляем анимацию появления
        historyItem.style.animation = 'slideUp 0.3s ease-out';
        
        window.historyList.appendChild(historyItem);
    });
    
    // Показываем количество скрытых записей если есть
    if (history.length > 20) {
        const moreItems = document.createElement('div');
        moreItems.className = 'history-more-items';
        moreItems.innerHTML = `
            <div style="text-align:center;padding:20px;color:var(--tg-dark-hint);">
                +${history.length - 20} более ранних записей
            </div>
        `;
        window.historyList.appendChild(moreItems);
    }
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function isPageActive(pageId) {
    const page = document.getElementById(pageId);
    return page && page.style.display === 'block';
}

function getRankName(level) {
    if (level < 5) return 'Новичок';
    if (level < 10) return 'Опытный';
    if (level < 15) return 'Эксперт';
    if (level < 20) return 'Мастер';
    if (level < 25) return 'Гуру';
    return 'Легенда';
}

function calculateLuck() {
    if (!window.userData?.history) return 0;
    
    const history = window.userData.history;
    if (history.length === 0) return 0;
    
    const legendaryWins = history.filter(item => item.rarity === 'legendary').length;
    const epicWins = history.filter(item => item.rarity === 'epic').length;
    
    // Формула удачи: (легендарные * 3 + эпические * 1.5) / общее количество * 100
    const luckScore = (legendaryWins * 3 + epicWins * 1.5) / history.length * 100;
    return Math.min(Math.round(luckScore * 10) / 10, 100); // Округляем до 0.1
}

function formatDate(dateString) {
    if (!dateString) return 'Неизвестно';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Сегодня ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
        } else if (diffDays === 1) {
            return 'Вчера ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
        } else if (diffDays < 7) {
            return `${diffDays} д. назад`;
        } else {
            return date.toLocaleDateString('ru-RU');
        }
    } catch (e) {
        return 'Неизвестно';
    }
}

function formatNumber(num) {
    if (!num) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

function getDefaultAvatar() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMyNDgxY2MiLz4KPHBhdGggZD0iTTIwIDIyQzIyLjIwOTEgMjIgMjQgMjAuMjA5MSAyNCAxOEMyNCAxNS43OTA5IDIyLjIwOTEgMTQgMjAgMTRDMTcuNzkwOSAxNCAxNiAxNS43OTA5IDE2IDE4QzE2IDIwLjIwOTEgMTcuNzkwOSAyMiAyMCAyMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNiAyNkMyNiAyOC4yMDkxIDIzLjMxMzcgMzAgMjAgMzBDMTYuNjg2MyAzMCAxNCAyOC4yMDkxIDE0IDI2QzE0IDIzLjc5MDkgMTYuNjg2MyAyMiAyMCAyMkMyMy4zMTM3IDIyIDI2IDIzLjc5MDkgMjYgMjZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
}

function getPrizeEmoji(rarity) {
    const emojis = {
        common: '📦',
        rare: '🔷', 
        epic: '💜',
        legendary: '⭐'
    };
    return emojis[rarity] || '🎁';
}

// АНИМАЦИИ ДЛЯ UI
function showNotification(message, type = 'info') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    // Добавляем стили для уведомления
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--tg-dark-panel);
                color: var(--tg-dark-text);
                padding: 12px 16px;
                border-radius: 12px;
                border: 1px solid var(--tg-dark-border);
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
            }
            .notification-success {
                border-left: 4px solid var(--tg-success);
            }
            .notification-error {
                border-left: 4px solid var(--tg-rare);
            }
            .notification-info {
                border-left: 4px solid var(--tg-accent);
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ОБНОВЛЕНИЕ СТАТУСА БАЛАНСА
function updateBalanceDisplay() {
    if (!window.userData) return;
    
    // Обновляем все элементы с балансом
    const balanceElements = document.querySelectorAll('[data-balance]');
    balanceElements.forEach(element => {
        element.textContent = window.userData.stars?.toLocaleString() || '0';
    });
    
    // Обновляем элементы с потраченными звездами
    const spentElements = document.querySelectorAll('[data-spent]');
    spentElements.forEach(element => {
        element.textContent = `${window.userData.starsSpent || 0}★`;
    });
}

// ЭКСПОРТ ФУНКЦИЙ ДЛЯ ГЛОБАЛЬНОГО ИСПОЛЬЗОВАНИЯ
window.UI = {
    updateUI,
    updateProfile,
    renderAchievements,
    renderLeaderboard,
    renderHistory,
    showNotification,
    updateBalanceDisplay,
    getRankName,
    calculateLuck,
    formatDate,
    formatNumber
};