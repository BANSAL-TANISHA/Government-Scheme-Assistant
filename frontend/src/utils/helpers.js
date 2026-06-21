export const formatCurrency = (amount) => {
  if (!amount) return '';
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} lakh`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const categoryColors = {
  education: 'bg-blue-100 text-blue-700',
  agriculture: 'bg-green-100 text-green-700',
  women: 'bg-pink-100 text-pink-700',
  health: 'bg-red-100 text-red-700',
  housing: 'bg-orange-100 text-orange-700',
  employment: 'bg-purple-100 text-purple-700',
  'social-security': 'bg-yellow-100 text-yellow-700',
  startup: 'bg-indigo-100 text-indigo-700',
  'skill-development': 'bg-teal-100 text-teal-700',
  minority: 'bg-rose-100 text-rose-700',
  disability: 'bg-cyan-100 text-cyan-700',
  other: 'bg-gray-100 text-gray-700',
};

export const getCategoryLabel = (cat) => {
  const labels = {
    education: 'Education', agriculture: 'Agriculture', women: 'Women',
    health: 'Health', housing: 'Housing', employment: 'Employment',
    'social-security': 'Social Security', startup: 'Startup',
    'skill-development': 'Skill Dev', minority: 'Minority', disability: 'Disability', other: 'Other',
  };
  return labels[cat] || cat;
};
