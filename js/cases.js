// ДАННЫЕ КЕЙСОВ И ПРИЗОВ
const demoCases = [
    { title: 'Dragon Case', price: 199, badge: 'NEW', type: 'new' },
    { title: 'Cyber Case', price: 299, badge: 'LIMITED', type: 'limit' },
    { title: 'Mystery Box', price: 149 },
    { title: 'Legend Chest', price: 399, badge: 'HOT', type: 'limit' }
];

const casePrizes = {
    'Dragon Case': [
        { name: 'Dragon Egg', icon: '🐉', chance: '0.1%', isMain: true, rarity: 'legendary' },
        { name: 'Fire Sword', icon: '⚔️', chance: '1%', rarity: 'epic' },
        { name: 'Scale Armor', icon: '🛡️', chance: '5%', rarity: 'rare' },
        { name: 'Magic Potion', icon: '🧪', chance: '10%', rarity: 'common' },
        { name: 'Gold Coin', icon: '🪙', chance: '20%', rarity: 'common' },
        { name: 'Dragon Tooth', icon: '🦷', chance: '30%', rarity: 'common' },
        { name: 'Small Gem', icon: '💎', chance: '33.9%', rarity: 'common' }
    ],
    'Cyber Case': [
        { name: 'Neon Bike', icon: '🏍️', chance: '0.2%', isMain: true, rarity: 'legendary' },
        { name: 'Holo Glasses', icon: '🥽', chance: '1%', rarity: 'epic' },
        { name: 'Laser Gun', icon: '🔫', chance: '5%', rarity: 'rare' },
        { name: 'Tech Chip', icon: '💿', chance: '10%', rarity: 'common' },
        { name: 'Battery Pack', icon: '🔋', chance: '20%', rarity: 'common' },
        { name: 'Wire', icon: '🔌', chance: '30%', rarity: 'common' },
        { name: 'Screw', icon: '🔩', chance: '33.8%', rarity: 'common' }
    ],
    'Mystery Box': [
        { name: 'Mystery Key', icon: '🗝️', chance: '0.05%', isMain: true, rarity: 'legendary' },
        { name: 'Treasure Map', icon: '🗺️', chance: '0.5%', rarity: 'epic' },
        { name: 'Crystal Ball', icon: '🔮', chance: '2%', rarity: 'rare' },
        { name: 'Old Book', icon: '📖', chance: '5%', rarity: 'common' },
        { name: 'Candle', icon: '🕯️', chance: '15%', rarity: 'common' },
        { name: 'Feather', icon: '🪶', chance: '25%', rarity: 'common' },
        { name: 'Pebble', icon: '🪨', chance: '52.45%', rarity: 'common' }
    ],
    'Legend Chest': [
        { name: 'Crown', icon: '👑', chance: '0.3%', isMain: true, rarity: 'legendary' },
        { name: 'Royal Sword', icon: '⚔️', chance: '2%', rarity: 'epic' },
        { name: 'Knight Armor', icon: '🛡️', chance: '5%', rarity: 'rare' },
        { name: 'Gold Bar', icon: '🪙', chance: '10%', rarity: 'common' },
        { name: 'Silver Coin', icon: '💰', chance: '20%', rarity: 'common' },
        { name: 'Scroll', icon: '📜', chance: '30%', rarity: 'common' },
        { name: 'Quill', icon: '🪶', chance: '32.7%', rarity: 'common' }
    ]
};

// Глобальные переменные для прокрутки
let currentWinningPrize = null;
let scrollAnimationInterval = null;
let scrollVelocity = 50;
let scrollPosition = 0;
let isScrolling = false;

// ФУНКЦИИ ДЛЯ РАБОТЫ С КЕЙСАМИ
function makeCard(caseData) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
        <div class="topimg">
            <img class="case" src="assets/images/case-default.jpg" alt="${caseData.title}">
        </div>
        <div>
            <div style="display:flex;align-items:center;justify-content:space-between">
                <div style="font-weight:700;color:var(--muted);opacity:.9">${caseData.title}</div>
                ${caseData.badge ? `<div class="${caseData.type === 'new' ? 'new-pill' : 'limit-pill'}">${caseData.badge}</div>` : ''}
            </div>
            <div class="meta">
                <div style="font-size:13px;color:var(--muted)">${caseData.subtitle || 'Эксклюзив'}</div>
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
    grid.innerHTML = '';
    demoCases.forEach(caseData => {
        grid.appendChild(makeCard(caseData));
    });
}

