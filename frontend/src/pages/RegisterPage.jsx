import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Please complete your profile.');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 bg-cream-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-teal-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-saffron-400 font-display font-bold text-2xl">य</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-teal-800">Create Account</h1>
          <p className="text-gray-500 text-sm font-body mt-1">Join to save schemes and get personalized alerts</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Ramesh Kumar' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Mobile Number (optional)', key: 'phone', type: 'tel', placeholder: '9XXXXXXXXX' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'Confirm Password', key: 'confirmPassword', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-display font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                required={f.key !== 'phone'} className="input-field" placeholder={f.placeholder} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-500 font-body">
            Already have an account? <Link to="/login" className="text-teal-600 hover:underline font-medium">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
