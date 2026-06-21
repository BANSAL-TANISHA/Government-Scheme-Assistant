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
  { value: '', label: 'All Levels' },
  { value: 'central', label: 'Central Govt' },
  { value: 'state', label: 'State Govt' },
];

const SchemeFilter = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl border border-cream-200 p-4 shadow-sm space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search schemes..."
          value={filters.search}
          onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-display font-medium text-gray-600 mb-1.5">Category</label>
        <select value={filters.category} onChange={e => onFilterChange({ ...filters, category: e.target.value })}
          className="input-field text-sm">
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Level */}
      <div>
        <label className="block text-xs font-display font-medium text-gray-600 mb-1.5">Government Level</label>
        <div className="flex gap-2">
          {LEVELS.map(l => (
            <button key={l.value} onClick={() => onFilterChange({ ...filters, level: l.value })}
              className={`flex-1 py-1.5 text-xs font-display rounded-lg border transition-colors ${filters.level === l.value ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-gray-600 border-cream-200 hover:border-teal-300'}`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchemeFilter;
