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
          <h2 className="font-display font-semibold text-gray-800 mb-2">Eligibility Criteria</h2>
          <ul className="space-y-1 text-xs font-body text-gray-600">
            {e.minAge && <li>✅ Age: {e.minAge}{e.maxAge ? `–${e.maxAge}` : '+'} years</li>}
            {e.gender && e.gender !== 'all' && <li>✅ Gender: {e.gender}</li>}
            {e.category?.length > 0 && !e.category.includes('all') && <li>✅ Category: {e.category.map(c => c.toUpperCase()).join(', ')}</li>}
            {e.maxAnnualIncome && <li>✅ Income below: ₹{(e.maxAnnualIncome / 100000).toFixed(1)} lakh</li>}
            {e.states?.length > 0 && <li>✅ States: {e.states.join(', ')}</li>}
            {e.occupation?.length > 0 && <li>✅ Occupation: {e.occupation.join('/')}</li>}
            {e.maritalStatus && <li>✅ Marital Status: {e.maritalStatus}</li>}
            {e.isDisabled && <li>✅ For persons with disability</li>}
            {e.otherCriteria && <li>📌 {e.otherCriteria}</li>}
          </ul>
        </div>
      </div>

      {/* Documents */}
      {scheme.documentsRequired?.length > 0 && (
        <div className="card mb-4">
          <h2 className="font-display font-semibold text-gray-800 mb-3 flex items-center gap-2"><FileText size={16} /> Documents Required</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {scheme.documentsRequired.map((doc, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-body text-gray-700 bg-cream-50 rounded-lg px-3 py-2">
                <span className="text-teal-500">📄</span> {doc}
              </div>
            ))}
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
      {/* <div className="flex flex-wrap gap-3">
        {scheme.portalLink && (
          <a href={scheme.portalLink} target="_blank" rel="noreferrer"
            className="btn-primary flex items-center gap-2">
            Apply Online <ExternalLink size={14} />
          </a>
        )}
        <button onClick={handleMarkApplied} className="btn-secondary">
          ✅ Mark as Applied
        </button>
        <Link to="/chat" className="btn-secondary flex items-center gap-2">
          💬 Ask AI about this scheme
        </Link>
      </div> */}
      <div className="flex flex-wrap gap-3">
        {scheme.portalLink ? (
          <a
            href={scheme.portalLink}
            target="_blank"
            rel="noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            Apply Online <ExternalLink size={14} />
          </a>
        ) : (
          <a
            //     href={`https://www.myscheme.gov.in/search?q=${encodeURIComponent(
            //       scheme.name
            //     )}`}
            //     target="_blank"
            //     rel="noreferrer"
            //     className="btn-primary flex items-center gap-2"
            //   >
            //     Search on MyScheme.gov.in <ExternalLink size={14} />
            //   </a>
            // )}
            href="https://www.myscheme.gov.in"
            target="_blank"
            rel="noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            View on MyScheme.gov.in <ExternalLink size={14} />
          </a>
        )}

        <button onClick={handleMarkApplied} className="btn-secondary">
          ✅ Mark as Applied
        </button>

        <Link to="/chat" className="btn-secondary flex items-center gap-2">
          💬 Ask AI about this scheme
        </Link>
      </div>
    </div>
  );
};

export default SchemeDetailPage;
