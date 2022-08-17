const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const AppErrors = require('../appErrors/appErrors');
const AuthErr = require('../appErrors/auth-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: 'Не корректный адрес электронной почты',
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    required: true,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  const error = new AuthErr(AppErrors.ERROR_LOGIN_PASSWORD);

  return this.findOne({ email }, 'email password name')
    .then((user) => {
      if (!user) return Promise.reject(error);
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return Promise.reject(error);
          return { _id: user._id, name: user.name, email };
        });
    });
};

module.exports = mongoose.model('user', userSchema);
