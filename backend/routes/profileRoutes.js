const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, markApplied } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/apply/:schemeId', protect, markApplied);

module.exports = router;
