// app.js - АДАПТИРОВАННЫЙ ДЛЯ TELEGRAM MINI APP

// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let currentOpeningCase = null;
let countdownInterval = null;
let currentCasePrice = 0;
let userData = null;
let currentLeaderboardTab = 'stars';
let tg = null;

// DOM ЭЛЕМЕНТЫ
let caseFullscreen, caseTitle, caseClose, caseOpenBtn, casePriceValue;
let prizesGrid, allPrizesGrid, caseOpeningAnimation, countdownElement;
let quickOpeningBtn, prizeReveal, revealPrizeIcon, revealName, revealContinue;
let topstars, username, userLevel, historyList, totalOpened, totalSpent;
let leaderboardList, leaderboardTabs, profileName, profileLevel;
let profileStars, profileOpened, profileSpent, profileLuck, achievementsGrid;

// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
function init() {
    // Инициализация Telegram Web App
    tg = window.Telegram.WebApp;
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Настройка кнопки "Назад"
    tg.BackButton.onClick(() => {
        if (caseFullscreen && caseFullscreen.style.display === 'flex') {
            closeCaseFullscreen();
        } else {
            navigateToPage('page-main');
        }
    });
    
    // Инициализация DOM элементов
    initDOMElements();
    
    // Инициализация данных
    userData = DB.init();
    
    // Обновление данных пользователя из Telegram
    updateTelegramUserData();
    
    // Обновление UI
    updateUI();
    renderCases();
    setupEventListeners();
    
    // Готовность Telegram
    tg.ready();
    
    console.log('Telegram Mini App initialized');
}

// ИНИЦИАЛИЗАЦИЯ DOM ЭЛЕМЕНТОВ
function initDOMElements() {
    caseFullscreen = document.getElementById('case-fullscreen');
    caseTitle = document.getElementById('case-title');
    caseClose = document.getElementById('case-close');
    caseOpenBtn = document.getElementById('case-open-btn');
    casePriceValue = document.getElementById('case-price-value');
    prizesGrid = document.getElementById('prizes-grid');
    allPrizesGrid = document.getElementById('all-prizes-grid');
    caseOpeningAnimation = document.getElementById('case-opening-animation');
    countdownElement = document.getElementById('countdown');
    quickOpeningBtn = document.getElementById('quick-opening');
    prizeReveal = document.getElementById('prize-reveal');
    revealPrizeIcon = document.getElementById('reveal-prize-icon');
    revealName = document.getElementById('reveal-name');
    revealContinue = document.getElementById('reveal-continue');
    topstars = document.getElementById('topstars');
    username = document.getElementById('username');
    userLevel = document.querySelector('.user-level');
    historyList = document.getElementById('history-list');
    totalOpened = document.getElementById('total-opened');
    totalSpent = document.getElementById('total-spent');
    leaderboardList = document.getElementById('leaderboard-list');
    leaderboardTabs = document.querySelectorAll('.leaderboard-tab');
    profileName = document.getElementById('profile-name');
    profileLevel = document.getElementById('profile-level');
    profileStars = document.getElementById('profile-stars');
    profileOpened = document.getElementById('profile-opened');
    profileSpent = document.getElementById('profile-spent');
    profileLuck = document.getElementById('profile-luck');
    achievementsGrid = document.getElementById('achievements-grid');
}

// ОБНОВЛЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ИЗ TELEGRAM
function updateTelegramUserData() {
    const telegramUser = tg.initDataUnsafe?.user;
    
    if (telegramUser) {
        // Обновление имени пользователя
        if (username) {
            username.textContent = telegramUser.first_name || 'Игрок';
            if (telegramUser.username) {
                username.textContent += ` (@${telegramUser.username})`;
            }
        }
        
        if (profileName) {
            profileName.textContent = telegramUser.first_name || 'Игрок';
        }
        
        // Обновление аватара
        if (telegramUser.photo_url) {
            const avatar = document.getElementById('avatar');
            const profileAvatar = document.getElementById('profile-avatar');
            if (avatar) avatar.src = telegramUser.photo_url;
            if (profileAvatar) profileAvatar.src = telegramUser.photo_url;
        }
        
        // Можно сохранить данные пользователя для дальнейшего использования
        if (userData) {
            userData.telegramId = telegramUser.id;
            userData.username = telegramUser.username;
            userData.firstName = telegramUser.first_name;
            userData.lastName = telegramUser.last_name;
        }
    }
}

