const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  profile: {
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other', ''] },
    state: { type: String },
    district: { type: String },
    occupation: { type: String, enum: ['student', 'farmer', 'self-employed', 'employed', 'unemployed', 'retired', 'other', ''] },
    annualIncome: { type: Number },
    category: { type: String, enum: ['general', 'obc', 'sc', 'st', 'ews', ''] },
    education: { type: String },
    maritalStatus: { type: String, enum: ['single', 'married', 'widow', 'divorced', ''] },
    isDisabled: { type: Boolean, default: false },
    landHolding: { type: Number }, // in acres, for farmers
    religion: { type: String },
  },
  savedSchemes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
  appliedSchemes: [{
    scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'applied', 'approved', 'rejected'], default: 'pending' },
  }],
  preferredLanguage: { type: String, default: 'en' },
  isProfileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