function openCaseFullscreen(caseData) {
    caseTitle.textContent = caseData.title;
    casePriceValue.textContent = caseData.price;
    currentCasePrice = caseData.price;
    currentOpeningCase = caseData.title;
    caseFullscreen.classList.add('active');
    fillPrizesGrid(caseData.title);
    
    // Скрываем контейнер прокрутки при открытии кейса
    document.getElementById('prize-scroll-container').style.display = 'none';
    
    // Проверяем хватает ли звезд
    if (userData.stars < caseData.price) {
        caseOpenBtn.disabled = true;
        caseOpenBtn.textContent = 'Недостаточно звезд';
    } else {
        caseOpenBtn.disabled = false;
        caseOpenBtn.textContent = 'OPEN';
    }
}

function fillPrizesGrid(caseName) {
    const prizes = casePrizes[caseName];
    
    prizesGrid.innerHTML = '';
    const mainPrize = prizes.find(p => p.isMain);
    if (mainPrize) {
        const prizeItem = document.createElement('div');
        prizeItem.className = 'prize-item main-prize';
        prizeItem.innerHTML = `
            <div class="prize-icon">${mainPrize.icon}</div>
            <div class="prize-name">${mainPrize.name}</div>
            <div class="prize-chance">${mainPrize.chance}</div>
        `;
        prizesGrid.appendChild(prizeItem);
    }
    
    allPrizesGrid.innerHTML = '';
    prizes.forEach(prize => {
        const prizeItem = document.createElement('div');
        prizeItem.className = `prize-item ${prize.isMain ? 'main-prize' : ''}`;
        prizeItem.innerHTML = `
            <div class="prize-icon">${prize.icon}</div>
            <div class="prize-name">${prize.name}</div>
            <div class="prize-chance">${prize.chance}</div>
        `;
        allPrizesGrid.appendChild(prizeItem);
    });
}

function closeCaseFullscreen() {
    caseFullscreen.classList.remove('active');
    caseOpenBtn.style.display = 'block';
    // Останавливаем прокрутку если активна
    if (isScrolling) {
        stopScrollAnimation();
    }
}

function startCaseOpening() {
    if (userData.stars < currentCasePrice) return;
    
    caseFullscreen.classList.remove('active');
    caseOpeningAnimation.classList.add('active');
    
    let count = 3;
    countdownElement.textContent = count;
    
    countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownElement.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownElement.textContent = 'GO!';
            setTimeout(() => {
                caseOpeningAnimation.classList.remove('active');
                startPrizeScrollAnimation();
            }, 800);
        }
    }, 800);
}

// ФУНКЦИИ ПРОКРУТКИ ПРИЗОВ
function initPrizeScroll(caseName) {
    const scrollTrack = document.getElementById('scroll-track');
    const prizes = casePrizes[caseName];
    
    scrollTrack.innerHTML = '';
    
    // Создаем много копий призов для бесконечной прокрутки
    const totalCopies = 20;
    const totalItems = prizes.length * totalCopies;
    
    for (let i = 0; i < totalItems; i++) {
        const prize = prizes[i % prizes.length];
        const scrollItem = document.createElement('div');
        scrollItem.className = `scroll-item ${prize.isMain ? 'main-prize' : ''}`;
        scrollItem.innerHTML = `
            <div class="scroll-item-icon">${prize.icon}</div>
            <div class="scroll-item-name">${prize.name}</div>
            <div class="scroll-item-chance">${prize.chance}</div>
        `;
        scrollTrack.appendChild(scrollItem);
    }
    
    return prizes.length;
}

