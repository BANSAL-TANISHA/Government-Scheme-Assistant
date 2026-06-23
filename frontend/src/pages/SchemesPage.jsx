import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { schemesAPI } from '../services/api';
import SchemeCard from '../components/schemes/SchemeCard';
import SchemeFilter from '../components/schemes/SchemeFilter';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    level: '',
    state: '',
    page: 1,
  });

  const [savedIds, setSavedIds] = useState(new Set(user?.savedSchemes?.map(s => s._id || s) || []));

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await schemesAPI.getAll({
          category: filters.category,
          search: filters.search,
          level: filters.level,
          state: filters.state,
          page: filters.page,
          limit: 12,
        });
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

  const hasActiveFilters = filters.category || filters.state || filters.level || filters.search;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display font-bold text-2xl text-teal-800">Government Schemes</h1>
          <p className="text-gray-500 text-sm font-body mt-0.5">
            {loading ? 'Loading...' : `${total.toLocaleString()} schemes available`}
            {hasActiveFilters && !loading && <span className="text-teal-600 ml-1">· filtered</span>}
          </p>
        </div>
        <Link to="/find-schemes"
          className="inline-flex items-center gap-2 px-4 py-2 bg-saffron-400 text-teal-900 rounded-xl font-display font-bold text-sm hover:bg-saffron-500 transition-colors shrink-0">
          <Sparkles size={15} /> Find My Schemes
        </Link>
      </div>

      {/* Mobile search bar */}
      <div className="mb-4 md:hidden relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search schemes..."
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value, page: 1 }))}
          className="w-full border border-cream-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="flex gap-5">
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0">
          <SchemeFilter filters={filters} onFilterChange={(f) => setFilters({ ...f, page: 1 })} />
        </aside>

        {/* Results Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="animate-spin text-teal-600" size={28} />
            </div>
          ) : schemes.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-body mb-3">No schemes found for these filters.</p>
              <button onClick={() => setFilters({ category: '', state: '', level: '', search: '', page: 1 })}
                className="text-sm text-teal-600 underline">Clear all filters</button>
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
            <div className="flex justify-center items-center gap-3 mt-8">
              <button disabled={filters.page === 1}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                className="btn-secondary text-sm disabled:opacity-40 px-4">← Prev</button>
              <span className="px-3 py-1.5 text-sm text-gray-600 bg-white rounded-lg border border-cream-200">
                Page {filters.page} of {Math.ceil(total / 12)}
              </span>
              <button disabled={schemes.length < 12}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                className="btn-secondary text-sm disabled:opacity-40 px-4">Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemesPage;
