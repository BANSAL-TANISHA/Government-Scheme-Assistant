const Scheme = require('../models/Scheme');
const { matchSchemes } = require('../services/eligibilityService');

// @route GET /api/schemes
exports.getAllSchemes = async (req, res) => {
  try {
    const { category, state, search, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (state) query.$or = [{ state }, { 'eligibility.states': { $size: 0 } }];
    if (search) query.$text = { $search: search };

    const schemes = await Scheme.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await Scheme.countDocuments(query);

    res.json({ success: true, schemes, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/schemes/:id
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/schemes/match
exports.matchEligibleSchemes = async (req, res) => {
  try {
    const userProfile = req.body.profile;
    if (!userProfile) return res.status(400).json({ success: false, message: 'Profile data required' });

    const schemes = await Scheme.find({ isActive: true });
    const results = matchSchemes(userProfile, schemes);

    res.json({ success: true, results, total: results.eligible.length + results.partial.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/schemes/:id/save
exports.saveScheme = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    const schemeId = req.params.id;
    const isSaved = user.savedSchemes.includes(schemeId);
    if (isSaved) {
      user.savedSchemes = user.savedSchemes.filter(id => id.toString() !== schemeId);
    } else {
      user.savedSchemes.push(schemeId);
    }
    await user.save();
    res.json({ success: true, saved: !isSaved, message: isSaved ? 'Scheme removed from saved' : 'Scheme saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
