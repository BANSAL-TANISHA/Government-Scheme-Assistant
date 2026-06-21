import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import { categoryColors, getCategoryLabel } from '../../utils/helpers';
import { schemesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SchemeCard = ({ scheme, isSaved = false, onSaveToggle }) => {
  const { user } = useAuth();

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
    <div className="card hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`badge text-xs ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-600'}`}>
          {getCategoryLabel(scheme.category)}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-gray-400 bg-cream-100 px-2 py-0.5 rounded-full capitalize">{scheme.level}</span>
          <button onClick={handleSave} className={`p-1 rounded transition-colors ${isSaved ? 'text-teal-600' : 'text-gray-300 hover:text-teal-500'}`}>
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>
      </div>

      <Link to={`/schemes/${scheme._id}`}>
        <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-teal-700 transition-colors line-clamp-2">{scheme.name}</h3>
        {scheme.nameHindi && <p className="text-xs text-gray-500 mb-2 font-body">{scheme.nameHindi}</p>}
        <p className="text-xs text-gray-600 font-body line-clamp-2 mb-3">{scheme.description}</p>

        <div className="bg-teal-50 rounded-lg px-3 py-2 mb-3">
          <p className="text-[10px] text-teal-600 font-medium uppercase tracking-wide">Benefits</p>
          <p className="text-xs text-teal-800 font-body mt-0.5 line-clamp-2">{scheme.benefits}</p>
        </div>

        {scheme.ministry && (
          <p className="text-[10px] text-gray-400 mb-3">📋 {scheme.ministry}</p>
        )}

        <div className="flex items-center justify-between">
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