function startPrizeScrollAnimation() {
    const prizes = casePrizes[currentOpeningCase];
    const prize = getRandomPrize(prizes);
    currentWinningPrize = prize;
    
    // Находим индекс выигрышного приза
    const prizeIndex = prizes.findIndex(p => p.name === prize.name);
    
    // Инициализируем прокрутку
    const uniquePrizesCount = initPrizeScroll(currentOpeningCase);
    
    // Показываем контейнер прокрутки
    const scrollContainer = document.getElementById('prize-scroll-container');
    scrollContainer.style.display = 'block';
    
    // Запускаем анимацию прокрутки
    startScrollAnimation(prizeIndex, uniquePrizesCount);
}

function startScrollAnimation(winningPrizeIndex, uniquePrizesCount) {
    const scrollTrack = document.getElementById('scroll-track');
    const scrollItems = scrollTrack.querySelectorAll('.scroll-item');
    isScrolling = true;
    
    // Сбрасываем позицию и скорость
    scrollPosition = 0;
    scrollVelocity = 50;
    
    // Вычисляем позицию для остановки (центрируем выигрышный приз)
    const itemWidth = 140; // ширина элемента + margin
    const targetPosition = -(winningPrizeIndex * itemWidth + (10 * uniquePrizesCount * itemWidth));
    
    // Запускаем анимацию прокрутки
    scrollAnimationInterval = setInterval(() => {
        scrollPosition -= scrollVelocity;
        scrollTrack.style.transform = `translateX(${scrollPosition}px)`;
        
        // Постепенно замедляемся
        if (scrollPosition < targetPosition + 1000) {
            scrollVelocity = Math.max(1, scrollVelocity * 0.95);
        }
        
        // Останавливаемся когда достигли целевой позиции
        if (scrollVelocity <= 1.5 && scrollPosition <= targetPosition) {
            stopScrollAnimation();
            highlightWinningPrize();
        }
    }, 16);
}

function stopScrollAnimation() {
    if (scrollAnimationInterval) {
        clearInterval(scrollAnimationInterval);
        scrollAnimationInterval = null;
    }
    isScrolling = false;
}

function highlightWinningPrize() {
    const scrollTrack = document.getElementById('scroll-track');
    const scrollItems = scrollTrack.querySelectorAll('.scroll-item');
    
    // Находим центральный элемент и подсвечиваем его
    const centerIndex = Math.floor(scrollItems.length / 2);
    const centerItem = scrollItems[centerIndex];
    
    centerItem.classList.add('active');
    centerItem.classList.add('scroll-highlight');
    
    // Через 2 секунды показываем результат
    setTimeout(() => {
        finishCaseOpening();
    }, 2000);
}

function finishCaseOpening() {
    // Скрываем контейнер прокрутки
    document.getElementById('prize-scroll-container').style.display = 'none';
    
    // Обновляем данные пользователя
    const newStars = userData.stars - currentCasePrice;
    userData = DB.updateStars(newStars);
    
    // Добавляем в историю
    const historyRecord = {
        caseName: currentOpeningCase,
        prize: currentWinningPrize.name,
        icon: currentWinningPrize.icon,
        cost: currentCasePrice,
        date: new Date().toISOString()
    };
    userData = DB.addHistory(historyRecord);
    
    // Показываем результат
    revealPrizeIcon.textContent = currentWinningPrize.icon;
    revealName.textContent = currentWinningPrize.name;
    prizeReveal.classList.add('active');
    
    updateUI();
}

function continueAfterReveal() {
    prizeReveal.classList.remove('active');
    caseOpenBtn.style.display = 'block';
    caseOpenBtn.disabled = false;
    caseOpenBtn.textContent = 'OPEN';
    caseFullscreen.classList.add('active');
    
    // Сбрасываем состояние прокрутки
    const scrollTrack = document.getElementById('scroll-track');
    const scrollItems = scrollTrack.querySelectorAll('.scroll-item');
    scrollItems.forEach(item => {
        item.classList.remove('active');
        item.classList.remove('scroll-highlight');
    });
    scrollTrack.style.transform = 'translateX(0)';
}

function getRandomPrize(prizes) {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const prize of prizes) {
        cumulative += parseFloat(prize.chance);
        if (random <= cumulative) {
            return prize;
        }
    }
    
    return prizes[prizes.length - 1];
}

function skipOpeningAnimation() {
    clearInterval(countdownInterval);
    caseOpeningAnimation.classList.remove('active');
    startPrizeScrollAnimation();
}