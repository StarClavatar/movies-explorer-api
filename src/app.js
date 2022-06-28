const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

// читаем переменные окружения из .env файла
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

// подключаем логгер запросов
app.use(requestLogger);

// подключаем обработку CORS
app.use(cors);

// подключаем helmet для автоматической установки заголовков безопасности
app.use(helmet());

// подключаем библиотеки парсинга тела запроса и параметров
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// подключаемся к БД MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/moviesdb');

// подключаем роутинг
app.use(routes);

// подключаем логгер ошибок
app.use(errorLogger);

// обработчики ошибок предварительной валидации
app.use(errors()); // обработчик ошибок celebrate.

// централизованный обработчик ошибок
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

// обрабатываем незавершенные запросы
app.use((req, res) => {
  if (!res.headersSent) res.send();
});

// начинаем прослушивание порта
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
