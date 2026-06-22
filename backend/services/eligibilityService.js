/**
 * Eligibility Matching Engine v3
 * - Excludes schemes from OTHER states when user mentions their state
 * - Central/national schemes (no other state mentioned) always shown
 * - Keyword-based occupation matching as fallback for Kaggle dataset
 */

// All Indian state and UT names — used to detect state-specific schemes in text
const ALL_STATES = [
  'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
  'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
  'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
  'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu',
  'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
  'delhi', 'jammu and kashmir', 'ladakh', 'puducherry', 'chandigarh',
  'andaman and nicobar', 'dadra and nagar haveli', 'daman and diu', 'lakshadweep',
];

// Keywords that map to occupations
const OCCUPATION_KEYWORDS = {
  student: [
    'student', 'scholarship', 'education', 'school', 'college', 'university',
    'btech', 'b.tech', 'engineering', 'medical', 'mbbs', 'study', 'academic',
    'tuition', 'fee', 'merit', 'post matric', 'pre matric', 'stipend',
    'vidya', 'shiksha', 'chhatra', 'fellowship', 'degree', 'course',
    'अध्ययन', 'छात्र', 'छात्रवृत्ति',
  ],
  farmer: [
    'farmer', 'kisan', 'agriculture', 'farming', 'crop', 'soil', 'irrigation',
    'seed', 'fertilizer', 'mandi', 'agri', 'horticulture', 'fishermen', 'fishery',
    'animal husbandry', 'dairy', 'poultry', 'krishi', 'fasal', 'भूमि', 'किसान',
  ],
  'self-employed': [
    'mudra', 'loan', 'enterprise', 'msme', 'business', 'startup', 'entrepreneur',
    'self employed', 'vendor', 'artisan', 'handicraft', 'weaver', 'credit',
    'microfinance', 'svnidhi', 'udyog', 'vyapar',
  ],
  women: [
    'women', 'mahila', 'girl', 'beti', 'widow', 'maternity', 'female',
    'stree', 'nari', 'shakti', 'ladli', 'kanya', 'बेटी', 'महिला',
  ],
  unemployed: [
    'employment', 'job', 'rozgar', 'skill', 'training', 'apprentice',
    'placement', 'internship', 'nrega', 'mnrega', 'labour', 'worker',
  ],
  retired: [
    'pension', 'senior citizen', 'old age', 'vridha', 'elderly', 'retire',
  ],
};

const CATEGORY_TO_OCCUPATION = {
  education: 'student',
  agriculture: 'farmer',
  startup: 'self-employed',
  'skill-development': 'unemployed',
  'social-security': 'retired',
};

/**
 * Returns true if the scheme is for a DIFFERENT state than the user's.
 *
 * Logic:
 * - If scheme.state field is set to a different state → exclude
 * - If scheme name/description explicitly mentions another Indian state → exclude
 * - If no other state is found → keep (it's a central/national scheme)
 *
 * This means central schemes like PM Kisan, AICTE, NSP are always shown
 * to everyone regardless of their state.
 */
const isForDifferentState = (scheme, userState) => {
  if (!userState) return false;

  const userStateLower = userState.toLowerCase().trim();

  // If the scheme has an explicit state field set to a different state → exclude
  if (scheme.state && scheme.state.toLowerCase().trim() !== userStateLower) {
    return true;
  }

  // Build scheme text to scan
  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.ministry || '',
  ].join(' ').toLowerCase();

  // Check if any OTHER state name appears as a whole word in the scheme text
  for (const state of ALL_STATES) {
    if (state === userStateLower) continue; // skip the user's own state
    // Word-boundary check to avoid partial matches (e.g. "goa" inside "arogya")
    const pattern = new RegExp(`\\b${state.replace(/\s+/g, '\\s+')}\\b`);
    if (pattern.test(schemeText)) {
      return true; // explicitly belongs to a different state
    }
  }

  return false; // no other state found → central/national scheme, show to all
};

/**
 * Main matching function.
 * Filters by state first, then scores each scheme by relevance.
 */
const matchSchemes = (userProfile, schemes) => {
  const eligible = [];
  const partial = [];

  for (const scheme of schemes) {
    // ── STATE FILTER ──
    // Skip schemes from other states when user has mentioned their state
    if (userProfile.state && isForDifferentState(scheme, userProfile.state)) {
      continue;
    }

    const result = scoreScheme(userProfile, scheme);
    if (result.score <= 0) continue;

    const schemeObj = scheme.toObject ? scheme.toObject() : { ...scheme };

    if (result.status === 'eligible') {
      eligible.push({ ...schemeObj, matchResult: result, score: result.score });
    } else if (result.status === 'partial') {
      partial.push({ ...schemeObj, matchResult: result, score: result.score });
    }
  }

  // Sort by score — most relevant first (state-specific schemes get bonus points)
  eligible.sort((a, b) => b.score - a.score);
  partial.sort((a, b) => b.score - a.score);

  return { eligible, partial };
};

/**
 * Score a single scheme against a user profile.
 * Returns { status, reasons, score }
 */
