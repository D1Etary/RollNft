// database.js - АДАПТИРОВАННЫЙ ДЛЯ TELEGRAM MINI APP

// БАЗА ДАННЫХ - localStorage с интеграцией Telegram
const DB = {
    // Инициализация базы данных
    init() {
        console.log('Initializing database for Telegram Mini App...');
        
        // Получаем данные пользователя из Telegram
        const tg = window.Telegram?.WebApp;
        const telegramUser = tg?.initDataUnsafe?.user;
        
        // Генерируем уникальный ID для пользователя если его нет
        if (!localStorage.getItem('tg_userId')) {
            const userId = telegramUser?.id ? `tg_${telegramUser.id}` : 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('tg_userId', userId);
        }

        // Инициализация данных пользователя с учетом Telegram
        if (!localStorage.getItem('tg_userData')) {
            const userData = {
                id: localStorage.getItem('tg_userId'),
                telegramId: telegramUser?.id || null,
                username: telegramUser?.first_name || 'Игрок',
                firstName: telegramUser?.first_name || '',
                lastName: telegramUser?.last_name || '',
                username: telegramUser?.username || '',
                photoUrl: telegramUser?.photo_url || '',
                level: 1,
                stars: 1000, // Стартовый баланс
                casesOpened: 0,
                starsSpent: 0,
                history: [],
                achievements: [],
                joinDate: new Date().toISOString(),
                lastActive: new Date().toISOString()
            };
            localStorage.setItem('tg_userData', JSON.stringify(userData));
        } else {
            // Обновляем последнюю активность
            const userData = JSON.parse(localStorage.getItem('tg_userData'));
            userData.lastActive = new Date().toISOString();
            
            // Обновляем данные из Telegram если они доступны
            if (telegramUser) {
                userData.telegramId = telegramUser.id;
                userData.firstName = telegramUser.first_name || userData.firstName;
                userData.lastName = telegramUser.last_name || userData.lastName;
                userData.username = telegramUser.username || userData.username;
                userData.photoUrl = telegramUser.photo_url || userData.photoUrl;
                
                // Обновляем username для отображения
                if (telegramUser.first_name && userData.username !== telegramUser.first_name) {
                    userData.username = telegramUser.first_name;
                }
            }
            
            localStorage.setItem('tg_userData', JSON.stringify(userData));
        }

        // Инициализация рейтинга с Telegram-дружественными данными
        if (!localStorage.getItem('tg_leaderboard')) {
            const leaderboard = [
                { 
                    id: 'tg_1', 
                    name: 'ProPlayer', 
                    level: 15, 
                    stars: 12500, 
                    wins: 42, 
                    avatar: '',
                    telegramId: null
                },
                { 
                    id: 'tg_2', 
                    name: 'CaseMaster', 
                    level: 14, 
                    stars: 9800, 
                    wins: 38, 
                    avatar: '',
                    telegramId: null
                },
                { 
                    id: 'tg_3', 
                    name: 'LuckyGuy', 
                    level: 13, 
                    stars: 8700, 
                    wins: 35, 
                    avatar: '',
                    telegramId: null
                },
                { 
                    id: 'tg_4', 
                    name: 'StarHunter', 
                    level: 12, 
                    stars: 7600, 
                    wins: 31, 
                    avatar: '',
                    telegramId: null
                },
                { 
                    id: 'tg_5', 
                    name: 'GiftOpener', 
                    level: 12, 
                    stars: 6500, 
                    wins: 28, 
                    avatar: '',
                    telegramId: null
                },
                { 
                    id: 'tg_6', 
                    name: 'Winner2024', 
                    level: 11, 
                    stars: 5400, 
                    wins: 25, 
                    avatar: '',
                    telegramId: null
                },
                { 
                    id: 'tg_7', 
                    name: 'CaseKing', 
                    level: 11, 
                    stars: 4800, 
                    wins: 22, 
                    avatar: '',
                    telegramId: null
                },
                { 
                    id: 'tg_8', 
                    name: 'LootMaster', 
                    level: 10, 
                    stars: 4200, 
                    wins: 20, 
                    avatar: '',
                    telegramId: null
                },
                { 
                    id: 'tg_9', 
                    name: 'GamerPro', 
                    level: 10, 
                    stars: 3800, 
                    wins: 18, 
                    avatar: '',
                    telegramId: null
                },
                { 
                    id: 'tg_10', 
                    name: 'NewPlayer', 
                    level: 9, 
                    stars: 3200, 
                    wins: 15, 
                    avatar: '',
                    telegramId: null
                }
            ];
            localStorage.setItem('tg_leaderboard', JSON.stringify(leaderboard));
        }

        // Инициализация достижений
        if (!localStorage.getItem('tg_achievements')) {
            const achievements = [
                { 
                    id: 1, 
                    name: 'Первый кейс', 
                    description: 'Открой свой первый кейс', 
                    icon: '🎁', 
                    unlocked: false,
                    type: 'progress',
                    target: 1,
                    progress: 0
                },
                { 
                    id: 2, 
                    name: 'Коллекционер', 
                    description: 'Открой 10 кейсов', 
                    icon: '📦', 
                    unlocked: false,
                    type: 'progress',
                    target: 10,
                    progress: 0
                },
                { 
                    id: 3, 
                    name: 'Ветеран', 
                    description: 'Открой 50 кейсов', 
                    icon: '⭐', 
                    unlocked: false,
                    type: 'progress',
                    target: 50,
                    progress: 0
                },
                { 
                    id: 4, 
                    name: 'Легенда', 
                    description: 'Открой 100 кейсов', 
                    icon: '👑', 
                    unlocked: false,
                    type: 'progress',
                    target: 100,
                    progress: 0
                },
                { 
                    id: 5, 
                    name: 'Удачливый', 
                    description: 'Выиграй легендарный предмет', 
                    icon: '🍀', 
                    unlocked: false,
                    type: 'special',
                    target: 1,
                    progress: 0
                },
                { 
                    id: 6, 
                    name: 'Богатый', 
                    description: 'Накопи 10,000 звезд', 
                    icon: '💰', 
                    unlocked: false,
                    type: 'progress',
                    target: 10000,
                    progress: 0
                },
                { 
                    id: 7, 
                    name: 'Щедрый', 
                    description: 'Потрать 5,000 звезд', 
                    icon: '🎯', 
                    unlocked: false,
                    type: 'progress',
                    target: 5000,
                    progress: 0
                },
                { 
                    id: 8, 
                    name: 'Неутомимый', 
                    description: 'Открой 5 кейсов подряд', 
                    icon: '⚡', 
                    unlocked: false,
                    type: 'streak',
                    target: 5,
                    progress: 0
                }
            ];
            localStorage.setItem('tg_achievements', JSON.stringify(achievements));
        }

        // Инициализация кейсов (если нужно)
        if (!localStorage.getItem('tg_cases')) {
            const cases = [
                {
                    id: 1,
                    name: "Dragon Case",
                    price: 199,
                    image: "assets/images/case-dragon.jpg",
                    description: "Драконий кейс с мифическими предметами",
                    rarity: "epic",
                    available: true
                },
                {
                    id: 2,
                    name: "Cyber Case", 
                    price: 299,
                    image: "assets/images/case-cyber.jpg",
                    description: "Киберпанк кейс с технологичными предметами",
                    rarity: "legendary",
                    available: true
                },
                {
                    id: 3,
                    name: "Mystery Box",
                    price: 149,
                    image: "assets/images/case-mystery.jpg", 
                    description: "Таинственная коробка с сюрпризами",
                    rarity: "rare",
                    available: true
                },
                {
                    id: 4,
                    name: "Legend Chest",
                    price: 399,
                    image: "assets/images/case-legend.jpg",
                    description: "Легендарный сундук с эксклюзивными наградами", 
                    rarity: "legendary",
                    available: true
                }
            ];
            localStorage.setItem('tg_cases', JSON.stringify(cases));
        }

        console.log('Database initialized successfully');
        return this.getUserData();
    },

    // Получить данные пользователя
    getUserData() {
        const userData = JSON.parse(localStorage.getItem('tg_userData') || '{}');
        
        // Рассчитываем уровень на основе опыта (каждые 10 открытых кейсов = 1 уровень)
        const calculatedLevel = Math.floor((userData.casesOpened || 0) / 10) + 1;
        if (userData.level !== calculatedLevel) {
            userData.level = calculatedLevel;
            this.saveUserData(userData);
        }
        
        return userData;
    },

    // Сохранить данные пользователя
    saveUserData(data) {
        data.lastActive = new Date().toISOString();
        localStorage.setItem('tg_userData', JSON.stringify(data));
        
        // Проверяем и разблокируем достижения
        this.checkAchievements(data);
        
        return data;
    },

    // Обновить данные пользователя (alias для совместимости)
    updateUserData(data) {
        return this.saveUserData(data);
    },

    // Добавить запись в историю
    addHistory(record) {
        const userData = this.getUserData();
        
        userData.history.unshift({
            ...record,
            id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString()
        });
        
        // Ограничиваем историю последними 100 записями
        if (userData.history.length > 100) {
            userData.history = userData.history.slice(0, 100);
        }
        
        userData.casesOpened = (userData.casesOpened || 0) + 1;
        userData.starsSpent = (userData.starsSpent || 0) + (record.cost || 0);
        
        // Обновляем прогресс достижений
        this.updateAchievementProgress(userData, 'cases_opened', 1);
        
        // Проверяем на легендарный предмет
        if (record.rarity === 'legendary') {
            this.updateAchievementProgress(userData, 'legendary_wins', 1);
        }
        
        return this.saveUserData(userData);
    },

    // Обновить количество звезд
    updateStars(amount) {
        const userData = this.getUserData();
        userData.stars = amount;
        
        // Обновляем прогресс достижения "Богатый"
        if (amount >= 10000) {
            this.updateAchievementProgress(userData, 'rich', amount);
        }
        
        return this.saveUserData(userData);
    },

    // Получить рейтинг
    getLeaderboard(type = 'stars') {
        let leaderboard = JSON.parse(localStorage.getItem('tg_leaderboard') || '[]');
        
        // Добавляем текущего пользователя в рейтинг если его там нет
        const userData = this.getUserData();
        const userInLeaderboard = leaderboard.find(user => user.id === userData.id);
        
        if (!userInLeaderboard && userData.casesOpened > 0) {
            leaderboard.push({
                id: userData.id,
                name: userData.username,
                level: userData.level,
                stars: userData.stars,
                wins: userData.casesOpened,
                avatar: userData.photoUrl,
                telegramId: userData.telegramId
            });
            
            // Сортируем и ограничиваем топ-10
            leaderboard = leaderboard
                .sort((a, b) => b[type] - a[type])
                .slice(0, 10);
                
            localStorage.setItem('tg_leaderboard', JSON.stringify(leaderboard));
        }
        
        return leaderboard.sort((a, b) => b[type] - a[type]);
    },

    // Получить достижения
    getAchievements() {
        const achievements = JSON.parse(localStorage.getItem('tg_achievements') || '[]');
        const userData = this.getUserData();
        
        // Обновляем прогресс достижений
        return achievements.map(achievement => {
            let progress = 0;
            
            switch (achievement.id) {
                case 1: // Первый кейс
                case 2: // Коллекционер (10 кейсов)
                case 3: // Ветеран (50 кейсов) 
                case 4: // Легенда (100 кейсов)
                    progress = userData.casesOpened || 0;
                    break;
                case 5: // Удачливый (легендарный предмет)
                    const legendaryWins = userData.history?.filter(h => h.rarity === 'legendary').length || 0;
                    progress = legendaryWins;
                    break;
                case 6: // Богатый (10,000 звезд)
                    progress = userData.stars || 0;
                    break;
                case 7: // Щедрый (5,000 потраченных)
                    progress = userData.starsSpent || 0;
                    break;
                case 8: // Неутомимый (5 подряд)
                    // Простая реализация - считаем максимальную серию
                    progress = this.calculateOpenStreak(userData);
                    break;
            }
            
            return {
                ...achievement,
                progress: Math.min(progress, achievement.target),
                unlocked: progress >= achievement.target
            };
        });
    },

    // Получить кейсы
    getCases() {
        return JSON.parse(localStorage.getItem('tg_cases') || '[]');
    },

    // Получить кейс по ID
    getCaseById(id) {
        const cases = this.getCases();
        return cases.find(c => c.id === id);
    },

    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    
    // Проверить и разблокировать достижения
    checkAchievements(userData) {
        const achievements = this.getAchievements();
        let updated = false;
        
        achievements.forEach(achievement => {
            if (!achievement.unlocked) {
                let progress = 0;
                
                switch (achievement.id) {
                    case 1:
                    case 2: 
                    case 3:
                    case 4:
                        progress = userData.casesOpened || 0;
                        break;
                    case 5:
                        progress = userData.history?.filter(h => h.rarity === 'legendary').length || 0;
                        break;
                    case 6:
                        progress = userData.stars || 0;
                        break;
                    case 7:
                        progress = userData.starsSpent || 0;
                        break;
                    case 8:
                        progress = this.calculateOpenStreak(userData);
                        break;
                }
                
                if (progress >= achievement.target && !achievement.unlocked) {
                    achievement.unlocked = true;
                    updated = true;
                    
                    // Здесь можно добавить уведомление о разблокировке
                    console.log(`Achievement unlocked: ${achievement.name}`);
                }
            }
        });
        
        if (updated) {
            localStorage.setItem('tg_achievements', JSON.stringify(achievements));
        }
    },

    // Обновить прогресс достижения
    updateAchievementProgress(userData, achievementType, value) {
        // Реализация обновления прогресса достижений
        const achievements = this.getAchievements();
        // Логика обновления конкретных достижений...
    },

    // Рассчитать серию открытий
    calculateOpenStreak(userData) {
        const history = userData.history || [];
        if (history.length === 0) return 0;
        
        // Простая реализация - возвращаем общее количество открытий
        // В реальном приложении здесь была бы логика расчета серии
        return userData.casesOpened || 0;
    },

    // Сброс данных (для тестирования)
    resetData() {
        localStorage.removeItem('tg_userId');
        localStorage.removeItem('tg_userData');
        localStorage.removeItem('tg_leaderboard');
        localStorage.removeItem('tg_achievements');
        localStorage.removeItem('tg_cases');
        console.log('Database reset completed');
    },

    // Экспорт данных (для бекапа)
    exportData() {
        return {
            userData: this.getUserData(),
            leaderboard: this.getLeaderboard(),
            achievements: this.getAchievements(),
            cases: this.getCases()
        };
    },

    // Импорт данных
    importData(data) {
        if (data.userData) localStorage.setItem('tg_userData', JSON.stringify(data.userData));
        if (data.leaderboard) localStorage.setItem('tg_leaderboard', JSON.stringify(data.leaderboard));
        if (data.achievements) localStorage.setItem('tg_achievements', JSON.stringify(data.achievements));
        if (data.cases) localStorage.setItem('tg_cases', JSON.stringify(data.cases));
    }
};

// Экспорт для использования в других файлах
window.DB = DB;