// НАСТРОЙКА СОБЫТИЙ
function setupEventListeners() {
    // Навигация
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            navigateToPage(btn.dataset.page);
        });
    });

    // Табы рейтинга
    if (leaderboardTabs) {
        leaderboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                leaderboardTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentLeaderboardTab = tab.dataset.tab;
                renderLeaderboard();
            });
        });
    }

    // События кейсов
    if (caseClose) caseClose.addEventListener('click', closeCaseFullscreen);
    if (caseOpenBtn) caseOpenBtn.addEventListener('click', startCaseOpening);
    if (quickOpeningBtn) quickOpeningBtn.addEventListener('click', skipOpeningAnimation);
    if (revealContinue) revealContinue.addEventListener('click', continueAfterReveal);
    
    // Кнопка премиума
    const premiumButton = document.getElementById('premium-button');
    if (premiumButton) {
        premiumButton.addEventListener('click', showPremiumPopup);
    }
}

// НАВИГАЦИЯ МЕЖДУ СТРАНИЦАМИ
function navigateToPage(pageId) {
    // Обновление навигации
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.dataset.page === pageId) {
            btn.classList.add('active');
        }
    });
    
    // Переключение страниц
    document.querySelectorAll('.app').forEach(p => p.style.display = 'none');
    const page = document.getElementById(pageId);
    if (page) {
        page.style.display = 'block';
    }
    
    // Управление кнопкой "Назад" в Telegram
    if (pageId !== 'page-main') {
        tg.BackButton.show();
    } else {
        tg.BackButton.hide();
    }
    
    // Обновление данных страницы
    updatePageData(pageId);
}

// ОБНОВЛЕНИЕ ДАННЫХ КОНКРЕТНОЙ СТРАНИЦЫ
function updatePageData(pageId) {
    switch (pageId) {
        case 'page-history':
            updateHistoryPage();
            break;
        case 'page-profile':
            updateProfilePage();
            break;
        case 'page-rate':
            updateLeaderboardPage();
            break;
    }
}

// ОБНОВЛЕНИЕ ВСЕГО ИНТЕРФЕЙСА
function updateUI() {
    if (!userData) return;
    
    // Обновление звезд
    if (topstars) topstars.textContent = userData.stars.toLocaleString();
    if (profileStars) profileStars.textContent = userData.stars.toLocaleString();
    
    // Обновление уровня
    if (userLevel) userLevel.textContent = `Уровень ${userData.level} • ${getRankName(userData.level)}`;
    if (profileLevel) profileLevel.textContent = userData.level;
    
    // Обновление статистики профиля
    if (profileOpened) profileOpened.textContent = userData.casesOpened || 0;
    if (profileSpent) profileSpent.textContent = `${userData.starsSpent || 0}★`;
    if (profileLuck) profileLuck.textContent = `${calculateLuck()}%`;
    
    // Обновление истории
    updateHistoryPage();
    
    // Обновление рейтинга
    updateLeaderboardPage();
    
    // Обновление достижений
    updateAchievements();
}

