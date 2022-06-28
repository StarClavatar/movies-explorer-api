const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const linkRegExp = /^https?:\/\/(www\.)?[\w\-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=]+\.[\w\-\._~:\/\?#\[\]@!\$&'\(\)\*\+,;=а-я]+#?/i;

const validationMongoId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationEditUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required().min(2),
    image: Joi.string().required().pattern(linkRegExp),
    trailerLink: Joi.string().required().pattern(linkRegExp),
    thumbnail: Joi.string().required().pattern(linkRegExp),
    movieId: Joi.string().required().min(2), // Joi.string().alphanum().length(24),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
});

module.exports = {
  validationMongoId,
  validationCreateUser,
  validationLogin,
  validationEditUser,
  validationCreateMovie,
};
