import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Search, Shield, Clock, ArrowRight } from 'lucide-react';

const features = [
  { icon: '💬', title: 'Conversational AI', desc: 'Just talk naturally in Hindi or English. No forms to fill.' },
  { icon: '🎯', title: 'Personalized Match', desc: 'Get schemes tailored to your age, state, occupation, and income.' },
  { icon: '📋', title: 'Explainable Results', desc: 'Know exactly why you qualify or don\'t — full transparency.' },
  { icon: '🎙️', title: 'Voice Support', desc: 'Speak in Hindi, Hinglish, or regional languages. Ideal for rural users.' },
  { icon: '📅', title: 'Deadline Alerts', desc: 'Never miss an application deadline with smart reminders.' },
  { icon: '🔖', title: 'Save & Track', desc: 'Save schemes, track applications, get status updates.' },
];

const categories = [
  { icon: '📚', label: 'Education', value: 'education' },
  { icon: '🌾', label: 'Agriculture', value: 'agriculture' },
  { icon: '👩', label: 'Women', value: 'women' },
  { icon: '🏠', label: 'Housing', value: 'housing' },
  { icon: '🚀', label: 'Startup', value: 'startup' },
  { icon: '💼', label: 'Employment', value: 'employment' },
  { icon: '🏥', label: 'Health', value: 'health' },
  { icon: '🛡️', label: 'Social Security', value: 'social-security' },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-teal-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-saffron-400 text-teal-800 text-xs font-display font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">AI-Powered</span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
            Your Personal Guide to<br />
            <span className="text-saffron-400">Government Schemes</span>
          </h1>
          <p className="text-teal-200 font-body text-base sm:text-lg mb-2">योजना सहायक — India ka Digital Welfare Assistant</p>
          <p className="text-teal-300 font-body text-sm max-w-xl mx-auto mb-8">
            Tell us about yourself and instantly discover all government schemes you're eligible for — in Hindi or English, by voice or text.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/chat" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-saffron-400 text-teal-800 font-display font-bold rounded-xl hover:bg-saffron-500 transition-colors text-sm">
              <MessageSquare size={18} /> Start Chatting Free
            </Link>
            <Link to="/schemes" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-teal-500 text-teal-200 font-display font-medium rounded-xl hover:bg-teal-700 transition-colors text-sm">
              <Search size={18} /> Browse All Schemes
            </Link>
          </div>
        </div>
      </section>

      {/* Example query */}
      <section className="bg-teal-900 py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-teal-300 text-xs mb-3 font-body">Try asking questions like:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              '"I\'m a 20-year-old B.Tech student from Rajasthan"',
              '"मैं एक किसान हूँ, 3 एकड़ ज़मीन है"',
              '"Widow in Jaipur, need pension"',
              '"Women entrepreneur schemes"',
            ].map(q => (
              <span key={q} className="text-xs bg-teal-800 text-teal-300 border border-teal-700 px-3 py-1.5 rounded-full font-body italic">{q}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 px-4 bg-cream-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-teal-800 text-center mb-6">Browse by Category</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map(cat => (
              <Link key={cat.value} to={`/schemes?category=${cat.value}`}
                className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-cream-200 hover:border-teal-400 hover:shadow-sm transition-all group">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-display font-medium text-gray-700 text-center leading-tight group-hover:text-teal-700">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-teal-800 text-center mb-8">Why Yojana Sahayak?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.title} className="p-4 rounded-xl border border-cream-200 hover:border-teal-200 hover:shadow-sm transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-display font-semibold text-gray-900 mb-1 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 font-body leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-teal-800 text-center">
        <h2 className="font-display font-bold text-2xl text-cream-50 mb-3">Start for Free — No Registration Needed</h2>
        <p className="text-teal-300 font-body text-sm mb-6">Create an account to save schemes, get reminders, and track applications.</p>
        <Link to="/chat" className="inline-flex items-center gap-2 px-8 py-3 bg-saffron-400 text-teal-800 font-display font-bold rounded-xl hover:bg-saffron-500 transition-colors">
          Chat with AI Now <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
