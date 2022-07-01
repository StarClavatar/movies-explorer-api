const router = require('express').Router();
const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

const {
  validationMongoId,
  validationCreateMovie,
} = require('../middlewares/validation');

router.get('/', getMovies);
router.delete('/:_id', validationMongoId, deleteMovie);
router.post('/', validationCreateMovie, createMovie);

module.exports = router;
