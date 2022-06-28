const router = require('express').Router();

const {
  getMe,
  updateUser,
} = require('../controllers/users');

const {
  validationEditUser,
} = require('../middlewares/validation');

router.get('/me', getMe);
router.patch('/me', validationEditUser, updateUser);

module.exports = router;
