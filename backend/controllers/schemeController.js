const Scheme = require('../models/Scheme');
const { matchSchemes } = require('../services/eligibilityService');

// @route GET /api/schemes
exports.getAllSchemes = async (req, res) => {
  try {
    const { category, state, search, level, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    // Category filter — exact match on enum field
    if (category) query.category = category;

    // Level filter — 'central' or 'state' (stored in the level field)
    if (level && (level === 'central' || level === 'state')) {
      query.level = level;
    }

    // State filter — state name appears in scheme description or name text
    // because the 'state' DB field is always null; state data lives in description text
    if (state && state !== '' && state !== 'all') {
      const stateRegex = new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      if (search && search.trim()) {
        // Combine state AND search: name matches search AND description mentions state
        query.$and = [
          { $or: [{ name: stateRegex }, { description: stateRegex }] },
          { name: new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
        ];
      } else {
        // State only: description or name mentions the state name
        query.$or = [
          { name: stateRegex },
          { description: stateRegex },
        ];
      }
    // Search — each word must appear somewhere in the name (ALL words, any order)
    // Use a combined lookahead regex: (?=.*word1)(?=.*word2) on the name field
    } else if (search && search.trim()) {
      const words = search.trim().split(/\s+/).filter(w => w.length > 1);
      if (words.length > 0) {
        // Build a single regex that requires ALL words to be present
        const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const combinedPattern = escapedWords.map(w => `(?=.*${w})`).join('');
        query.name = new RegExp(combinedPattern, 'i');
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const schemes = await Scheme.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ level: 1, createdAt: -1 }); // state schemes first, then central

    const total = await Scheme.countDocuments(query);

    res.json({
      success: true,
      schemes,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('getAllSchemes error:', error);
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
