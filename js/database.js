// БАЗА ДАННЫХ - localStorage с уникальными ID
const DB = {
    // Инициализация базы данных
    init() {
        // Генерируем уникальный ID для пользователя если его нет
        if (!localStorage.getItem('userId')) {
            localStorage.setItem('userId', 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
        }

        // Инициализация данных пользователя
        if (!localStorage.getItem('userData')) {
            const userData = {
                id: localStorage.getItem('userId'),
                username: 'ProPlayer',
                level: 15,
                stars: 12450,
                history: [],
                stats: {
                    totalOpened: 0,
                    totalSpent: 0,
                    luck: '12.5%'
                }
            };
            localStorage.setItem('userData', JSON.stringify(userData));
        }

        // Инициализация рейтинга
        if (!localStorage.getItem('leaderboard')) {
            const leaderboard = [
                { id: 'user_1', name: 'ProPlayer', level: 15, stars: 12500, wins: 42, avatar: 'https://via.placeholder.com/40' },
                { id: 'user_2', name: 'CaseMaster', level: 14, stars: 9800, wins: 38, avatar: 'https://via.placeholder.com/40' },
                { id: 'user_3', name: 'LuckyGuy', level: 13, stars: 8700, wins: 35, avatar: 'https://via.placeholder.com/40' },
                { id: 'user_4', name: 'StarHunter', level: 12, stars: 7600, wins: 31, avatar: 'https://via.placeholder.com/40' },
                { id: 'user_5', name: 'GiftOpener', level: 12, stars: 6500, wins: 28, avatar: 'https://via.placeholder.com/40' },
                { id: 'user_6', name: 'Winner2024', level: 11, stars: 5400, wins: 25, avatar: 'https://via.placeholder.com/40' },
                { id: 'user_7', name: 'CaseKing', level: 11, stars: 4800, wins: 22, avatar: 'https://via.placeholder.com/40' },
                { id: 'user_8', name: 'LootMaster', level: 10, stars: 4200, wins: 20, avatar: 'https://via.placeholder.com/40' },
                { id: 'user_9', name: 'GamerPro', level: 10, stars: 3800, wins: 18, avatar: 'https://via.placeholder.com/40' },
                { id: 'user_10', name: 'NewPlayer', level: 9, stars: 3200, wins: 15, avatar: 'https://via.placeholder.com/40' }
            ];
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        }

        // Инициализация достижений
        if (!localStorage.getItem('achievements')) {
            const achievements = [
                { id: 1, name: 'Первый кейс', desc: 'Открой свой первый кейс', icon: '🎁', unlocked: true },
                { id: 2, name: 'Новичок', desc: 'Открой 10 кейсов', icon: '⭐', unlocked: true },
                { id: 3, name: 'Опытный', desc: 'Открой 50 кейсов', icon: '🏆', unlocked: false },
                { id: 4, name: 'Мастер', desc: 'Открой 100 кейсов', icon: '👑', unlocked: false },
                { id: 5, name: 'Легенда', desc: 'Открой 500 кейсов', icon: '💎', unlocked: false },
                { id: 6, name: 'Удачливый', desc: 'Выиграй легендарный приз', icon: '🍀', unlocked: false }
            ];
            localStorage.setItem('achievements', JSON.stringify(achievements));
        }

        return this.getUserData();
    },

    // Получить данные пользователя
    getUserData() {
        return JSON.parse(localStorage.getItem('userData'));
    },

    // Обновить данные пользователя
    updateUserData(data) {
        localStorage.setItem('userData', JSON.stringify(data));
    },

    // Добавить запись в историю
    addHistory(record) {
        const userData = this.getUserData();
        userData.history.unshift(record);
        userData.stats.totalOpened++;
        userData.stats.totalSpent += record.cost;
        this.updateUserData(userData);
        return userData;
    },

    // Обновить количество звезд
    updateStars(amount) {
        const userData = this.getUserData();
        userData.stars = amount;
        this.updateUserData(userData);
        return userData;
    },

    // Получить рейтинг
    getLeaderboard() {
        return JSON.parse(localStorage.getItem('leaderboard'));
    },

    // Получить достижения
    getAchievements() {
        return JSON.parse(localStorage.getItem('achievements'));
    }
};