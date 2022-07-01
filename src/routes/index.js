const router = require('express').Router();
// подключаем валидацию создания пользователя и логина
const {
  validationCreateUser,
  validationLogin,
} = require('../middlewares/validation');
const NotFoundError = require('../appErrors/not-found-err');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const AppErrors = require('../appErrors/appErrors');

// роут для тестирования падения и восстановления средствами pm2
// router.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// доступ к авторизации и созданию пользователя
router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

// проверяем авторизацию
router.use(auth);

// доступные роуты после авторизации
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

// обрабатываем все неизвестные роуты
router.use((req, res, next) => next(new NotFoundError(AppErrors.ERROR_BAD_REQUEST)));

// экспортируем router
module.exports = router;
