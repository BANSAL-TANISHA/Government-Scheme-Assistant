import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { profileAPI, schemesAPI } from '../services/api';
import ProfileForm from '../components/profile/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { Loader2, Sparkles, Target } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    profileAPI.get()
      .then(res => setProfile(res.data.profile))
      .finally(() => setLoading(false));
  }, []);

  const handleFindMySchemes = async () => {
    if (!profile) { toast.error('Please save your profile first'); return; }
    setMatching(true);
    try {
      // Build profile object from saved profile data
      const profileData = {
        age: profile.age,
        gender: profile.gender,
        state: profile.state,
        occupation: profile.occupation,
        annualIncome: profile.annualIncome,
        category: profile.category,
        education: profile.education,
        isDisabled: profile.isDisabled,
      };
      // Remove undefined/null
      Object.keys(profileData).forEach(k => {
        if (!profileData[k]) delete profileData[k];
      });

      const res = await schemesAPI.match(profileData);
      const total = res.data.results.eligible.length + res.data.results.partial.length;
      toast.success(`Found ${total} matching schemes!`);
      // Store results in sessionStorage to pass to onboarding page result view
      sessionStorage.setItem('matchResults', JSON.stringify(res.data.results));
      navigate('/find-schemes?fromProfile=true');
    } catch (e) {
      toast.error('Failed to match schemes');
    } finally {
      setMatching(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-teal-600" size={28} /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="font-display font-bold text-2xl text-teal-800 mb-1">My Profile</h1>
      <p className="text-gray-500 text-sm font-body mb-4">Complete your profile to get accurate scheme recommendations.</p>

      {!user?.isProfileComplete && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-body">
          ⚠️ Profile incomplete — fill in your details to unlock personalized scheme matching.
        </div>
      )}

      {/* Find My Schemes CTA — shown when profile is complete */}
      {user?.isProfileComplete && (
        <div className="mb-5 bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-5 text-white">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🎯</div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-lg">Find Schemes For My Profile</h2>
              <p className="text-teal-200 text-sm font-body mt-0.5 mb-3">
                Instantly match all 3400+ schemes against your saved profile details.
              </p>
              <button
                onClick={handleFindMySchemes}
                disabled={matching}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-saffron-400 text-teal-900 rounded-xl font-display font-bold text-sm hover:bg-saffron-500 transition-colors disabled:opacity-70"
              >
                {matching ? <><Loader2 size={15} className="animate-spin" /> Finding schemes...</> : <><Sparkles size={15} /> Find My Schemes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <ProfileForm
          initialProfile={profile || {}}
          onSaved={() => { updateUser({ isProfileComplete: true }); setProfileSaved(true); }}
        />
      </div>

      {profileSaved && !user?.isProfileComplete && (
        <div className="mt-4 text-center">
          <button onClick={handleFindMySchemes} disabled={matching}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-xl font-display font-bold text-sm hover:bg-teal-800 transition-colors disabled:opacity-70">
            {matching ? <><Loader2 size={15} className="animate-spin" /> Searching...</> : <><Target size={15} /> Find My Schemes Now</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
