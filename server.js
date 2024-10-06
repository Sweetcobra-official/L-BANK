const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Простое хранилище для пользователей и транзакций
let users = [];
let transactions = [];

// Установка начального баланса для админа
users.push({ username: 'Admin001', password: '160419223456', balance: Infinity, history: [] });

// Регистрация нового пользователя
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ success: false, message: 'Этот ник уже занят, выберите другой' });
    }
    users.push({ username, password, balance: 0, history: [] });
    res.json({ success: true, message: 'Регистрация прошла успешно!' });
});

// Вход в аккаунт
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, user: { username: user.username, balance: user.balance } });
    } else {
        res.status(401).json({ success: false, message: 'Неверный ник или пароль' });
    }
});

// Перевод леопаниксов
app.post('/transfer', (req, res) => {
    const { from, to, amount } = req.body;
    const sender = users.find(u => u.username === from);
    const recipient = users.find(u => u.username === to);

    if (!recipient) {
        return res.status(400).json({ success: false, message: 'Пользователь не найден' });
    }

    // Обработка перевода
    if (from === 'Admin001') {
        // Админ всегда может переводить, у него бесконечный баланс
        transactions.push({ from, to, amount, date: new Date() });
        recipient.balance = (recipient.balance || 0) + amount;
        recipient.history.push({ from, to, amount, date: new Date() });
        return res.json({ success: true });
    }

    // Обычный пользователь
    if (!sender || sender.balance < amount) {
        return res.status(400).json({ success: false, message: 'Недостаточно средств' });
    }

    sender.balance -= amount;
    recipient.balance = (recipient.balance || 0) + amount;

    // Запись транзакции
    transactions.push({ from, to, amount, date: new Date() });
    sender.history.push({ from, to, amount, date: new Date() });
    recipient.history.push({ from, to, amount, date: new Date() });

    res.json({ success: true });
});

// Получение истории переводов
app.post('/history', (req, res) => {
    const { username } = req.body;
    const user = users.find(u => u.username === username);
    if (user) {
        res.json({ transactions: user.history });
    } else {
        res.status(400).json({ success: false, message: 'Пользователь не найден' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
