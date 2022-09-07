const Movie = require('../models/movie');

const Helpers = require('../utils/helpers');
const AppErrors = require('../appErrors/appErrors');
const BadRequestErr = require('../appErrors/bad-request-error');
const NotFoundErr = require('../appErrors/not-found-err');
const UserRights = require('../appErrors/user-rights');

const fields = 'country director duration year description image trailerLink thumbnail owner movieId nameRU nameEN';

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }, fields).populate('owner', 'name email')
    .then((result) => res.send(result))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  // вытаскиваем параметры из тела запроса
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  // создаём новый фильм
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((result) => {
      Movie.findById(result._id, fields).populate('owner', 'name email')
        .then((dat) => {
          res.send(dat);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr(AppErrors.ERROR_NEW_MOVIE_PARAMS));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const id = Helpers.getMongoId(req.params._id);
  if (!id) {
    next(new BadRequestErr(AppErrors.ERROR_PARAMS));
    return;
  }
  // ищем карточку
  Movie.findOne({ _id: id }, 'owner')
    .then((result) => {
      if (!result) throw new NotFoundErr(AppErrors.ERROR_MOVIE_NOT_FOUND);
      // выходим с оишбкой, если карточка не принадлежит текущему пользователю
      if (result.get('owner', String) !== req.user._id) {
        throw new UserRights(AppErrors.ERROR_DELETE_MOVIE_NOT_OWNERED);
      }
      // удаляем карточку
      Movie.findOneAndDelete({ _id: id })
        .then(() => {
          res.status(200).send({ message: 'фильм удален' });
        })
        .catch(next);
    })
    .catch(next);
};