// РЕНДЕРИНГ КЕЙСОВ
function renderCases() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    
    const cases = DB.getCases();
    grid.innerHTML = '';
    
    cases.forEach(caseItem => {
        const caseElement = document.createElement('div');
        caseElement.className = 'card';
        caseElement.innerHTML = `
            <div class="topimg">
                <img src="${caseItem.image}" alt="${caseItem.name}" class="case" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMTIiIGZpbGw9IiMyNDgxY2MiLz4KPHN2ZyB4PSIzMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE5LjUgMTIuOTVIMTMuODVWMTkuNUgxMC4xNVYxMi45NUg0LjVWOS42NUgxMC4xNVYzSDEzLjg1VjkuNjVIMTkuNVYxMi45NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K'">
            </div>
            <div class="meta">
                <div>${caseItem.name}</div>
                <div class="price">★ ${caseItem.price}</div>
            </div>
        `;
        
        caseElement.addEventListener('click', () => {
            openCaseFullscreen(caseItem);
        });
        
        grid.appendChild(caseElement);
    });
}

// ОТКРЫТИЕ МОДАЛЬНОГО ОКНА КЕЙСА
function openCaseFullscreen(caseItem) {
    if (!caseFullscreen || !caseTitle || !casePriceValue) return;
    
    currentOpeningCase = caseItem;
    currentCasePrice = caseItem.price;
    
    // Заполнение данных
    caseTitle.textContent = caseItem.name;
    casePriceValue.textContent = caseItem.price;
    
    // Обновление изображения кейса
    const caseImage = document.querySelector('.case-image img');
    if (caseImage) {
        caseImage.src = caseItem.image;
        caseImage.alt = caseItem.name;
    }
    
    // Отрисовка призов
    renderPrizesGrid(prizesGrid, caseItem.prizes.filter(p => p.rarity === 'legendary' || p.rarity === 'epic'));
    renderPrizesGrid(allPrizesGrid, caseItem.prizes);
    
    // Показ модального окна
    caseFullscreen.style.display = 'flex';
    caseFullscreen.classList.add('active');
    
    // Показ кнопки "Назад" в Telegram
    tg.BackButton.show();
}

// ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА КЕЙСА
function closeCaseFullscreen() {
    if (caseFullscreen) {
        caseFullscreen.style.display = 'none';
        caseFullscreen.classList.remove('active');
    }
    currentOpeningCase = null;
    
    // Скрытие кнопки "Назад" если мы на главной
    if (document.getElementById('page-main').style.display === 'block') {
        tg.BackButton.hide();
    }
}

// РЕНДЕРИНГ ПРИЗОВ
function renderPrizesGrid(container, prizes) {
    if (!container) return;
    
    container.innerHTML = '';
    
    prizes.forEach(prize => {
        const prizeElement = document.createElement('div');
        prizeElement.className = `prize-item ${prize.rarity === 'legendary' ? 'main-prize' : ''}`;
        prizeElement.innerHTML = `
            <div class="prize-icon">${getPrizeEmoji(prize.rarity)}</div>
            <div class="prize-name">${prize.name}</div>
            <div class="prize-chance">${prize.chance}%</div>
        `;
        container.appendChild(prizeElement);
    });
}

// НАЧАЛО ОТКРЫТИЯ КЕЙСА
function startCaseOpening() {
    if (!currentOpeningCase || !userData) return;
    
    // Проверка баланса
    if (userData.stars < currentCasePrice) {
        tg.showPopup({
            title: 'Недостаточно звезд',
            message: `Вам нужно ещё ${currentCasePrice - userData.stars}★ для открытия этого кейса`,
            buttons: [{ type: 'ok', text: 'Понятно' }]
        });
        return;
    }
    
    // Списание звезд
    userData.stars -= currentCasePrice;
    userData.starsSpent = (userData.starsSpent || 0) + currentCasePrice;
    userData.casesOpened = (userData.casesOpened || 0) + 1;
    
    // Сохранение данных
    DB.saveUserData(userData);
    
    // Закрытие модального окна
    closeCaseFullscreen();
    
    // Запуск анимации открытия
    showOpeningAnimation();
}

// ПОКАЗ АНИМАЦИИ ОТКРЫТИЯ
function showOpeningAnimation() {
    if (!caseOpeningAnimation) return;
    
    caseOpeningAnimation.style.display = 'flex';
    caseOpeningAnimation.classList.add('active');
    
    // Запуск обратного отсчета
    startCountdown();
}

