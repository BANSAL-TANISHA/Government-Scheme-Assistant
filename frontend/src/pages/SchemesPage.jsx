import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { schemesAPI } from '../services/api';
import SchemeCard from '../components/schemes/SchemeCard';
import SchemeFilter from '../components/schemes/SchemeFilter';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: '',
    level: '',
    page: 1,
  });
  const [savedIds, setSavedIds] = useState(new Set(user?.savedSchemes?.map(s => s._id || s) || []));

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await schemesAPI.getAll({ category: filters.category, search: filters.search, page: filters.page, limit: 12 });
        setSchemes(res.data.schemes);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetch, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleSaveToggle = (id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-teal-800">Government Schemes</h1>
        <p className="text-gray-500 text-sm font-body mt-1">{total} schemes available</p>
      </div>
      <div className="flex gap-5">
        {/* Filters */}
        <aside className="hidden md:block w-64 shrink-0">
          <SchemeFilter filters={filters} onFilterChange={setFilters} />
        </aside>
        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-teal-600" size={28} /></div>
          ) : schemes.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-body">No schemes found for these filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {schemes.map(scheme => (
                <SchemeCard key={scheme._id} scheme={scheme} isSaved={savedIds.has(scheme._id)} onSaveToggle={handleSaveToggle} />
              ))}
            </div>
          )}
          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center gap-2 mt-8">
              <button disabled={filters.page === 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="btn-secondary text-sm disabled:opacity-40">← Prev</button>
              <span className="px-4 py-2 text-sm text-gray-600">Page {filters.page}</span>
              <button disabled={schemes.length < 12} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="btn-secondary text-sm disabled:opacity-40">Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemesPage;
