// cases.js - АДАПТИРОВАННЫЙ ДЛЯ TELEGRAM MINI APP

// ДАННЫЕ КЕЙСОВ И ПРИЗОВ
const demoCases = [
    { 
        id: 1,
        title: 'Dragon Case', 
        price: 199, 
        badge: 'NEW', 
        type: 'new',
        image: 'assets/images/case-dragon.jpg',
        description: 'Драконий кейс с мифическими предметами',
        rarity: 'epic'
    },
    { 
        id: 2,
        title: 'Cyber Case', 
        price: 299, 
        badge: 'LIMITED', 
        type: 'limit',
        image: 'assets/images/case-cyber.jpg',
        description: 'Киберпанк кейс с технологичными предметами',
        rarity: 'legendary'
    },
    { 
        id: 3,
        title: 'Mystery Box', 
        price: 149,
        image: 'assets/images/case-mystery.jpg',
        description: 'Таинственная коробка с сюрпризами',
        rarity: 'rare'
    },
    { 
        id: 4,
        title: 'Legend Chest', 
        price: 399, 
        badge: 'HOT', 
        type: 'limit',
        image: 'assets/images/case-legend.jpg',
        description: 'Легендарный сундук с эксклюзивными наградами',
        rarity: 'legendary'
    }
];

const casePrizes = {
    'Dragon Case': [
        { name: 'Dragon Egg', icon: '🐉', chance: 0.1, isMain: true, rarity: 'legendary' },
        { name: 'Fire Sword', icon: '⚔️', chance: 1, rarity: 'epic' },
        { name: 'Scale Armor', icon: '🛡️', chance: 5, rarity: 'rare' },
        { name: 'Magic Potion', icon: '🧪', chance: 10, rarity: 'common' },
        { name: 'Gold Coin', icon: '🪙', chance: 20, rarity: 'common' },
        { name: 'Dragon Tooth', icon: '🦷', chance: 30, rarity: 'common' },
        { name: 'Small Gem', icon: '💎', chance: 33.9, rarity: 'common' }
    ],
    'Cyber Case': [
        { name: 'Neon Bike', icon: '🏍️', chance: 0.2, isMain: true, rarity: 'legendary' },
        { name: 'Holo Glasses', icon: '🥽', chance: 1, rarity: 'epic' },
        { name: 'Laser Gun', icon: '🔫', chance: 5, rarity: 'rare' },
        { name: 'Tech Chip', icon: '💿', chance: 10, rarity: 'common' },
        { name: 'Battery Pack', icon: '🔋', chance: 20, rarity: 'common' },
        { name: 'Wire', icon: '🔌', chance: 30, rarity: 'common' },
        { name: 'Screw', icon: '🔩', chance: 33.8, rarity: 'common' }
    ],
    'Mystery Box': [
        { name: 'Mystery Key', icon: '🗝️', chance: 0.05, isMain: true, rarity: 'legendary' },
        { name: 'Treasure Map', icon: '🗺️', chance: 0.5, rarity: 'epic' },
        { name: 'Crystal Ball', icon: '🔮', chance: 2, rarity: 'rare' },
        { name: 'Old Book', icon: '📖', chance: 5, rarity: 'common' },
        { name: 'Candle', icon: '🕯️', chance: 15, rarity: 'common' },
        { name: 'Feather', icon: '🪶', chance: 25, rarity: 'common' },
        { name: 'Pebble', icon: '🪨', chance: 52.45, rarity: 'common' }
    ],
    'Legend Chest': [
        { name: 'Crown', icon: '👑', chance: 0.3, isMain: true, rarity: 'legendary' },
        { name: 'Royal Sword', icon: '⚔️', chance: 2, rarity: 'epic' },
        { name: 'Knight Armor', icon: '🛡️', chance: 5, rarity: 'rare' },
        { name: 'Gold Bar', icon: '🪙', chance: 10, rarity: 'common' },
        { name: 'Silver Coin', icon: '💰', chance: 20, rarity: 'common' },
        { name: 'Scroll', icon: '📜', chance: 30, rarity: 'common' },
        { name: 'Quill', icon: '🪶', chance: 32.7, rarity: 'common' }
    ]
};

// Глобальные переменные для прокрутки
let currentWinningPrize = null;
let scrollAnimationInterval = null;
let scrollVelocity = 50;
let scrollPosition = 0;
let isScrolling = false;

