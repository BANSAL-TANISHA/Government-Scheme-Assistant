import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-cream-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-teal-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-saffron-400 font-display font-bold text-2xl">य</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-teal-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm font-body mt-1">Login to your Yojana Sahayak account</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-xs font-display font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-display font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center text-sm text-gray-500 font-body">
            Don't have an account? <Link to="/register" className="text-teal-600 hover:underline font-medium">Register here</Link>
          </p>
        </form>

        <div className="mt-4 text-center">
          <Link to="/chat" className="text-sm text-gray-400 hover:text-teal-600 font-body">Continue without account →</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
