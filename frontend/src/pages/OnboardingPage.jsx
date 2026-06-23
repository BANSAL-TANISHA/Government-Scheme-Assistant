import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { schemesAPI } from '../services/api';
import SchemeCard from '../components/schemes/SchemeCard';
import { ArrowRight, ArrowLeft, Loader2, Search } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu and Kashmir','Ladakh','Puducherry','Chandigarh',
];

const OCCUPATIONS = [
  { value: 'student', label: 'Student', icon: '🎓', desc: 'School / College / University' },
  { value: 'farmer', label: 'Farmer', icon: '🌾', desc: 'Agriculture / Kheti' },
  { value: 'women', label: 'Women', icon: '👩', desc: 'Homemaker / Mahila' },
  { value: 'unemployed', label: 'Unemployed', icon: '🔍', desc: 'Seeking job / Berozgar' },
  { value: 'self-employed', label: 'Business', icon: '🏪', desc: 'Shop / Startup / Vyapar' },
  { value: 'retired', label: 'Retired', icon: '🏖️', desc: 'Senior citizen / Pension' },
];

const INCOME_RANGES = [
  { label: 'No income', value: 0 },
  { label: 'Below ₹1 lakh/year', value: 99000 },
  { label: '₹1–2.5 lakh/year', value: 250000 },
  { label: '₹2.5–5 lakh/year', value: 500000 },
  { label: '₹5–8 lakh/year', value: 800000 },
  { label: 'Above ₹8 lakh/year', value: 1000000 },
];

