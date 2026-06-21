import React from 'react';
import { useChat } from '../../context/ChatContext';
import { User, MapPin, Briefcase, IndianRupee, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
import { formatCurrency, categoryColors, getCategoryLabel } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const ProfileSidebar = () => {
  const { extractedProfile, eligibleSchemes, partialSchemes } = useChat();

  // Only show profile fields that were ACTUALLY mentioned in THIS chat session
  // Do NOT pull from saved user profile — only from what user said in chat
  const profileFields = Object.entries(extractedProfile).filter(([key, value]) => {
    // Only show if value exists and is meaningful
    if (value === null || value === undefined || value === '') return false;
    if (value === false) return false;
    // Skip internal fields
    if (key === 'studyYear') return false;
    return true;
  });

  const hasProfile = profileFields.length > 0;

  const fieldLabels = {
    age: { label: 'Age', icon: <User size={12} className="text-teal-500" />, format: (v) => `${v} years` },
    gender: { label: 'Gender', icon: <User size={12} className="text-teal-500" />, format: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
    state: { label: 'State', icon: <MapPin size={12} className="text-teal-500" />, format: (v) => v },
    occupation: { label: 'Occupation', icon: <Briefcase size={12} className="text-teal-500" />, format: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
    annualIncome: { label: 'Income', icon: <IndianRupee size={12} className="text-teal-500" />, format: (v) => `${formatCurrency(v)}/yr` },
    education: { label: 'Education', icon: <GraduationCap size={12} className="text-teal-500" />, format: (v) => v },
    category: { label: 'Category', icon: <BookOpen size={12} className="text-teal-500" />, format: (v) => v.toUpperCase() },
    maritalStatus: { label: 'Marital Status', icon: <User size={12} className="text-teal-500" />, format: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
    isDisabled: { label: 'Disability', icon: <User size={12} className="text-teal-500" />, format: () => 'Yes (Divyang)' },
    landHolding: { label: 'Land', icon: <MapPin size={12} className="text-teal-500" />, format: (v) => `${v} acres` },
  };

  return (
    <div className="space-y-3 h-full overflow-y-auto pb-4">

      {/* Extracted Profile — only from chat */}
      {hasProfile && (
        <div className="card">
          <h3 className="font-display font-semibold text-teal-800 text-sm mb-3 flex items-center gap-1.5">
            <User size={14} /> Your Profile
            <span className="ml-auto text-[10px] text-gray-400 font-body normal-case">from this chat</span>
          </h3>
          <div className="space-y-1.5 text-xs font-body text-gray-700">
            {profileFields.map(([key, value]) => {
              const field = fieldLabels[key];
              if (!field) return null;
              return (
                <div key={key} className="flex items-center gap-2">
                  {field.icon}
                  <span className="text-gray-500">{field.label}:</span>
                  <span className="font-medium text-gray-800">{field.format(value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Eligible Schemes */}
      {eligibleSchemes.length > 0 && (
        <div className="card">
          <h3 className="font-display font-semibold text-teal-800 text-sm mb-3">
            ✅ Eligible Schemes ({eligibleSchemes.length})
          </h3>
          <div className="space-y-2">
            {eligibleSchemes.map(scheme => (
              <Link
                key={scheme._id}
                to={`/schemes/${scheme._id}`}
                className="block p-2.5 rounded-lg bg-green-50 border border-green-100 hover:border-green-300 transition-colors group"
              >
                <span className={`badge text-[10px] ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-600'}`}>
                  {getCategoryLabel(scheme.category)}
                </span>
                <p className="text-xs font-display font-medium text-teal-800 mt-1 line-clamp-2 group-hover:text-teal-600">
                  {scheme.name}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                  View details <ArrowRight size={9} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Partial matches */}
      {partialSchemes.length > 0 && (
        <div className="card">
          <h3 className="font-display font-semibold text-amber-700 text-sm mb-3">
            ⚠️ May be Eligible ({partialSchemes.length})
          </h3>
          <div className="space-y-2">
            {partialSchemes.map(scheme => (
              <Link
                key={scheme._id}
                to={`/schemes/${scheme._id}`}
                className="block p-2.5 rounded-lg bg-amber-50 border border-amber-100 hover:border-amber-300 transition-colors"
              >
                <p className="text-xs font-display font-medium text-gray-800 line-clamp-2">{scheme.name}</p>
                <p className="text-[10px] text-amber-600 mt-0.5">More info needed</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasProfile && eligibleSchemes.length === 0 && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-3">🏛️</div>
          <p className="text-xs text-gray-500 font-body leading-relaxed">
            Start chatting to discover government schemes you are eligible for.
          </p>
          <p className="text-[10px] text-gray-400 mt-2 font-body">
            Try: "I'm a student from Rajasthan"
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileSidebar;