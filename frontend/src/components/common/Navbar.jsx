import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, X, MessageSquare, LayoutDashboard, User, LogOut, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/chat', label: 'Chat', icon: <MessageSquare size={16} /> },
    { to: '/schemes', label: 'Schemes', icon: <BookOpen size={16} /> },
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-teal-800 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-saffron-400 flex items-center justify-center font-display font-bold text-teal-800 text-sm">य</div>
          <div>
            <span className="font-display font-bold text-cream-50 text-base leading-none">Yojana Sahayak</span>
            <span className="block text-teal-400 text-[10px] leading-none font-body">योजना सहायक</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-display font-medium transition-colors ${isActive(link.to) ? 'bg-teal-600 text-cream-50' : 'text-teal-200 hover:bg-teal-700 hover:text-cream-50'}`}>
              {link.icon}{link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link to="/notifications" className="p-2 rounded-md text-teal-200 hover:bg-teal-700 hover:text-cream-50 transition-colors" title="Notifications">
                <Bell size={18} />
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-teal-200 hover:bg-teal-700 transition-colors">
                <div className="w-6 h-6 rounded-full bg-saffron-400 flex items-center justify-center text-xs font-bold text-teal-800">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="text-sm font-display">{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="p-2 rounded-md text-teal-300 hover:bg-teal-700 hover:text-cream-50 transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-1.5 text-sm font-display font-medium text-teal-200 hover:text-cream-50 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-1.5 text-sm font-display font-semibold bg-saffron-400 text-teal-800 rounded-lg hover:bg-saffron-500 transition-colors">Register</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden p-2 text-teal-200" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-teal-900 border-t border-teal-700 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-display ${isActive(link.to) ? 'bg-teal-600 text-cream-50' : 'text-teal-200'}`}>
              {link.icon}{link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-300 font-display w-full">
              <LogOut size={16} />Logout
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm text-teal-200 border border-teal-600 rounded-lg">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm bg-saffron-400 text-teal-800 font-semibold rounded-lg">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
