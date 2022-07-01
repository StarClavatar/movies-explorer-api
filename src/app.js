const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const errorsProc = require('./appErrors/errors_processing');
const rateLimiter = require('./middlewares/rateLimiter');

// читаем переменные окружения из .env файла
require('dotenv').config();

const { PORT = 3000 } = process.env;
const { MONGOADDRESS = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;

const app = express();

// подключаем логгер запросов
app.use(requestLogger);

// подключаем ограничитель количества запросов
app.use(rateLimiter);

// подключаем обработку CORS
app.use(cors);

// подключаем helmet для автоматической установки заголовков безопасности
app.use(helmet());

// подключаем библиотеки парсинга тела запроса и параметров
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// подключаемся к БД MongoDB
mongoose.connect(MONGOADDRESS);

// подключаем роутинг
app.use(routes);

// подключаем логгер ошибок
app.use(errorLogger);

// обработчики ошибок предварительной валидации
app.use(errors()); // обработчик ошибок celebrate.

// централизованный обработчик ошибок
app.use(errorsProc);

// обрабатываем незавершенные запросы
app.use((req, res) => {
  if (!res.headersSent) res.send();
});

// начинаем прослушивание порта
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
