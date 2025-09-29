**Установка и запуск**
1. Клонирование репозитория
git clone https://github.com/Sealal07/electronik_react_flask.git
cd electronik_react_flask
2. Настройка бэкенда 

# Переходим в папку бэкенда
cd backend

# Создаем виртуальное окружение
python -m venv venv

# Активируем виртуальное окружение
# Для Windows:
venv\Scripts\activate
# Для Linux/Mac:
source venv/bin/activate

# Устанавливаем зависимости
pip install -r requirements.txt

3.Настройка базы данных
Создайте файл .env в папке backend:

env
DATABASE_URL=sqlite:///catalog.db
SECRET_KEY=flask-key-4590
JWT_SECRET_KEY=abradabra12htufjukij59704jukbmfh

4. Запуск бэкенда

# Из папки backend
python app.py
Сервер запустится на http://localhost:5000

5. Настройка фронтенда
Откройте новый терминал и перейдите в папку фронтенда:


# Из корневой папки проекта
cd catalog

# Устанавливаем зависимости
npm install


6. Запуск фронтенда

# Из папки catalog
npm start
Приложение запустится на http://localhost:3000