// БАЗА ДАННЫХ КЕЙСОВ ДЛЯ TELEGRAM MINI APP
const DB = {
    // Получение всех кейсов
    getCases: function() {
        return demoCases.map(caseItem => ({
            ...caseItem,
            prizes: casePrizes[caseItem.title] || []
        }));
    },

    // Получение кейса по ID
    getCaseById: function(id) {
        const caseItem = demoCases.find(c => c.id === id);
        if (caseItem) {
            return {
                ...caseItem,
                prizes: casePrizes[caseItem.title] || []
            };
        }
        return null;
    },

    // Получение кейса по названию
    getCaseByName: function(name) {
        const caseItem = demoCases.find(c => c.title === name);
        if (caseItem) {
            return {
                ...caseItem,
                prizes: casePrizes[name] || []
            };
        }
        return null;
    },

    // Получение призов для кейса
    getPrizesForCase: function(caseName) {
        return casePrizes[caseName] || [];
    },

    // Инициализация пользовательских данных
    initUserData: function() {
        let userData = localStorage.getItem('telegramCaseUserData');
        if (!userData) {
            userData = {
                id: Date.now(),
                stars: 1000,
                level: 1,
                casesOpened: 0,
                starsSpent: 0,
                history: [],
                achievements: []
            };
            this.saveUserData(userData);
        } else {
            userData = JSON.parse(userData);
        }
        return userData;
    },

    // Сохранение данных пользователя
    saveUserData: function(userData) {
        localStorage.setItem('telegramCaseUserData', JSON.stringify(userData));
        return userData;
    },

    // Обновление звезд
    updateStars: function(newStars) {
        const userData = this.initUserData();
        userData.stars = newStars;
        return this.saveUserData(userData);
    },

    // Добавление в историю
    addHistory: function(historyRecord) {
        const userData = this.initUserData();
        userData.history.unshift(historyRecord);
        userData.casesOpened = (userData.casesOpened || 0) + 1;
        userData.starsSpent = (userData.starsSpent || 0) + historyRecord.cost;
        return this.saveUserData(userData);
    },

    // Получение лидерборда
    getLeaderboard: function(type = 'stars') {
        // Заглушка для демо данных
        return [
            { id: 1, name: 'ProPlayer', stars: 12450, level: 15, wins: 89, avatar: 'assets/images/avatar1.jpg' },
            { id: 2, name: 'DragonSlayer', stars: 9870, level: 14, wins: 76, avatar: 'assets/images/avatar2.jpg' },
            { id: 3, name: 'CyberNinja', stars: 8450, level: 13, wins: 64, avatar: 'assets/images/avatar3.jpg' },
            { id: 4, name: 'MysteryHunter', stars: 7230, level: 12, wins: 58, avatar: 'assets/images/avatar4.jpg' },
            { id: 5, name: 'LegendKeeper', stars: 6540, level: 11, wins: 52, avatar: 'assets/images/avatar5.jpg' }
        ].sort((a, b) => b[type] - a[type]);
    },

    // Получение достижений
    getAchievements: function() {
        return [
            { id: 1, name: 'Первый кейс', icon: '🎯', description: 'Открой свой первый кейс' },
            { id: 2, name: 'Коллекционер', icon: '📦', description: 'Открой 10 кейсов' },
            { id: 3, name: 'Ветеран', icon: '⭐', description: 'Открой 50 кейсов' },
            { id: 4, name: 'Легенда', icon: '👑', description: 'Открой 100 кейсов' },
            { id: 5, name: 'Удачливый', icon: '🍀', description: 'Выиграй легендарный предмет' },
            { id: 6, name: 'Богатый', icon: '💰', description: 'Накопи 10,000 звезд' }
        ];
    }
};

