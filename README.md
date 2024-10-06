
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
    let currentUser = null;

    function showRegister() {
        document.getElementById('authForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }

    function showLogin() {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('authForm').style.display = 'block';
    }

    // Вход в аккаунт
    function login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('https://your-server.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                document.getElementById('authContainer').style.display = 'none';
                document.getElementById('mainContainer').style.display = 'block';
                document.getElementById('balance').textContent = currentUser.balance;
            } else {
                alert('Неверный ник или пароль');
            }
        });
    }

    // Регистрация нового пользователя
    function register() {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;

        fetch('https://your-server.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Регистрация прошла успешно!');
                showLogin();
            } else {
                alert('Ошибка регистрации: ' + data.message);
            }
        });
    }

    // Показать главную страницу
    function showMain() {
        document.getElementById('transferContainer').style.display = 'none';
        document.getElementById('historyContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
    }

    // Показать форму перевода
    function showTransfer() {
        document.getElementById('mainContainer').style.display = 'none';
        document.getElementById('transferContainer').style.display = 'block';
    }

    // Перевод леопаниксов
    function transfer() {
        const recipientUsername = document.getElementById('transferUsername').value;
        const amount = parseFloat(document.getElementById('transferAmount').value);

        if (isNaN(amount) || amount <= 0) {
            alert('Введите корректную сумму для перевода');
            return;
        }

        fetch('https://your-server.com/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: currentUser.username, to: recipientUsername, amount })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser.balance -= amount;
                document.getElementById('balance').textContent = currentUser.balance;
                showNotification(`Вы успешно перевели ${amount} леопаниксов пользователю ${recipientUsername}`);
            } else {
                alert('Ошибка перевода: ' + data.message);
            }
        });
    }

    // Показать уведомление
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Показать историю переводов
    function showHistory() {
        document.getElementById('mainContainer').style.display = 'none';
        document.getElementById('historyContainer').style.display = 'block';

        fetch('https://your-server.com/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUser.username })
        })
        .then(response => response.json())
        .then(data => {
            const historyDiv = document.getElementById('history');
            historyDiv.innerHTML = '';
            data.transactions.forEach(t => {
                historyDiv.innerHTML += `<p>От: ${t.from}, Кому: ${t.to}, Сумма: ${t.amount}, Дата: ${t.date}</p>`;
            });
        });
    }
</script>

</body>
</html>
