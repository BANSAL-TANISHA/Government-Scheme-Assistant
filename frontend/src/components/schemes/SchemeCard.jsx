import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import { categoryColors, getCategoryLabel } from '../../utils/helpers';
import { schemesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// Extract a ₹ benefit amount from raw benefits text
const extractBenefitAmount = (text = '') => {
  const patterns = [
    /₹\s*([\d,]+(?:\.\d+)?)\s*(lakh|crore|thousand|per year|\/year|pa|per annum|per month|\/month|\/annum)?/i,
    /rs\.?\s*([\d,]+(?:\.\d+)?)\s*(lakh|crore|thousand|per year|per month)?/i,
    /([\d,]+(?:\.\d+)?)\s*lakh/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      let num = m[1].replace(/,/g, '');
      const unit = (m[2] || '').toLowerCase();
      if (unit.includes('crore')) num = (parseFloat(num) * 100).toFixed(0) + 'L';
      else if (unit.includes('lakh')) num = num + 'L';
      else if (parseFloat(num) >= 100000) num = (parseFloat(num) / 100000).toFixed(1) + 'L';
      else num = '₹' + parseInt(num).toLocaleString('en-IN');

      if (!num.startsWith('₹')) num = '₹' + num;

      const period = unit.includes('month') ? '/mo' : unit.includes('year') || unit.includes('annum') ? '/yr' : '';
      return num + period;
    }
  }
  return null;
};

const SchemeCard = ({ scheme, isSaved = false, onSaveToggle }) => {
  const { user } = useAuth();
  const benefitAmount = extractBenefitAmount(scheme.benefits || scheme.benefitsAmount || '');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to save schemes'); return; }
    try {
      await schemesAPI.saveScheme(scheme._id);
      onSaveToggle?.(scheme._id);
      toast.success(isSaved ? 'Removed from saved' : 'Scheme saved!');
    } catch (err) {
      toast.error('Failed to save scheme');
    }
  };

  return (
    <div className="card hover:shadow-md transition-all hover:-translate-y-0.5 group flex flex-col">
      {/* Top row: category badge + level + save */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`badge text-xs ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-600'}`}>
            {getCategoryLabel(scheme.category)}
          </span>
          {scheme.state && (
            <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-body">
              📍 {scheme.state}
            </span>
          )}
          {!scheme.state && (
            <span className="text-[10px] text-gray-400 bg-cream-100 px-2 py-0.5 rounded-full capitalize font-body">
              🏛️ {scheme.level || 'central'}
            </span>
          )}
        </div>
        <button onClick={handleSave} className={`p-1 rounded shrink-0 transition-colors ${isSaved ? 'text-teal-600' : 'text-gray-300 hover:text-teal-500'}`}>
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      <Link to={`/schemes/${scheme._id}`} className="flex-1 flex flex-col">
        {/* Benefit amount — big and prominent */}
        {benefitAmount && (
          <div className="mb-2">
            <span className="inline-block text-lg font-display font-black text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-lg">
              {benefitAmount}
            </span>
          </div>
        )}

        <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-teal-700 transition-colors line-clamp-2">
          {scheme.name}
        </h3>
        {scheme.nameHindi && <p className="text-xs text-gray-500 mb-1.5 font-body">{scheme.nameHindi}</p>}
        <p className="text-xs text-gray-500 font-body line-clamp-2 mb-3 flex-1">{scheme.description}</p>

        {/* Benefits summary */}
        <div className="bg-teal-50 rounded-lg px-3 py-2 mb-3">
          <p className="text-[10px] text-teal-600 font-display font-semibold uppercase tracking-wide">Benefits</p>
          <p className="text-xs text-teal-800 font-body mt-0.5 line-clamp-2">{scheme.benefits}</p>
        </div>

        {scheme.ministry && (
          <p className="text-[10px] text-gray-400 mb-2 truncate">📋 {scheme.ministry}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-xs text-teal-700 font-display font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all">
            View Details <ArrowRight size={12} />
          </span>
          {scheme.portalLink && (
            <a href={scheme.portalLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              className="text-xs text-gray-400 hover:text-teal-600 flex items-center gap-1 transition-colors">
              Apply <ExternalLink size={10} />
            </a>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SchemeCard;
