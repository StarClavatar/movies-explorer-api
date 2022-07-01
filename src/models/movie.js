const mongoose = require('mongoose');
const { isValidUrl } = require('../utils/helpers');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    required: true,
  },
  director: {
    type: String,
    minlength: 2,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    minlength: 4,
    required: true,
  },
  description: {
    type: String,
    minlength: 2,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: isValidUrl,
      message: 'Не корректная ссылка',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: isValidUrl,
      message: 'Не корректная ссылка',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: isValidUrl,
      message: 'Не корректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    minlength: 2,
    required: true,
  },
  nameEN: {
    type: String,
    minlength: 2,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
