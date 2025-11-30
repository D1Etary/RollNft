// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
let currentOpeningCase = null;
let countdownInterval = null;
let currentCasePrice = 0;
let userData = null;
let currentLeaderboardTab = 'stars';

// DOM ЭЛЕМЕНТЫ
const caseFullscreen = document.getElementById('case-fullscreen');
const caseTitle = document.getElementById('case-title');
const caseClose = document.getElementById('case-close');
const caseOpenBtn = document.getElementById('case-open-btn');
const casePriceValue = document.getElementById('case-price-value');
const prizesGrid = document.getElementById('prizes-grid');
const allPrizesGrid = document.getElementById('all-prizes-grid');
const caseOpeningAnimation = document.getElementById('case-opening-animation');
const countdownElement = document.getElementById('countdown');
const quickOpeningBtn = document.getElementById('quick-opening');
const prizeReveal = document.getElementById('prize-reveal');
const revealPrizeIcon = document.getElementById('reveal-prize-icon');
const revealName = document.getElementById('reveal-name');
const revealContinue = document.getElementById('reveal-continue');
const topstars = document.getElementById('topstars');
const username = document.getElementById('username');
const userLevel = document.querySelector('.user-level');
const historyList = document.getElementById('history-list');
const totalOpened = document.getElementById('total-opened');
const totalSpent = document.getElementById('total-spent');
const leaderboardList = document.getElementById('leaderboard-list');
const leaderboardTabs = document.querySelectorAll('.leaderboard-tab');
const profileName = document.getElementById('profile-name');
const profileLevel = document.getElementById('profile-level');
const profileStars = document.getElementById('profile-stars');
const profileOpened = document.getElementById('profile-opened');
const profileSpent = document.getElementById('profile-spent');
const profileLuck = document.getElementById('profile-luck');
const achievementsGrid = document.getElementById('achievements-grid');

// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
function init() {
    // Инициализируем Telegram Web App если доступен
    if (window.Telegram && Telegram.WebApp) {
        initTelegramWebApp();
    }
    userData = DB.init();
    updateUI();
    renderCases();
    setupEventListeners();
}

// НАСТРОЙКА СОБЫТИЙ
function setupEventListeners() {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.app').forEach(p => p.style.display = 'none');
            const page = document.getElementById(btn.dataset.page);
            page.style.display = 'block';
            
            // Обновляем UI при переходе на страницу
            if (btn.dataset.page === 'page-history' || btn.dataset.page === 'page-profile' || btn.dataset.page === 'page-rate') {
                updateUI();
            }
        });
    });

    // Табы рейтинга
    leaderboardTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            leaderboardTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentLeaderboardTab = tab.dataset.tab;
            renderLeaderboard();
        });
    });

    caseClose.addEventListener('click', closeCaseFullscreen);
    caseOpenBtn.addEventListener('click', startCaseOpening);
    quickOpeningBtn.addEventListener('click', skipOpeningAnimation);
    revealContinue.addEventListener('click', continueAfterReveal);
}

// ИНИЦИАЛИЗАЦИЯ TELEGRAM WEB APP
function initTelegramWebApp() {
    const tg = Telegram.WebApp;
    
    // Расширяем на весь экран
    tg.expand();
    
    // Настраиваем тему
    tg.setHeaderColor('#1a2229');
    tg.setBackgroundColor('#0f1419');
}

// ЗАПУСК ПРИЛОЖЕНИЯ
init();