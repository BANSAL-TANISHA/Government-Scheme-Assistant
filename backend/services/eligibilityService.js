/**
 * Eligibility Matching Engine v4
 *
 * Key improvements over v3:
 * - Education-level hard filter: Graduate users NEVER see class 1-12 student schemes
 * - Occupation mismatch hard filter: self-employed/entrepreneur users NEVER see school scholarship schemes
 * - Widow boost: +150 score for schemes explicitly for widows
 * - State filter: excludes other-state schemes, boosts same-state schemes
 */

// All Indian state names — for detecting state-specific schemes in text
const ALL_STATES = [
  'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
  'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
  'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
  'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu',
  'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
  'delhi', 'jammu and kashmir', 'ladakh', 'puducherry', 'chandigarh',
  'andaman and nicobar', 'dadra and nagar haveli', 'daman and diu', 'lakshadweep',
];

// Education level hierarchy — higher = more educated
const EDUCATION_RANK = {
  '10th': 1, '12th': 2, 'Diploma': 2, 'ITI': 2,
  'Graduate': 3, 'Post-Graduate': 4, 'PhD': 5,
};

// Keywords that mark a scheme as school-level ONLY (class 1-12)
const SCHOOL_LEVEL_KEYWORDS = [
  'class 1', 'class 2', 'class 3', 'class 4', 'class 5', 'class 6',
  'class 7', 'class 8', 'class 9', 'class 10', 'class 11', 'class 12',
  '1st to 8th', '1 to 8', '6th to 8th', '9th to 12th', '6 to 12',
  'pre matric', 'pre-matric', 'prematric',
  'class i ', 'class ii ', 'class iii ', 'class iv ',
  'bicycle distribution', 'free bicycle',
  'primary school', 'middle school', 'high school',
  'classes 1', 'classes 2', 'classes 3', 'classes 4', 'classes 5',
  'classes 6', 'classes 7', 'classes 8', 'classes 9',
];

// Keywords that mark a scheme as post-matric/higher education
const HIGHER_EDUCATION_KEYWORDS = [
  'post matric', 'post-matric', 'postmatric', 'undergraduate', 'graduation',
  'degree', 'college', 'university', 'btech', 'b.tech', 'engineering college',
  'higher education', 'ug ', 'pg ', 'postgraduate', 'masters', 'phd',
  'professional course', 'vocational', 'technical education',
];

// Scheme text keywords that strongly indicate a scheme is for students
const STUDENT_ONLY_KEYWORDS = [
  'scholarship for students', 'student scholarship', 'merit scholarship',
  'pre matric scholarship', 'post matric scholarship',
  'bicycle distribution', 'free bicycle', 'scooty distribution',
  'tuition fee reimbursement', 'school fee', 'hostel for students',
];

// Occupation keyword groups for scoring
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
    'microfinance', 'svnidhi', 'udyog', 'vyapar', 'women entrepreneur',
    'mahila udyog', 'self help group', 'shg', 'skill', 'training', 'employment',
  ],
  widow: [
    'widow', 'vidhwa', 'widowed', 'विधवा', 'nirashrit mahila', 'abandoned women',
    'destitute women', 'निराश्रित महिला', 'ekla nari', 'single woman',
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
 * Returns true if the scheme belongs to a DIFFERENT state than the user.
 */
const isForDifferentState = (scheme, userState) => {
  if (!userState) return false;
  const userStateLower = userState.toLowerCase().trim();

  if (scheme.state && scheme.state.toLowerCase().trim() !== userStateLower) {
    return true;
  }

  const schemeText = [scheme.name || '', scheme.description || '', scheme.ministry || ''].join(' ').toLowerCase();

  for (const state of ALL_STATES) {
    if (state === userStateLower) continue;
    const pattern = new RegExp(`\\b${state.replace(/\s+/g, '\\s+')}\\b`);
    if (pattern.test(schemeText)) return true;
  }

  return false;
};

/**
 * Returns true if the scheme is clearly school-level only AND user is educated above that.
 * e.g. Graduate user should NOT see "Bicycle for Class 6 girls"
 */
const isEducationMismatch = (profile, scheme) => {
  const userEduRank = EDUCATION_RANK[profile.education] || 0;
  if (userEduRank < 3) return false; // Only filter for Graduate and above

  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.benefits || '',
  ].join(' ').toLowerCase();

  // If scheme text clearly mentions school classes only → mismatch
  const isSchoolOnly = SCHOOL_LEVEL_KEYWORDS.some(kw => schemeText.includes(kw));
  if (!isSchoolOnly) return false;

  // But if it ALSO mentions higher education terms → keep it (e.g. "class 10 to graduation")
  const hasHigherEdu = HIGHER_EDUCATION_KEYWORDS.some(kw => schemeText.includes(kw));
  return !hasHigherEdu;
};

/**
 * Returns true if user occupation is not student BUT scheme is clearly a student-only scheme.
 * e.g. self-employed user should NOT see "Pre-Matric scholarship for class 6 students"
 */
