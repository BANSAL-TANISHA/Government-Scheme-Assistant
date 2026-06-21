import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import StatsCard from '../components/dashboard/StatsCard';
import SavedSchemes from '../components/dashboard/SavedSchemes';
import { MessageSquare, User, Search } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    profileAPI.get().then(res => setProfileData(res.data)).catch(console.error);
  }, []);

  const savedSchemes = profileData?.user?.savedSchemes || [];
  const appliedSchemes = profileData?.user?.appliedSchemes || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Welcome */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-teal-800">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 text-sm font-body mt-0.5">Here's your Yojana Sahayak dashboard</p>
        </div>
        {!user?.isProfileComplete && (
          <Link to="/profile" className="btn-primary text-sm">Complete Profile →</Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatsCard icon="🔖" label="Saved Schemes" value={savedSchemes.length} color="teal" />
        <StatsCard icon="✅" label="Applied" value={appliedSchemes.length} color="green" />
        <StatsCard icon="🏛️" label="Total Schemes" value="1000+" color="blue" />
        <StatsCard icon="🔔" label="Alerts Active" value={savedSchemes.length} color="amber" />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <Link to="/chat" className="card hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700"><MessageSquare size={20} /></div>
          <div>
            <p className="font-display font-semibold text-sm text-gray-800 group-hover:text-teal-700">Chat with AI</p>
            <p className="text-xs text-gray-400 font-body">Find new schemes</p>
          </div>
        </Link>
        <Link to="/schemes" className="card hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700"><Search size={20} /></div>
          <div>
            <p className="font-display font-semibold text-sm text-gray-800 group-hover:text-teal-700">Browse Schemes</p>
            <p className="text-xs text-gray-400 font-body">Search & filter</p>
          </div>
        </Link>
        <Link to="/profile" className="card hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700"><User size={20} /></div>
          <div>
            <p className="font-display font-semibold text-sm text-gray-800 group-hover:text-teal-700">My Profile</p>
            <p className="text-xs text-gray-400 font-body">{user?.isProfileComplete ? 'Profile complete ✅' : 'Complete profile'}</p>
          </div>
        </Link>
      </div>

      {/* Saved Schemes */}
      <div>
        <h2 className="font-display font-semibold text-gray-800 mb-3">Saved Schemes</h2>
        <SavedSchemes schemes={savedSchemes} />
      </div>
    </div>
  );
};

export default DashboardPage;
