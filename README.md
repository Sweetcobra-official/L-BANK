<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Л БАНК</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 400px;
            margin: 20px auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2, h3 {
            text-align: center;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
        }
        button:hover {
            background-color: #45a049;
        }
        .link {
            display: block;
            text-align: center;
            margin-top: 10px;
            text-decoration: none;
        }
        .notification {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            margin: 10px 0;
            text-align: center;
            border-radius: 4px;
        }
    </style>
</head>
<body>

<div class="container" id="authContainer">
    <h2>Л БАНК - Вход или Регистрация</h2>
    <div id="authForm">
        <input type="text" id="username" placeholder="Введите ник" required>
        <input type="password" id="password" placeholder="Введите пароль" required>
        <button onclick="login()">Войти</button>
        <a href="#" class="link" onclick="showRegister()">Нет аккаунта? Зарегистрироваться</a>
    </div>
    
    <div id="registerForm" style="display:none;">
        <input type="text" id="registerUsername" placeholder="Введите ник" required>
        <input type="password" id="registerPassword" placeholder="Введите пароль" required>
        <button onclick="register()">Зарегистрироваться</button>
        <a href="#" class="link" onclick="showLogin()">Уже есть аккаунт? Войти</a>
    </div>
</div>

<div class="container" id="mainContainer" style="display:none;">
    <h2>Л БАНК - Главная</h2>
    <h3>Ваш баланс: <span id="balance">0</span> леопаниксов</h3>
    <button onclick="showTransfer()">Перевести</button>
    <button onclick="showHistory()">История переводов</button>
    <div id="notification" class="notification" style="display:none;"></div>
</div>

<div class="container" id="transferContainer" style="display:none;">
    <h2>Перевод леопаниксов</h2>
    <input type="text" id="transferUsername" placeholder="Введите ник получателя" required>
    <input type="text" id="transferAmount" placeholder="Сумма" required>
    <button onclick="transfer()">Перевести</button>
    <button onclick="showMain()">Назад</button>
</div>

<div class="container" id="historyContainer" style="display:none;">
    <h2>История переводов</h2>
    <div id="history"></div>
    <button onclick="showMain()">Назад</button>
</div>

<script>
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let currentUser = null;

    function saveData() {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function showRegister() {
        document.getElementById('authForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }

    function showLogin() {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('authForm').style.display = 'block';
    }

    function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Проверка на администраторский аккаунт
    if (username === "Admin001" && password === "160419223456") {
        // Устанавливаем бесконечный баланс для админа
        currentUser = { username: "Admin001", password: "160419223456", balance: Infinity };
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        document.getElementById('balance').textContent = '∞'; // Отображаем бесконечный баланс
        return;
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        document.getElementById('balance').textContent = currentUser.balance; // Отображаем баланс пользователя
    } else {
        alert('Неверный ник или пароль');
    }
}

    function register() {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;

        if (users.some(u => u.username === username)) {
            alert('Этот ник уже занят, выберите другой');
            return;
        }

        const newUser = { username, password, balance: 0 };
        users.push(newUser);
        saveData();
        alert('Регистрация прошла успешно!');
        showLogin();
    }

    function showMain() {
        document.getElementById('transferContainer').style.display = 'none';
        document.getElementById('historyContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
    }

    function showTransfer() {
        document.getElementById('mainContainer').style.display = 'none';
        document.getElementById('transferContainer').style.display = 'block';
    }

    function transfer() {
    const recipientUsername = document.getElementById('transferUsername').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const recipient = users.find(u => u.username === recipientUsername);

    if (!recipient) {
        alert('Получатель не найден');
        return;
    }
    if (amount <= 0) {
        alert('Сумма перевода должна быть положительной');
        return;
    }
    
    if (currentUser.username === "Admin001") {
        // Если это администратор, переводим без проверки баланса
        recipient.balance += amount; // Увеличиваем баланс получателя
        transactions.push({
            from: currentUser.username,
            to: recipient.username,
            amount,
            date: new Date().toLocaleString()
        });
        saveData();
        document.getElementById('balance').textContent = '∞'; // Баланс админа всегда бесконечный
        showNotification(`Вы успешно перевели ${amount} леопаниксов пользователю ${recipient.username}`);
        return;
    }

    if (currentUser.balance < amount) {
        alert('Недостаточно средств для перевода');
        return;
    }

    currentUser.balance -= amount; // Уменьшаем баланс отправителя
    recipient.balance += amount; // Увеличиваем баланс получателя

    transactions.push({
        from: currentUser.username,
        to: recipient.username,
        amount,
        date: new Date().toLocaleString()
    });

    saveData(); // Сохраняем данные
    document.getElementById('balance').textContent = currentUser.balance; // Обновление отображения баланса
    showNotification(`Вы успешно перевели ${amount} леопаниксов пользователю ${recipient.username}`);
}


    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function showHistory() {
        document.getElementById('mainContainer').style.display = 'none';
        document.getElementById('historyContainer').style.display = 'block';

        const historyDiv = document.getElementById('history');
        historyDiv.innerHTML = '';

        const userTransactions = transactions.filter(t => t.from === currentUser.username || t.to === currentUser.username);
        userTransactions.forEach(t => {
            historyDiv.innerHTML += `<p>От: ${t.from}, Кому: ${t.to}, Сумма: ${t.amount}, Дата: ${t.date}</p>`;
        });
    }
</script>

</body>
</html>
