const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  nameHindi: { type: String, trim: true },
  description: { type: String, required: true },
  descriptionHindi: { type: String },
  category: {
    type: String,
    enum: ['education', 'agriculture', 'women', 'health', 'housing', 'employment', 'social-security', 'startup', 'skill-development', 'minority', 'disability', 'other'],
    required: true,
  },
  ministry: { type: String },
  level: { type: String, enum: ['central', 'state'], default: 'central' },
  state: { type: String }, // null if central scheme
  eligibility: {
    minAge: { type: Number },
    maxAge: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'all'], default: 'all' },
    category: [{ type: String }], // ['sc', 'st', 'obc', 'general', 'all']
    occupation: [{ type: String }],
    maxAnnualIncome: { type: Number },
    minEducation: { type: String },
    states: [{ type: String }], // empty = all states
    maritalStatus: { type: String },
    isDisabled: { type: Boolean },
    otherCriteria: { type: String },
  },
  benefits: { type: String, required: true },
  benefitsAmount: { type: String },
  documentsRequired: [{ type: String }],
  applicationProcess: { type: String },
  portalLink: { type: String },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

schemeSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Scheme', schemeSchema);