const isOccupationHardMismatch = (profile, scheme) => {
  // Only apply if user explicitly has a non-student occupation
  const nonStudentOccupations = ['farmer', 'self-employed', 'employed', 'retired', 'widow'];
  if (!nonStudentOccupations.includes(profile.occupation)) return false;

  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.benefits || '',
    scheme.category || '',
  ].join(' ').toLowerCase();

  // If scheme is clearly student-targeted → mismatch
  return STUDENT_ONLY_KEYWORDS.some(kw => schemeText.includes(kw));
};

/**
 * Main matching function.
 */
const matchSchemes = (userProfile, schemes) => {
  const eligible = [];
  const partial = [];

  for (const scheme of schemes) {
    // ── FILTER 1: State mismatch ──
    if (userProfile.state && isForDifferentState(scheme, userProfile.state)) continue;

    // ── FILTER 2: Education level mismatch ──
    // Graduate+ users never see school-level schemes
    if (isEducationMismatch(userProfile, scheme)) continue;

    // ── FILTER 3: Occupation hard mismatch ──
    // Non-students never see student-scholarship-only schemes
    if (isOccupationHardMismatch(userProfile, scheme)) continue;

    const result = scoreScheme(userProfile, scheme);
    if (result.score <= 0) continue;

    const schemeObj = scheme.toObject ? scheme.toObject() : { ...scheme };

    if (result.status === 'eligible') {
      eligible.push({ ...schemeObj, matchResult: result, score: result.score });
    } else if (result.status === 'partial') {
      partial.push({ ...schemeObj, matchResult: result, score: result.score });
    }
  }

  eligible.sort((a, b) => b.score - a.score);
  partial.sort((a, b) => b.score - a.score);

  return { eligible, partial };
};

/**
 * Score a single scheme against a user profile.
 */
const scoreScheme = (profile, scheme) => {
  const e = scheme.eligibility || {};
  const reasons = { met: [], notMet: [], unknown: [] };
  let score = 0;
  let hardFail = false;

  // ════════════════════════════════════════════
  // HARD FAILS
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
  // BUILD SCHEME TEXT FOR KEYWORD MATCHING
  // ════════════════════════════════════════════
  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.benefits || '',
    scheme.category || '',
    (scheme.tags || []).join(' '),
  ].join(' ').toLowerCase();

  // ════════════════════════════════════════════
  // POSITIVE SCORING
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

  // State text mention bonus
  if (profile.state) {
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
      score -= 10;
    }
  }

  // ════════════════════════════════════════════
  // KEYWORD MATCHING
  // ════════════════════════════════════════════

  const occupation = profile.occupation;

  if (occupation) {
    const keywords = OCCUPATION_KEYWORDS[occupation] || [];
    let keywordHits = 0;
    const matchedKeywords = [];

    for (const kw of keywords) {
      if (schemeText.includes(kw)) {
        keywordHits++;
        matchedKeywords.push(kw);
        if (keywordHits >= 3) break;
      }
    }

    if (keywordHits > 0) {
      score += keywordHits * 15;
      reasons.met.push(`Scheme relevant to ${occupation} (${matchedKeywords.join(', ')})`);
    }

    // Category bonus
    const expectedCategory = CATEGORY_TO_OCCUPATION[scheme.category];
    if (expectedCategory === occupation) {
      score += 20;
      reasons.met.push(`Category (${scheme.category}) matches your profile`);
    }

    // Extra boost: self-employed women get women-startup category bonus
    if (occupation === 'self-employed' && profile.gender === 'female') {
      if (schemeText.includes('women') || schemeText.includes('mahila') ||
        schemeText.includes('stree') || schemeText.includes('nari')) {
        score += 25;
        reasons.met.push('Scheme supports women entrepreneurs');
      }
    }
  }

  // Women keyword bonus for female users (only if NOT exclusively student scheme)
  if (profile.gender === 'female') {
    const womenKws = OCCUPATION_KEYWORDS.women;
    for (const kw of womenKws) {
      if (schemeText.includes(kw)) {
        score += 8;
        reasons.met.push('Women-focused scheme detected');
        break;
      }
    }
  }

  // WIDOW BOOST
  if (profile.maritalStatus === 'widow' || profile.occupation === 'widow') {
    if (schemeText.includes('widow') || schemeText.includes('vidhwa') || schemeText.includes('विधवा')) {
      score += 150;
      reasons.met.push('Scheme is explicitly for widows');
    }
  }

  // ════════════════════════════════════════════
  // EDUCATION MATCH / PENALTY
  // ════════════════════════════════════════════
  if (profile.education) {
    const userRank = EDUCATION_RANK[profile.education] || 0;

    // If user is graduate+ and scheme mentions higher education → small boost
    if (userRank >= 3 && HIGHER_EDUCATION_KEYWORDS.some(kw => schemeText.includes(kw))) {
      score += 10;
      reasons.met.push('Scheme is relevant to your education level');
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