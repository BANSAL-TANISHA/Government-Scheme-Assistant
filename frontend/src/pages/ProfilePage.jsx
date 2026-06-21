import React, { useEffect, useState } from 'react';
import { profileAPI } from '../services/api';
import ProfileForm from '../components/profile/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileAPI.get()
      .then(res => setProfile(res.data.profile))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-teal-600" size={28} /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="font-display font-bold text-2xl text-teal-800 mb-1">My Profile</h1>
      <p className="text-gray-500 text-sm font-body mb-6">Complete your profile to get accurate scheme recommendations.</p>

      {!user?.isProfileComplete && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-body">
          ⚠️ Profile incomplete — fill in your details to unlock personalized scheme matching.
        </div>
      )}

      <div className="card">
        <ProfileForm initialProfile={profile || {}} onSaved={() => updateUser({ isProfileComplete: true })} />
      </div>
    </div>
  );
};

export default ProfilePage;