const CATEGORIES = [
  { value: 'general', label: 'General', emoji: '🟦' },
  { value: 'obc', label: 'OBC', emoji: '🟩' },
  { value: 'sc', label: 'SC', emoji: '🟨' },
  { value: 'st', label: 'ST', emoji: '🟧' },
  { value: 'ews', label: 'EWS', emoji: '🟪' },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [profile, setProfile] = useState({
    occupation: '',
    state: '',
    age: '',
    category: '',
    annualIncome: null,
    gender: '',
  });

  const set = (key, val) => setProfile(p => ({ ...p, [key]: val }));

  const handleFindSchemes = async () => {
    setLoading(true);
    setStep(3);
    try {
      const cleanProfile = {
        ...profile,
        age: profile.age ? parseInt(profile.age) : undefined,
        annualIncome: profile.annualIncome,
      };
      // Remove empty strings
      Object.keys(cleanProfile).forEach(k => {
        if (cleanProfile[k] === '' || cleanProfile[k] === null || cleanProfile[k] === undefined) {
          delete cleanProfile[k];
        }
      });
      const res = await schemesAPI.match(cleanProfile);
      setResults(res.data.results);
    } catch (e) {
      console.error(e);
      setResults({ eligible: [], partial: [] });
    } finally {
      setLoading(false);
    }
  };

  const totalFound = results ? results.eligible.length + results.partial.length : 0;

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <div className="bg-teal-800 text-white px-4 py-6 text-center">
        <h1 className="font-display font-bold text-2xl mb-1">🎯 Find My Government Schemes</h1>
        <p className="text-teal-300 text-sm font-body">Answer 2 quick questions — get instant results</p>
        {/* Progress bar */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 w-16 rounded-full transition-colors ${step >= s ? 'bg-saffron-400' : 'bg-teal-700'}`} />
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── STEP 1: Who are you? ── */}
        {step === 1 && (
          <div>
            <h2 className="font-display font-bold text-xl text-teal-800 mb-1 text-center">Who are you?</h2>
            <p className="text-gray-500 text-sm text-center font-body mb-6">Select your main role / occupation</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {OCCUPATIONS.map(occ => (
                <button
                  key={occ.value}
                  onClick={() => set('occupation', occ.value)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                    profile.occupation === occ.value
                      ? 'border-teal-600 bg-teal-50 shadow-md'
                      : 'border-cream-200 bg-white hover:border-teal-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{occ.icon}</div>
                  <div className="font-display font-bold text-sm text-gray-800">{occ.label}</div>
                  <div className="text-xs text-gray-500 font-body mt-0.5">{occ.desc}</div>
                </button>
              ))}
            </div>

            {/* Gender */}
            <div className="mb-6">
              <p className="text-sm font-display font-semibold text-gray-700 mb-2">Gender (optional)</p>
              <div className="flex gap-3">
                {[{ v: 'male', l: '♂ Male' }, { v: 'female', l: '♀ Female' }].map(g => (
                  <button key={g.v} onClick={() => set('gender', g.v)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-display font-medium transition-all ${
                      profile.gender === g.v ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-cream-200 bg-white text-gray-600 hover:border-teal-300'
                    }`}>
                    {g.l}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!profile.occupation}
              className="w-full py-3.5 bg-teal-700 text-white rounded-2xl font-display font-bold text-base hover:bg-teal-800 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Next Step <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ── STEP 2: Basic Details ── */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-teal-600 mb-4 hover:text-teal-800">
              <ArrowLeft size={14} /> Back
            </button>
            <h2 className="font-display font-bold text-xl text-teal-800 mb-1 text-center">Your Details</h2>
            <p className="text-gray-500 text-sm text-center font-body mb-6">Help us find the most accurate schemes</p>

            <div className="space-y-5">
              {/* State */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-700 mb-1.5">📍 Your State</label>
                <select
                  value={profile.state}
                  onChange={e => set('state', e.target.value)}
                  className="w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm font-body text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select your state...</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-700 mb-1.5">👤 Your Age</label>
                <input
                  type="number" min="5" max="100" placeholder="e.g. 22"
                  value={profile.age}
                  onChange={e => set('age', e.target.value)}
                  className="w-full border border-cream-200 rounded-xl px-4 py-2.5 text-sm font-body text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-700 mb-2">🏷️ Caste Category</label>
                <div className="grid grid-cols-5 gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c.value} onClick={() => set('category', c.value)}
                      className={`py-2 rounded-xl border-2 text-xs font-display font-bold transition-all ${
                        profile.category === c.value ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-cream-200 bg-white text-gray-600 hover:border-teal-300'
                      }`}>
                      <div>{c.emoji}</div>{c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Income */}
              <div>
                <label className="block text-sm font-display font-semibold text-gray-700 mb-2">💰 Annual Family Income</label>
                <div className="grid grid-cols-2 gap-2">
                  {INCOME_RANGES.map(r => (
                    <button key={r.value} onClick={() => set('annualIncome', r.value)}
                      className={`py-2.5 px-3 rounded-xl border-2 text-xs font-body text-left transition-all ${
                        profile.annualIncome === r.value ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-cream-200 bg-white text-gray-600 hover:border-teal-300'
                      }`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleFindSchemes}
              className="w-full mt-8 py-3.5 bg-saffron-400 text-teal-900 rounded-2xl font-display font-bold text-base hover:bg-saffron-500 transition-colors flex items-center justify-center gap-2"
            >
              <Search size={18} /> Find My Schemes →
            </button>
          </div>
        )}

        {/* ── STEP 3: Results ── */}
        {step === 3 && (
          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={40} className="animate-spin text-teal-600" />
                <p className="font-body text-gray-600 text-sm">Searching 3400+ government schemes...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🎉</div>
                  <h2 className="font-display font-bold text-xl text-teal-800">
                    {totalFound} Schemes Found For You!
                  </h2>
                  <p className="text-gray-500 text-sm font-body mt-1">
                    {results?.eligible?.length} eligible · {results?.partial?.length} potentially eligible
                  </p>
                  <button
                    onClick={() => { setStep(1); setResults(null); setProfile({ occupation: '', state: '', age: '', category: '', annualIncome: null, gender: '' }); }}
                    className="mt-3 text-sm text-teal-600 hover:text-teal-800 underline font-body"
                  >
                    ← Change my details
                  </button>
                </div>

                {totalFound === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <div className="text-5xl mb-3">🔍</div>
                    <p>No schemes matched your profile. Try broadening your details or <a href="/chat" className="text-teal-600 underline">ask our AI</a>.</p>
                  </div>
                ) : (
                  <>
                    {results.eligible.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-display font-semibold text-teal-800 mb-3 flex items-center gap-2">
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✅ Eligible</span>
                          {results.eligible.length} schemes you qualify for
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {results.eligible.map(s => <SchemeCard key={s._id} scheme={s} />)}
                        </div>
                      </div>
                    )}
                    {results.partial.length > 0 && (
                      <div>
                        <h3 className="font-display font-semibold text-gray-600 mb-3 flex items-center gap-2">
                          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">⚡ Possibly Eligible</span>
                          {results.partial.length} more to explore
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {results.partial.slice(0, 6).map(s => <SchemeCard key={s._id} scheme={s} />)}
                        </div>
                      </div>
                    )}
                    <div className="mt-8 text-center">
                      <a href="/chat" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-display font-bold text-sm hover:bg-teal-800 transition-colors">
                        💬 Ask AI for detailed guidance
                      </a>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
