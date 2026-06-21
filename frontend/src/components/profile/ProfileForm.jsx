import React, { useState } from 'react';
import { profileAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'];

const ProfileForm = ({ initialProfile = {}, onSaved }) => {
  const [form, setForm] = useState({
    age: initialProfile.age || '',
    gender: initialProfile.gender || '',
    state: initialProfile.state || '',
    occupation: initialProfile.occupation || '',
    annualIncome: initialProfile.annualIncome || '',
    category: initialProfile.category || '',
    education: initialProfile.education || '',
    maritalStatus: initialProfile.maritalStatus || '',
    isDisabled: initialProfile.isDisabled || false,
    landHolding: initialProfile.landHolding || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileAPI.update({ profile: form });
      toast.success('Profile updated successfully!');
      onSaved?.();
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-display font-medium text-gray-700 mb-1">Age</label>
          <input type="number" name="age" value={form.age} onChange={handleChange} min="1" max="120" className="input-field text-sm" placeholder="e.g., 25" />
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-gray-700 mb-1">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="input-field text-sm">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-gray-700 mb-1">State</label>
          <select name="state" value={form.state} onChange={handleChange} className="input-field text-sm">
            <option value="">Select State</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-gray-700 mb-1">Occupation</label>
          <select name="occupation" value={form.occupation} onChange={handleChange} className="input-field text-sm">
            <option value="">Select</option>
            {['student','farmer','self-employed','employed','unemployed','retired','other'].map(o => (
              <option key={o} value={o} className="capitalize">{o.charAt(0).toUpperCase() + o.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-gray-700 mb-1">Annual Income (₹)</label>
          <input type="number" name="annualIncome" value={form.annualIncome} onChange={handleChange} className="input-field text-sm" placeholder="e.g., 150000" />
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-gray-700 mb-1">Category / Caste</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field text-sm">
            <option value="">Select</option>
            {['general','obc','sc','st','ews'].map(c => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-gray-700 mb-1">Education</label>
          <select name="education" value={form.education} onChange={handleChange} className="input-field text-sm">
            <option value="">Select</option>
            {['10th','12th','Diploma','ITI','Graduate','Post-Graduate','PhD'].map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-gray-700 mb-1">Marital Status</label>
          <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="input-field text-sm">
            <option value="">Select</option>
            {['single','married','widow','divorced'].map(m => (
              <option key={m} value={m} className="capitalize">{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isDisabled" name="isDisabled" checked={form.isDisabled} onChange={handleChange} className="w-4 h-4 text-teal-600 rounded" />
        <label htmlFor="isDisabled" className="text-sm text-gray-700 font-body">Person with disability (Divyang)</label>
      </div>

      {form.occupation === 'farmer' && (
        <div>
          <label className="block text-xs font-display font-medium text-gray-700 mb-1">Land Holding (acres)</label>
          <input type="number" name="landHolding" value={form.landHolding} onChange={handleChange} className="input-field text-sm" placeholder="e.g., 3" />
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
};

export default ProfileForm;
