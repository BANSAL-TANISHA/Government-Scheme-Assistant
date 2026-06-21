const User = require('../models/User');

// @route GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedSchemes', 'name category benefits portalLink');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, profile: user.profile, user: { name: user.name, email: user.email, phone: user.phone, preferredLanguage: user.preferredLanguage, savedSchemes: user.savedSchemes, appliedSchemes: user.appliedSchemes } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const { profile, preferredLanguage, name, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (profile) user.profile = { ...user.profile, ...profile };
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Check if profile is complete enough
    const p = user.profile;
    user.isProfileComplete = !!(p.age && p.gender && p.state && p.occupation);

    await user.save();
    res.json({ success: true, message: 'Profile updated', profile: user.profile, isProfileComplete: user.isProfileComplete });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/profile/apply/:schemeId
exports.markApplied = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const schemeId = req.params.schemeId;
    const alreadyApplied = user.appliedSchemes.find(a => a.scheme.toString() === schemeId);
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Already marked as applied' });
    }
    user.appliedSchemes.push({ scheme: schemeId });
    await user.save();
    res.json({ success: true, message: 'Scheme marked as applied' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
