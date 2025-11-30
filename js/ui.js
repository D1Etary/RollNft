// ФУНКЦИИ ОБНОВЛЕНИЯ ИНТЕРФЕЙСА
function updateUI() {
    // Обновляем данные из Telegram при каждом обновлении UI
    userData = DB.updateFromTelegram();
    topstars.textContent = userData.stars.toLocaleString();
    username.textContent = userData.username;
    userLevel.textContent = `Уровень ${userData.level} • Элита`;
    
    // Обновляем аватар
    const avatar = document.getElementById('avatar');
    if (avatar) {
        avatar.src = userData.photoUrl;
        avatar.alt = userData.username;
    }

    // Обновляем статистику истории
    if (totalOpened) {
        totalOpened.textContent = userData.stats.totalOpened;
        totalSpent.textContent = userData.stats.totalSpent + '★';
    }
    
    // Обновляем историю если на странице истории
    if (historyList) {
        renderHistory();
    }
    
    // Обновляем профиль если на странице профиля
    if (profileName) {
        updateProfile();
    }
    
    // Обновляем рейтинг если на странице рейтинга
    if (leaderboardList) {
        renderLeaderboard();
    }
}

function updateProfile() {
    profileName.textContent = userData.username;
    profileLevel.textContent = userData.level;
    profileStars.textContent = userData.stars.toLocaleString();
    profileOpened.textContent = userData.stats.totalOpened;
    profileSpent.textContent = userData.stats.totalSpent + '★';
    profileLuck.textContent = userData.stats.luck;
    
    // Обновляем аватар в профиле
    const profileAvatar = document.querySelector('.profile-avatar');
    if (profileAvatar) {
        profileAvatar.src = userData.photoUrl;
        profileAvatar.alt = userData.username;
    }
    
    renderAchievements();
}

function renderAchievements() {
    const achievements = DB.getAchievements();
    achievementsGrid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = `achievement-item ${achievement.unlocked ? '' : 'achievement-locked'}`;
        achievementItem.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.desc}</div>
        `;
        achievementsGrid.appendChild(achievementItem);
    });
}

function renderLeaderboard() {
    const leaderboard = DB.getLeaderboard();
    leaderboardList.innerHTML = '';
    
    const currentUserId = localStorage.getItem('userId');
    
    leaderboard.forEach((player, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        const isCurrentUser = player.id === currentUserId;
        
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = `leaderboard-item ${isCurrentUser ? 'current-user-highlight' : ''}`;
        leaderboardItem.innerHTML = `
            <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
            <img class="leaderboard-avatar" src="${player.avatar}" alt="${player.name}">
            <div class="leaderboard-info">
                <div class="leaderboard-name">${player.name}</div>
                <div class="leaderboard-level">Уровень ${player.level}</div>
            </div>
            <div class="leaderboard-stats">
                <div class="leaderboard-stars">${player.stars.toLocaleString()}★</div>
                <div class="leaderboard-wins">${player.wins} побед</div>
            </div>
        `;
        leaderboardList.appendChild(leaderboardItem);
    });
}

function renderHistory() {
    historyList.innerHTML = '';
    
    if (userData.history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <div class="empty-history-icon">📭</div>
                <div>История открытий пуста</div>
                <div style="margin-top:10px;font-size:14px;color:var(--muted);">Откройте первый кейс чтобы начать историю!</div>
            </div>
        `;
        return;
    }
    
    userData.history.forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-icon">${record.icon}</div>
            <div class="history-info">
                <div class="history-case">${record.caseName}</div>
                <div class="history-prize">${record.prize}</div>
            </div>
            <div style="text-align:right;">
                <div class="history-stars">-${record.cost}★</div>
                <div class="history-date">${formatDate(record.date)}</div>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
}