// ОБРАТНЫЙ ОТСЧЕТ
function startCountdown() {
    if (!countdownElement) return;
    
    let count = 3;
    countdownElement.textContent = count;
    
    countdownInterval = setInterval(() => {
        count--;
        countdownElement.textContent = count;
        
        if (count <= 0) {
            clearInterval(countdownInterval);
            finishOpening();
        }
    }, 1000);
}

// ЗАВЕРШЕНИЕ ОТКРЫТИЯ
function finishOpening() {
    // Скрытие анимации
    if (caseOpeningAnimation) {
        caseOpeningAnimation.style.display = 'none';
        caseOpeningAnimation.classList.remove('active');
    }
    
    // Получение случайного приза
    const prize = getRandomPrize();
    
    // Сохранение в историю
    if (prize && currentOpeningCase) {
        const historyItem = {
            caseName: currentOpeningCase.name,
            prizeName: prize.name,
            prizeRarity: prize.rarity,
            timestamp: new Date().toISOString(),
            price: currentCasePrice
        };
        
        userData.history = userData.history || [];
        userData.history.unshift(historyItem);
        DB.saveUserData(userData);
    }
    
    // Показ выигрыша
    showPrizeReveal(prize);
}

// ПОЛУЧЕНИЕ СЛУЧАЙНОГО ПРИЗА
function getRandomPrize() {
    if (!currentOpeningCase) return null;
    
    const random = Math.random() * 100;
    let currentChance = 0;
    
    for (const prize of currentOpeningCase.prizes) {
        currentChance += prize.chance;
        if (random <= currentChance) {
            return prize;
        }
    }
    
    return currentOpeningCase.prizes[0];
}

// ПОКАЗ ВЫИГРЫША
function showPrizeReveal(prize) {
    if (!prizeReveal || !revealPrizeIcon || !revealName) return;
    
    revealPrizeIcon.textContent = getPrizeEmoji(prize.rarity);
    revealName.textContent = prize.name;
    
    prizeReveal.style.display = 'flex';
    prizeReveal.classList.add('active');
}

// ПРОДОЛЖИТЬ ПОСЛЕ ВЫИГРЫША
function continueAfterReveal() {
    if (prizeReveal) {
        prizeReveal.style.display = 'none';
        prizeReveal.classList.remove('active');
    }
    
    // Обновление UI
    updateUI();
}

// ПРОПУСТИТЬ АНИМАЦИЮ
function skipOpeningAnimation() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    if (caseOpeningAnimation) {
        caseOpeningAnimation.style.display = 'none';
        caseOpeningAnimation.classList.remove('active');
    }
    
    finishOpening();
}