const scoreScheme = (profile, scheme) => {
  const e = scheme.eligibility || {};
  const reasons = { met: [], notMet: [], unknown: [] };
  let score = 0;
  let hardFail = false;

  // ════════════════════════════════════════════
  // HARD FAILS — any of these → instantly ineligible
  // ════════════════════════════════════════════

  if (e.minAge && profile.age && profile.age < e.minAge) {
    hardFail = true;
    reasons.notMet.push(`Minimum age is ${e.minAge} (you are ${profile.age})`);
  }
  if (e.maxAge && profile.age && profile.age > e.maxAge) {
    hardFail = true;
    reasons.notMet.push(`Maximum age is ${e.maxAge} (you are ${profile.age})`);
  }
  if (e.gender && e.gender !== 'all' && profile.gender && profile.gender !== e.gender) {
    hardFail = true;
    reasons.notMet.push(`This scheme is only for ${e.gender}`);
  }
  if (e.maxAnnualIncome && profile.annualIncome && profile.annualIncome > e.maxAnnualIncome) {
    hardFail = true;
    reasons.notMet.push(`Income limit is ₹${(e.maxAnnualIncome / 100000).toFixed(1)} lakh`);
  }
  if (e.states && e.states.length > 0 && profile.state &&
      !e.states.map(s => s.toLowerCase()).includes(profile.state.toLowerCase())) {
    hardFail = true;
    reasons.notMet.push(`Only available in: ${e.states.join(', ')}`);
  }
  if (e.category && e.category.length > 0 && !e.category.includes('all') && profile.category) {
    if (!e.category.includes(profile.category)) {
      hardFail = true;
      reasons.notMet.push(`Only for ${e.category.map(c => c.toUpperCase()).join('/')} category`);
    }
  }

  if (hardFail) return { status: 'ineligible', reasons, score: 0 };

  // ════════════════════════════════════════════
  // POSITIVE SCORING — add points for each match
  // ════════════════════════════════════════════

  // Age match
  if (e.minAge || e.maxAge) {
    if (profile.age) { score += 15; reasons.met.push('Age is within range'); }
    else reasons.unknown.push('Age not provided');
  }

  // Gender match
  if (e.gender && e.gender !== 'all') {
    if (profile.gender === e.gender) { score += 20; reasons.met.push('Gender matches'); }
    else if (!profile.gender) reasons.unknown.push('Gender not provided');
  }

  // Income match
  if (e.maxAnnualIncome) {
    if (profile.annualIncome) { score += 15; reasons.met.push('Income within limit'); }
    else reasons.unknown.push('Income not provided');
  }

  // Explicit state match (eligibility.states[] field)
  if (e.states && e.states.length > 0) {
    if (profile.state && e.states.map(s => s.toLowerCase()).includes(profile.state.toLowerCase())) {
      score += 25;
      reasons.met.push(`${profile.state} is eligible`);
    } else if (!profile.state) {
      reasons.unknown.push('State not provided');
    }
  }

  // Bonus: scheme name/description explicitly mentions user's own state → boost relevance
  if (profile.state) {
    const schemeText = [scheme.name || '', scheme.description || '', scheme.ministry || ''].join(' ').toLowerCase();
    if (schemeText.includes(profile.state.toLowerCase())) {
      score += 20;
      reasons.met.push(`Scheme is specific to ${profile.state}`);
    }
  }

  // Occupation from eligibility.occupation field
  if (e.occupation && e.occupation.length > 0) {
    if (profile.occupation && e.occupation.includes(profile.occupation)) {
      score += 30;
      reasons.met.push(`Occupation matches: ${profile.occupation}`);
    } else if (!profile.occupation) {
      reasons.unknown.push('Occupation not provided');
    } else {
      score -= 10; // slight penalty for occupation mismatch (not a hard fail)
    }
  }

  // ════════════════════════════════════════════
  // KEYWORD MATCHING — for Kaggle schemes with empty eligibility fields
  // Scan scheme name + description for occupation-relevant keywords
  // ════════════════════════════════════════════
  if (profile.occupation) {
    const schemeText = [
      scheme.name || '',
      scheme.description || '',
      scheme.category || '',
      scheme.tags?.join(' ') || '',
    ].join(' ').toLowerCase();

    const keywords = OCCUPATION_KEYWORDS[profile.occupation] || [];
    let keywordHits = 0;
    const matchedKeywords = [];

    for (const kw of keywords) {
      if (schemeText.includes(kw)) {
        keywordHits++;
        matchedKeywords.push(kw);
        if (keywordHits >= 3) break; // cap at 3 hits
      }
    }

    if (keywordHits > 0) {
      score += keywordHits * 15;
      reasons.met.push(`Scheme relevant to ${profile.occupation} (${matchedKeywords.join(', ')})`);
    }

    // Women keyword bonus for female users
    if (profile.gender === 'female') {
      const womenKws = OCCUPATION_KEYWORDS.women;
      for (const kw of womenKws) {
        if (schemeText.includes(kw)) {
          score += 10;
          reasons.met.push('Women-focused scheme detected');
          break;
        }
      }
    }

    // Category bonus — if scheme category directly maps to user occupation
    const expectedCategory = CATEGORY_TO_OCCUPATION[scheme.category];
    if (expectedCategory === profile.occupation) {
      score += 20;
      reasons.met.push(`Category (${scheme.category}) matches your profile`);
    }
  }

  // ════════════════════════════════════════════
  // DETERMINE STATUS
  // ════════════════════════════════════════════
  let status;
  if (score <= 0) {
    status = 'ineligible';
  } else if (reasons.unknown.length > 0 && reasons.met.length === 0) {
    status = 'partial';
  } else if (score >= 25) {
    status = 'eligible';
  } else {
    status = 'partial';
  }

  return { status, reasons, score };
};

module.exports = { matchSchemes, scoreScheme };