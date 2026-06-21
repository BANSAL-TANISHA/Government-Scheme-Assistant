const express = require('express');
const router = express.Router();
const { getAllSchemes, getSchemeById, matchEligibleSchemes, saveScheme } = require('../controllers/schemeController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', getAllSchemes);
router.get('/:id', getSchemeById);
router.post('/match', optionalAuth, matchEligibleSchemes);
router.post('/:id/save', protect, saveScheme);

module.exports = router;
