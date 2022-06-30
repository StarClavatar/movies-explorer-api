const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const AppErrors = require('../appErrors/appErrors');
const BadRequestErr = require('../appErrors/bad-request-error');
const NotFoundErr = require('../appErrors/not-found-err');
const NotUniqueEmailErr = require('../appErrors/not-unique-email');
const AuthError = require('../appErrors/auth-error');

const fields = '-__v';

function getUserById(userId) {
  return new Promise((resolve, reject) => {
    // ищем в БД по идентификатору
    User.findById(userId, fields, { runValidators: true })
      .then((result) => {
        if (!result) reject(new NotFoundErr(AppErrors.ERROR_USER_NOT_FOUND));
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}

// загрузка информации о текущем пользователе
module.exports.getMe = (req, res, next) => {
  getUserById(req.user._id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

// обновление пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, email },
    { new: true, runValidators: true, fields },
  )
    .then((result) => {
      if (!result) throw new NotFoundErr(AppErrors.ERROR_USER_NOT_FOUND);
      return res.send(result);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new BadRequestErr(AppErrors.ERROR_EDIT_USER_PARAMS));
      if (err.codeName === 'DuplicateKey') return next(new NotUniqueEmailErr(AppErrors.ERROR_EMAIL_ALREDY_EXISTS));
      return next(err);
    });
};

// создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((result) => {
          res.send({
            _id: result._id, name, email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new NotUniqueEmailErr(AppErrors.ERROR_EMAIL_ALREDY_EXISTS));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestErr(AppErrors.ERROR_NEW_USER_PARAMS));
          }
          return next(err);
        });
    });
};

// обработка логина
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new AuthError(AppErrors.ERROR_LOGIN));
    });
};
