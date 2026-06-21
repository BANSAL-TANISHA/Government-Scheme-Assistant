import React from 'react';
import { Link } from 'react-router-dom';
import { categoryColors, getCategoryLabel } from '../../utils/helpers';
import { ExternalLink } from 'lucide-react';

const SavedSchemes = ({ schemes = [] }) => {
  if (schemes.length === 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-4xl mb-3">🔖</div>
        <p className="text-gray-500 font-body text-sm">No saved schemes yet.</p>
        <Link to="/schemes" className="text-teal-600 text-sm mt-2 inline-block hover:underline">Browse Schemes →</Link>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {schemes.map(scheme => (
        <div key={scheme._id} className="card flex items-start justify-between gap-3">
          <div>
            <span className={`badge text-xs mb-1 ${categoryColors[scheme.category]}`}>{getCategoryLabel(scheme.category)}</span>
            <Link to={`/schemes/${scheme._id}`} className="block font-display font-semibold text-sm text-teal-800 hover:underline">{scheme.name}</Link>
            <p className="text-xs text-gray-500 font-body mt-0.5 line-clamp-1">{scheme.benefits}</p>
          </div>
          {scheme.portalLink && (
            <a href={scheme.portalLink} target="_blank" rel="noreferrer" className="shrink-0 text-teal-600 hover:text-teal-800">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default SavedSchemes;
