const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.put('/update', protect, updateUser);
router.delete('/delete', protect, deleteUser);

module.exports = router;