// ОБНОВЛЕНИЕ СТРАНИЦЫ ИСТОРИИ
function updateHistoryPage() {
    if (!historyList || !totalOpened || !totalSpent) return;
    
    const history = userData.history || [];
    
    // Обновление статистики
    totalOpened.textContent = history.length;
    totalSpent.textContent = `${userData.starsSpent || 0}★`;
    
    // Отрисовка истории
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <div class="empty-history-icon">📭</div>
                <div>История открытий пуста</div>
            </div>
        `;
        return;
    }
    
    history.forEach(item => {
        const historyElement = document.createElement('div');
        historyElement.className = 'history-item';
        historyElement.innerHTML = `
            <div class="history-icon">${getPrizeEmoji(item.prizeRarity)}</div>
            <div class="history-info">
                <div class="history-case">${item.caseName}</div>
                <div class="history-prize">${item.prizeName}</div>
            </div>
            <div class="history-stats">
                <div class="history-stars">-${item.price}★</div>
                <div class="history-date">${formatDate(item.timestamp)}</div>
            </div>
        `;
        historyList.appendChild(historyElement);
    });
}

// ОБНОВЛЕНИЕ СТРАНИЦЫ ПРОФИЛЯ
function updateProfilePage() {
    // Данные уже обновляются в updateUI()
}

// ОБНОВЛЕНИЕ СТРАНИЦЫ РЕЙТИНГА
function updateLeaderboardPage() {
    if (!leaderboardList) return;
    
    const leaderboard = DB.getLeaderboard(currentLeaderboardTab);
    
    leaderboardList.innerHTML = '';
    
    leaderboard.forEach((user, index) => {
        const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        const isCurrentUser = user.id === userData.id;
        
        const leaderboardElement = document.createElement('div');
        leaderboardElement.className = `leaderboard-item ${isCurrentUser ? 'current-user-highlight' : ''}`;
        leaderboardElement.innerHTML = `
            <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
            <img src="${user.avatar}" alt="${user.name}" class="leaderboard-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMyNDgxY2MiLz4KPHBhdGggZD0iTTIwIDIyQzIyLjIwOTEgMjIgMjQgMjAuMjA5MSAyNCAxOEMyNCAxNS43OTA5IDIyLjIwOTEgMTQgMjAgMTRDMTcuNzkwOSAxNCAxNiAxNS43OTA5IDE2IDE4QzE2IDIwLjIwOTEgMTcuNzkwOSAyMiAyMCAyMloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNiAyNkMyNiAyOC4yMDkxIDIzLjMxMzcgMzAgMjAgMzBDMTYuNjg2MyAzMCAxNCAyOC4yMDkxIDE0IDI2QzE0IDIzLjc5MDkgMTYuNjg2MyAyMiAyMCAyMkMyMy4zMTM3IDIyIDI2IDIzLjc5MDkgMjYgMjZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'">
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.name}</div>
                <div class="leaderboard-level">Уровень ${user.level}</div>
            </div>
            <div class="leaderboard-stats">
                <div class="leaderboard-stars">${user.stars.toLocaleString()}★</div>
                <div class="leaderboard-wins">${user.wins} побед</div>
            </div>
        `;
        leaderboardList.appendChild(leaderboardElement);
    });
}

// ОБНОВЛЕНИЕ ДОСТИЖЕНИЙ
function updateAchievements() {
    if (!achievementsGrid) return;
    
    const achievements = DB.getAchievements();
    
    achievementsGrid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const isUnlocked = userData.achievements && userData.achievements.includes(achievement.id);
        
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${isUnlocked ? '' : 'achievement-locked'}`;
        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.description}</div>
        `;
        achievementsGrid.appendChild(achievementElement);
    });
}

// ПОКАЗ POPUP ПРЕМИУМА
function showPremiumPopup() {
    tg.showPopup({
        title: 'Премиум доступ',
        message: 'Хотите приобрести премиум доступ за 299₽?',
        buttons: [
            { id: 'buy', type: 'default', text: 'Купить' },
            { type: 'cancel', text: 'Отмена' }
        ]
    }, (buttonId) => {
        if (buttonId === 'buy') {
            tg.showAlert('Премиум доступ успешно активирован! 🎉');
            // Здесь можно добавить логику активации премиума
        }
    });
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function getPrizeEmoji(rarity) {
    const emojis = {
        common: '📦',
        rare: '🔷', 
        epic: '💜',
        legendary: '⭐'
    };
    return emojis[rarity] || '🎁';
}

function getRankName(level) {
    if (level < 5) return 'Новичок';
    if (level < 10) return 'Опытный';
    if (level < 15) return 'Эксперт';
    if (level < 20) return 'Мастер';
    return 'Легенда';
}

function calculateLuck() {
    const history = userData.history || [];
    if (history.length === 0) return 0;
    
    const legendaryWins = history.filter(item => item.prizeRarity === 'legendary').length;
    return Math.round((legendaryWins / history.length) * 100);
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ru-RU');
}

// ЗАПУСК ПРИЛОЖЕНИЯ ПРИ ЗАГРУЗКЕ DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Telegram Mini App...');
    init();
});

// ОБРАБОТКА ОШИБОК
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});