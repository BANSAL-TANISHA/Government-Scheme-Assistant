import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schemesAPI, profileAPI } from '../services/api';
import { categoryColors, getCategoryLabel, formatDate } from '../utils/helpers';
import { ExternalLink, CheckCircle, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SchemeDetailPage = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    schemesAPI.getById(id).then(res => setScheme(res.data.scheme)).finally(() => setLoading(false));
  }, [id]);

  const handleMarkApplied = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      await profileAPI.markApplied(id);
      toast.success('Marked as applied!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-teal-600" size={28} /></div>;
  if (!scheme) return <div className="text-center py-20 text-gray-400">Scheme not found.</div>;

  const e = scheme.eligibility || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/schemes" className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-800 mb-4 font-body">
        <ArrowLeft size={14} /> Back to Schemes
      </Link>

      <div className="card mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`badge ${categoryColors[scheme.category]}`}>{getCategoryLabel(scheme.category)}</span>
          <span className="text-xs text-gray-400 capitalize bg-cream-100 px-2 py-0.5 rounded-full">{scheme.level} scheme</span>
        </div>
        <h1 className="font-display font-bold text-xl text-teal-800 mb-1">{scheme.name}</h1>
        {scheme.nameHindi && <p className="text-gray-500 font-body mb-3">{scheme.nameHindi}</p>}
        {scheme.ministry && <p className="text-xs text-gray-400 mb-3">📋 {scheme.ministry}</p>}
        <p className="text-gray-600 font-body text-sm leading-relaxed">{scheme.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Benefits */}
        <div className="card bg-teal-50 border-teal-100">
          <h2 className="font-display font-semibold text-teal-800 mb-2 flex items-center gap-2"><CheckCircle size={16} /> Benefits</h2>
          <p className="text-sm font-body text-teal-700">{scheme.benefits}</p>
          {scheme.benefitsAmount && <p className="mt-2 text-lg font-display font-bold text-teal-800">{scheme.benefitsAmount}</p>}
        </div>

        {/* Eligibility */}
        <div className="card">
          <h2 className="font-display font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🎯</span> Eligibility Criteria
          </h2>

          {/* Structured fields (when available) */}
          {(e.minAge || (e.gender && e.gender !== 'all') || e.category?.length > 0 || e.maxAnnualIncome || e.states?.length > 0 || e.occupation?.length > 0 || e.maritalStatus || e.isDisabled) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {e.minAge && (
                <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-2.5 py-1 font-body">
                  👤 Age: {e.minAge}{e.maxAge ? `–${e.maxAge}` : '+'} yrs
                </span>
              )}
              {e.gender && e.gender !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-2.5 py-1 font-body capitalize">
                  ⚧ {e.gender} only
                </span>
              )}
              {e.category?.length > 0 && !e.category.includes('all') && (
                <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-2.5 py-1 font-body">
                  🏷️ {e.category.map(c => c.toUpperCase()).join(' / ')}
                </span>
              )}
              {e.maxAnnualIncome && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-1 font-body">
                  💰 Income ≤ ₹{(e.maxAnnualIncome / 100000).toFixed(1)}L/yr
                </span>
              )}
              {e.occupation?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1 font-body capitalize">
                  💼 {e.occupation.join(' / ')}
                </span>
              )}
              {e.states?.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-1 font-body">
                  📍 {e.states.join(', ')}
                </span>
              )}
              {e.isDisabled && (
                <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-1 font-body">
                  ♿ Persons with Disability
                </span>
              )}
              {e.maritalStatus && (
                <span className="inline-flex items-center gap-1 text-xs bg-pink-50 text-pink-700 border border-pink-200 rounded-full px-2.5 py-1 font-body capitalize">
                  💍 {e.maritalStatus}
                </span>
              )}
            </div>
          )}

          {/* Raw eligibility text from CSV — always shown if available */}
          {e.otherCriteria ? (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-800 mb-2 uppercase tracking-wide">📋 Full Eligibility Details</p>
              <ul className="space-y-1.5">
                {e.otherCriteria
                  .split(/\.\s+(?=[A-Z])|(?<=\.)\s*\n/)
                  .map(s => s.trim())
                  .filter(s => s.length > 5)
                  .map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-body text-amber-900 leading-relaxed">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">✦</span>
                      <span>{point.replace(/\.$/, '')}.</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic font-body">No eligibility criteria specified.</p>
          )}
        </div>
      </div>

      {/* Documents */}
      {scheme.documentsRequired?.length > 0 && (
        <div className="card mb-4">
          <h2 className="font-display font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText size={16} /> Documents Required
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {scheme.documentsRequired
              .filter(doc => doc && doc.trim().length > 4)
              .map((doc, i) => (
                <div key={i} className="flex items-start gap-2 text-sm font-body text-gray-700 bg-cream-50 rounded-lg px-3 py-2">
                  <span className="text-teal-500 mt-0.5 flex-shrink-0">📄</span>
                  <span>{doc.trim()}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* How to Apply */}
      {scheme.applicationProcess && (
        <div className="card mb-4">
          <h2 className="font-display font-semibold text-gray-800 mb-2">How to Apply</h2>
          <p className="text-sm font-body text-gray-600 leading-relaxed">{scheme.applicationProcess}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {scheme.portalLink ? (
          <a href={scheme.portalLink} target="_blank" rel="noreferrer"
            className="btn-primary flex items-center gap-2">
            Apply Online <ExternalLink size={14} />
          </a>
        ) : (
          <a href="https://www.myscheme.gov.in" target="_blank" rel="noreferrer"
            className="btn-primary flex items-center gap-2">
            View on MyScheme.gov.in <ExternalLink size={14} />
          </a>
        )}

        <button onClick={handleMarkApplied} className="btn-secondary">✅ Mark as Applied</button>

        {/* WhatsApp Share */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`🏛️ Government Scheme: ${scheme.name}\n\n${scheme.description?.substring(0, 200)}...\n\nBenefits: ${scheme.benefits?.substring(0, 150)}\n\nMore info: ${window.location.href}`)}`}
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-body text-sm font-medium hover:bg-green-600 transition-colors">
          📱 Share on WhatsApp
        </a>

        {/* Copy Link */}
        <button
          onClick={() => { navigator.clipboard.writeText(window.location.href); import('react-hot-toast').then(m => m.default.success('Link copied!')); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-cream-200 text-gray-700 rounded-xl font-body text-sm hover:border-teal-400 transition-colors">
          🔗 Copy Link
        </button>

        {/* Print Checklist */}
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-cream-200 text-gray-700 rounded-xl font-body text-sm hover:border-teal-400 transition-colors">
          🖨️ Print Checklist
        </button>

        <Link to="/chat" className="btn-secondary flex items-center gap-2">
          💬 Ask AI about this scheme
        </Link>
      </div>
    </div>
  );
};

export default SchemeDetailPage;
