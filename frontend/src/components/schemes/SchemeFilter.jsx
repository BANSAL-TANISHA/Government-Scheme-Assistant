import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'education', label: '📚 Education' },
  { value: 'agriculture', label: '🌾 Agriculture' },
  { value: 'women', label: '👩 Women' },
  { value: 'health', label: '🏥 Health' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'employment', label: '💼 Employment' },
  { value: 'startup', label: '🚀 Startup' },
  { value: 'social-security', label: '🛡️ Social Security' },
  { value: 'skill-development', label: '🎓 Skill Dev' },
  { value: 'disability', label: '♿ Disability' },
];

const LEVELS = [
  { value: '', label: 'All' },
  { value: 'central', label: '🏛️ Central' },
  { value: 'state', label: '📍 State' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const SchemeFilter = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl border border-cream-200 p-4 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-sm font-display font-semibold text-gray-700 mb-1">
        <SlidersHorizontal size={15} /> Filters
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search schemes..."
          value={filters.search}
          onChange={e => onFilterChange({ ...filters, search: e.target.value, page: 1 })}
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-display font-semibold text-gray-600 mb-1.5">Category</label>
        <select value={filters.category} onChange={e => onFilterChange({ ...filters, category: e.target.value, page: 1 })}
          className="input-field text-sm">
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* State */}
      <div>
        <label className="block text-xs font-display font-semibold text-gray-600 mb-1.5">📍 State</label>
        <select value={filters.state || ''} onChange={e => onFilterChange({ ...filters, state: e.target.value, page: 1 })}
          className="input-field text-sm">
          <option value="">All States (National)</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Level */}
      <div>
        <label className="block text-xs font-display font-semibold text-gray-600 mb-1.5">Government Level</label>
        <div className="flex gap-1.5">
          {LEVELS.map(l => (
            <button key={l.value} onClick={() => onFilterChange({ ...filters, level: l.value, page: 1 })}
              className={`flex-1 py-1.5 text-xs font-display rounded-lg border transition-colors ${
                filters.level === l.value
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white text-gray-600 border-cream-200 hover:border-teal-300'
              }`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {(filters.category || filters.state || filters.level || filters.search) && (
        <button
          onClick={() => onFilterChange({ category: '', state: '', level: '', search: '', page: 1 })}
          className="w-full text-xs text-red-500 hover:text-red-700 font-body py-1"
        >
          ✕ Clear all filters
        </button>
      )}
    </div>
  );
};

export default SchemeFilter;