// ФУНКЦИИ ДЛЯ РАБОТЫ С КЕЙСАМИ
function makeCard(caseData) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
        <div class="topimg">
            <img class="case" src="${caseData.image}" alt="${caseData.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iMTIiIGZpbGw9IiMyNDgxY2MiLz4KPHN2ZyB4PSIzMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE5LjUgMTIuOTVIMTMuODVWMTkuNUgxMC4xNVYxMi45NUg0LjVWOS42NUgxMC4xNVYzSDEzLjg1VjkuNjVIMTkuNVYxMi45NVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K'">
        </div>
        <div>
            <div style="display:flex;align-items:center;justify-content:space-between">
                <div style="font-weight:700;color:var(--tg-dark-hint);opacity:.9">${caseData.title}</div>
                ${caseData.badge ? `<div class="${caseData.type === 'new' ? 'new-pill' : 'limit-pill'}">${caseData.badge}</div>` : ''}
            </div>
            <div class="meta">
                <div style="font-size:13px;color:var(--tg-dark-hint)">${caseData.description || 'Эксклюзивный кейс'}</div>
                <div class="price">★ ${caseData.price}</div>
            </div>
        </div>
    `;
    
    div.addEventListener('click', () => {
        openCaseFullscreen(caseData);
    });
    
    return div;
}

function renderCases() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const cases = DB.getCases();
    cases.forEach(caseData => {
        grid.appendChild(makeCard(caseData));
    });
}

function openCaseFullscreen(caseData) {
    if (!window.caseTitle || !window.casePriceValue || !window.caseFullscreen) return;
    
    window.caseTitle.textContent = caseData.title;
    window.casePriceValue.textContent = caseData.price;
    window.currentCasePrice = caseData.price;
    window.currentOpeningCase = caseData.title;
    window.caseFullscreen.style.display = 'flex';
    window.caseFullscreen.classList.add('active');
    
    fillPrizesGrid(caseData.title);
    
    // Проверяем хватает ли звезд
    if (window.userData && window.userData.stars < caseData.price) {
        if (window.caseOpenBtn) {
            window.caseOpenBtn.disabled = true;
            window.caseOpenBtn.textContent = 'Недостаточно звезд';
        }
    } else {
        if (window.caseOpenBtn) {
            window.caseOpenBtn.disabled = false;
            window.caseOpenBtn.textContent = 'OPEN';
        }
    }
    
    // Показ кнопки "Назад" в Telegram
    if (window.tg) {
        window.tg.BackButton.show();
    }
}

function fillPrizesGrid(caseName) {
    const prizes = DB.getPrizesForCase(caseName);
    if (!window.prizesGrid || !window.allPrizesGrid) return;
    
    // Лучшие призы (легендарные и эпические)
    window.prizesGrid.innerHTML = '';
    const bestPrizes = prizes.filter(p => p.rarity === 'legendary' || p.rarity === 'epic');
    
    bestPrizes.forEach(prize => {
        const prizeItem = document.createElement('div');
        prizeItem.className = `prize-item ${prize.rarity === 'legendary' ? 'main-prize' : ''}`;
        prizeItem.innerHTML = `
            <div class="prize-icon">${prize.icon}</div>
            <div class="prize-name">${prize.name}</div>
            <div class="prize-chance">${prize.chance}%</div>
        `;
        window.prizesGrid.appendChild(prizeItem);
    });
    
    // Все призы
    window.allPrizesGrid.innerHTML = '';
    prizes.forEach(prize => {
        const prizeItem = document.createElement('div');
        prizeItem.className = `prize-item ${prize.rarity === 'legendary' ? 'main-prize' : ''}`;
        prizeItem.innerHTML = `
            <div class="prize-icon">${prize.icon}</div>
            <div class="prize-name">${prize.name}</div>
            <div class="prize-chance">${prize.chance}%</div>
        `;
        window.allPrizesGrid.appendChild(prizeItem);
    });
}

function closeCaseFullscreen() {
    if (window.caseFullscreen) {
        window.caseFullscreen.style.display = 'none';
        window.caseFullscreen.classList.remove('active');
    }
    
    if (window.caseOpenBtn) {
        window.caseOpenBtn.style.display = 'block';
    }
    
    // Останавливаем прокрутку если активна
    if (isScrolling) {
        stopScrollAnimation();
    }
    
    // Скрытие кнопки "Назад" если мы на главной
    if (window.tg && document.getElementById('page-main').style.display === 'block') {
        window.tg.BackButton.hide();
    }
}

function startCaseOpening() {
    if (!window.userData || window.userData.stars < window.currentCasePrice) {
        if (window.tg) {
            window.tg.showPopup({
                title: 'Недостаточно звезд',
                message: `Вам нужно ещё ${window.currentCasePrice - (window.userData?.stars || 0)}★ для открытия этого кейса`,
                buttons: [{ type: 'ok', text: 'Понятно' }]
            });
        }
        return;
    }
    
    if (window.caseFullscreen) {
        window.caseFullscreen.style.display = 'none';
        window.caseFullscreen.classList.remove('active');
    }
    
    if (window.caseOpeningAnimation) {
        window.caseOpeningAnimation.style.display = 'flex';
        window.caseOpeningAnimation.classList.add('active');
    }
    
    let count = 3;
    if (window.countdownElement) {
        window.countdownElement.textContent = count;
    }
    
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }
    
    window.countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            if (window.countdownElement) {
                window.countdownElement.textContent = count;
            }
        } else {
            clearInterval(window.countdownInterval);
            if (window.countdownElement) {
                window.countdownElement.textContent = 'GO!';
            }
            setTimeout(() => {
                if (window.caseOpeningAnimation) {
                    window.caseOpeningAnimation.style.display = 'none';
                    window.caseOpeningAnimation.classList.remove('active');
                }
                startPrizeScrollAnimation();
            }, 800);
        }
    }, 800);
}

// ФУНКЦИИ ПРОКРУТКИ ПРИЗОВ (упрощенная версия для Mini App)
function startPrizeScrollAnimation() {
    const prizes = DB.getPrizesForCase(window.currentOpeningCase);
    const prize = getRandomPrize(prizes);
    currentWinningPrize = prize;
    
    // В Mini App используем упрощенную анимацию без сложной прокрутки
    setTimeout(() => {
        finishCaseOpening();
    }, 1500);
}

function stopScrollAnimation() {
    if (scrollAnimationInterval) {
        clearInterval(scrollAnimationInterval);
        scrollAnimationInterval = null;
    }
    isScrolling = false;
}

function finishCaseOpening() {
    // Обновляем данные пользователя
    if (window.userData) {
        const newStars = window.userData.stars - window.currentCasePrice;
        window.userData = DB.updateStars(newStars);
        
        // Добавляем в историю
        const historyRecord = {
            caseName: window.currentOpeningCase,
            prize: currentWinningPrize.name,
            icon: currentWinningPrize.icon,
            cost: window.currentCasePrice,
            date: new Date().toISOString(),
            rarity: currentWinningPrize.rarity
        };
        window.userData = DB.addHistory(historyRecord);
    }
    
    // Показываем результат
    if (window.revealPrizeIcon && window.revealName && window.prizeReveal) {
        window.revealPrizeIcon.textContent = currentWinningPrize.icon;
        window.revealName.textContent = currentWinningPrize.name;
        window.prizeReveal.style.display = 'flex';
        window.prizeReveal.classList.add('active');
    }
    
    // Обновление UI
    if (window.updateUI) {
        window.updateUI();
    }
}

function continueAfterReveal() {
    if (window.prizeReveal) {
        window.prizeReveal.style.display = 'none';
        window.prizeReveal.classList.remove('active');
    }
    
    if (window.caseOpenBtn) {
        window.caseOpenBtn.style.display = 'block';
        window.caseOpenBtn.disabled = false;
        window.caseOpenBtn.textContent = 'OPEN';
    }
    
    // Возвращаемся к модальному окну кейса
    if (window.currentOpeningCase) {
        const caseData = DB.getCaseByName(window.currentOpeningCase);
        if (caseData) {
            openCaseFullscreen(caseData);
        }
    }
}

function getRandomPrize(prizes) {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const prize of prizes) {
        cumulative += prize.chance;
        if (random <= cumulative) {
            return prize;
        }
    }
    
    return prizes[prizes.length - 1];
}

function skipOpeningAnimation() {
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }
    
    if (window.caseOpeningAnimation) {
        window.caseOpeningAnimation.style.display = 'none';
        window.caseOpeningAnimation.classList.remove('active');
    }
    
    startPrizeScrollAnimation();
}

// ЭКСПОРТ ФУНКЦИЙ ДЛЯ ИСПОЛЬЗОВАНИЯ В APP.JS
window.Cases = {
    DB,
    renderCases,
    openCaseFullscreen,
    closeCaseFullscreen,
    startCaseOpening,
    continueAfterReveal,
    skipOpeningAnimation,
    getRandomPrize
};