/**
 * Eligibility Matching Engine v5
 *
 * Key improvements over v4:
 * - FIXED state filter: scheme.state field is now the PRIMARY authoritative check
 *   If scheme.state = "Tripura" and user is from Rajasthan → BLOCKED immediately
 * - eligibility.states[] used as secondary fallback
 * - Text-based state detection only for state-level schemes or strong residency language
 * - 10th-class student keyword boost added
 * - State-specific scheme scoring boosted (+30/+40)
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
  ],
  farmer: [
    'farmer', 'kisan', 'agriculture', 'farming', 'crop', 'soil', 'irrigation',
    'seed', 'fertilizer', 'mandi', 'agri', 'horticulture', 'fishermen', 'fishery',
    'animal husbandry', 'dairy', 'poultry', 'krishi', 'fasal',
  ],
  'self-employed': [
    'mudra', 'loan', 'enterprise', 'msme', 'business', 'startup', 'entrepreneur',
    'self employed', 'vendor', 'artisan', 'handicraft', 'weaver', 'credit',
    'microfinance', 'svnidhi', 'udyog', 'vyapar', 'women entrepreneur',
    'mahila udyog', 'self help group', 'shg', 'skill', 'training', 'employment',
  ],
  widow: [
    'widow', 'vidhwa', 'widowed', 'nirashrit mahila', 'abandoned women',
    'destitute women', 'ekla nari', 'single woman',
  ],
  women: [
    'women', 'mahila', 'girl', 'beti', 'widow', 'maternity', 'female',
    'stree', 'nari', 'shakti', 'ladli', 'kanya',
  ],
  unemployed: [
    'employment', 'job', 'rozgar', 'skill', 'training', 'apprentice',
    'placement', 'internship', 'nrega', 'mnrega', 'labour', 'worker',
  ],
  retired: [
    'pension', 'old age pension', 'senior citizen', 'old age', 'vridha', 'elderly', 'retire',
    'indira gandhi', 'vridha pension', 'budhapa', 'budhape ki pension',
    'old age home', 'senior', 'pensioner', 'superannuation',
    'mukhyamantri vridhjana', 'vridh', 'aged', 'geriatric',
  ],
};

const CATEGORY_TO_OCCUPATION = {
  education: 'student',
  agriculture: 'farmer',
  startup: 'self-employed',
  'skill-development': 'unemployed',
  'social-security': 'retired',
  women: 'self-employed',
};

/**
 * Returns true if the scheme belongs to a DIFFERENT state than the user.
 *
 * PRIORITY ORDER (most authoritative first):
 * 1. scheme.state field — if set to a different state → block immediately
 * 2. eligibility.states[] — if set and excludes user's state → block
 * 3. Text-based — only blocks if level='state' OR strong residency language detected
 */
const isForDifferentState = (scheme, userState) => {
  if (!userState) return false;
  const userStateLower = userState.toLowerCase().trim();

  // ---- CHECK 1: scheme.state field is most authoritative ----
  if (scheme.state && typeof scheme.state === 'string' && scheme.state.trim() !== '') {
    const schemeStateLower = scheme.state.toLowerCase().trim();
    // If scheme.state is the user's state → allow
    if (schemeStateLower === userStateLower) return false;
    // If scheme.state is a DIFFERENT state → block immediately
    return true;
  }

  // ---- CHECK 2: eligibility.states[] as fallback ----
  const eligStates = (scheme.eligibility && scheme.eligibility.states) || [];
  if (eligStates.length > 0) {
    const statesList = eligStates.map(s => s.toLowerCase().trim());
    // If eligibility.states doesn't include user's state → block
    if (!statesList.includes(userStateLower)) return true;
    // User's state IS listed → allow
    return false;
  }

  // ---- CHECK 3: Text-based detection for remaining cases ----
  // Build scheme text
  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.ministry || '',
  ].join(' ').toLowerCase();

  // Phrases that strongly indicate a scheme is for residents of a specific other state
  const STRONG_STATE_PHRASES = [
    'resident of',
    'residents of',
    'domicile of',
    'government of',
    'govt. of',
    'state of',
    'belonging to',
    'natives of',
    'directorate of secondary education',
    'directorate of',
    'launched by the directorate',
    'department of',
  ];

  for (const state of ALL_STATES) {
    if (state === userStateLower) continue;
    const statePattern = new RegExp('\\b' + state.replace(/\s+/g, '\\s+') + '\\b', 'i');

    if (statePattern.test(schemeText)) {
      // If scheme is explicitly state-level → block
      if (scheme.level === 'state') return true;

      // If user's own state is ALSO mentioned → multi-state scheme, allow
      const userStatePattern = new RegExp('\\b' + userStateLower.replace(/\s+/g, '\\s+') + '\\b', 'i');
      if (userStatePattern.test(schemeText)) return false;

      // Check for strong state-specific residency/government language
      const hasStrongContext = STRONG_STATE_PHRASES.some(phrase => {
        const phrasePattern = new RegExp(
          phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+(?:the\\s+)?' + state.replace(/\s+/g, '\\s+'),
          'i'
        );
        return phrasePattern.test(schemeText);
      });

      if (hasStrongContext) return true;
    }
  }

  return false;
};

/**
 * Returns true if the scheme is clearly school-level only AND user is educated above that.
 */
const isEducationMismatch = (profile, scheme) => {
  const userEduRank = EDUCATION_RANK[profile.education] || 0;
  if (userEduRank < 3) return false; // Only filter for Graduate and above

  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.benefits || '',
  ].join(' ').toLowerCase();

  const isSchoolOnly = SCHOOL_LEVEL_KEYWORDS.some(kw => schemeText.includes(kw));
  if (!isSchoolOnly) return false;

  const hasHigherEdu = HIGHER_EDUCATION_KEYWORDS.some(kw => schemeText.includes(kw));
  return !hasHigherEdu;
};

/**
 * Returns true if user occupation is not student BUT scheme is clearly a student-only scheme.
 */
const isOccupationHardMismatch = (profile, scheme) => {
  const nonStudentOccupations = ['farmer', 'self-employed', 'employed', 'retired', 'widow'];
  if (!nonStudentOccupations.includes(profile.occupation)) return false;

  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.benefits || '',
    scheme.category || '',
  ].join(' ').toLowerCase();

  return STUDENT_ONLY_KEYWORDS.some(kw => schemeText.includes(kw));
};

/**
 * Returns true if the scheme requires POSTGRADUATE/COLLEGE level education,
 * but the user is only at 10th or 12th level.
 *
 * e.g. A 10th/12th student should NOT see schemes that say:
 *  "enrolled in postgraduate", "postgrad first year", "pursuing graduation",
 *  "studying in college for degree", "enrolled in university"
 *
 * NOTE: Schemes that cover a RANGE from 10th → postgrad are NOT excluded
 *       (e.g. "class 10 to graduation" is valid for a 10th student too)
 */
const isPostgradOnlyMismatch = (profile, scheme) => {
  const userEduRank = EDUCATION_RANK[profile.education] || 0;
  // Only apply this filter for 10th and 12th level students
  if (userEduRank >= 3) return false; // Graduate+ users can see postgrad schemes
  if (userEduRank === 0) return false; // Unknown education — don't filter

  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.eligibility ? (scheme.eligibility.otherCriteria || '') : '',
  ].join(' ').toLowerCase();

  // These phrases indicate the scheme is EXCLUSIVELY for postgrad/college students
  const POSTGRAD_ONLY_PHRASES = [
    'enrolled in postgraduate',
    'enrolled in the postgraduate',
    'postgraduate first year',
    'postgrad first year',
    'postgraduation first year',
    'enrolled in final year',
    'pursuing postgraduate',
    'studying in postgraduate',
    'first year of postgraduate',
    'enrolled in a postgraduate',
    'postgraduate program',
    'postgraduate programme',
  ];

  const isPgOnly = POSTGRAD_ONLY_PHRASES.some(phrase => schemeText.includes(phrase));
  if (!isPgOnly) return false;

  // If the scheme ALSO mentions class 10/11/12 → it covers a range, so don't filter
  const hasSchoolLevel = [
    'class 10', '10th', 'class 11', '11th', 'class 12', '12th', 'class ix', 'class x',
    '9th', '10 th', 'secondary school', 'high school',
  ].some(kw => schemeText.includes(kw));

  return !hasSchoolLevel;
};

/**
 * Returns true if the scheme requires a MINIMUM MARKS PERCENTAGE that is
 * higher than what the user actually scored.
 *
 * e.g. User scored 40% in 10th → block schemes requiring 48%, 60%, 75%,
 *      "first division" (60%+), "distinction" (75%+).
 *
 * Uses the LOWEST percentage mentioned in the scheme so we don't block
 * multi-tier schemes (e.g. CM Anuprati has entries for 50%, 60%, 70%).
 * User with 40% can't meet even the lowest (50%), so it's blocked.
 */
const isMarksMismatch = (profile, scheme) => {
  // Only apply if we know the user's marks
  if (!profile.marksPercent) return false;
  const userMarks = profile.marksPercent;

  // Include benefits field — some schemes (e.g. CM Anuprati) store marks criteria there
  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.benefits || '',
    scheme.eligibility ? (scheme.eligibility.otherCriteria || '') : '',
  ].join(' ').toLowerCase();

  // 1. Collect all plausible percentage thresholds from scheme text
  //    Pattern: a 2-3 digit number immediately followed by % or "percent"
  //    Exclude amounts like ₹70,000 (those have no % after them)
  const pctMatches = schemeText.match(/(\d{2,3})\s*(?:%|per\s*cent|percent)/g) || [];

  // Gather all valid threshold values (30–95%)
  const thresholds = [];
  for (const match of pctMatches) {
    const numMatch = match.match(/(\d{2,3})/);
    if (numMatch) {
      const pct = parseFloat(numMatch[1]);
      if (pct >= 30 && pct <= 95) {
        thresholds.push(pct);
      }
    }
  }

  if (thresholds.length > 0) {
    // Use the MINIMUM threshold — if user can't even meet the lowest tier, block it
    const minRequired = Math.min(...thresholds);
    if (userMarks < minRequired) return true;
  }

  // 2. Check for division-based requirements
  const FIRST_DIVISION_THRESHOLD = 60;
  const DISTINCTION_THRESHOLD = 75;

  const requiresFirstDiv = /\b(first\s+division|1st\s+division|first\s+class|1st\s+class)\b/.test(schemeText);
  const requiresDistinction = /\b(distinction|distinction\s+holder)\b/.test(schemeText);

  if (requiresFirstDiv && userMarks < FIRST_DIVISION_THRESHOLD) return true;
  if (requiresDistinction && userMarks < DISTINCTION_THRESHOLD) return true;

  return false;
};

/**
 * Main matching function.
 */
const matchSchemes = (userProfile, schemes) => {
  const eligible = [];
  const partial = [];

  const YOUNG_PEOPLE_KEYWORDS = [
    'vivah', 'shaadi', 'marriage grant', 'wedding', 'bride', 'groom',
    'maternity', 'delivery', 'newborn', 'pregnancy', 'janani', 'birth grant',
    'nandishala', 'cattle shelter', 'stray cattle', 'animal shelter', 'stray male cattle',
  ];

  const isElderlyMismatch = (scheme) => {
    if (!userProfile.age || userProfile.age < 60) return false;
    const schemeText = [scheme.name || '', scheme.description || '', scheme.benefits || ''].join(' ').toLowerCase();
    return YOUNG_PEOPLE_KEYWORDS.some(kw => schemeText.includes(kw));
  };

  for (const scheme of schemes) {
    // FILTER 1: State mismatch — priority-based check
    if (userProfile.state && isForDifferentState(scheme, userProfile.state)) continue;

    // FILTER 2: Education level mismatch (Graduate+ users don't see class 1-12 schemes)
    if (isEducationMismatch(userProfile, scheme)) continue;

    // FILTER 3: Occupation hard mismatch
    if (isOccupationHardMismatch(userProfile, scheme)) continue;

    // FILTER 4: Elderly mismatch
    if (isElderlyMismatch(scheme)) continue;

    // FILTER 5: Disability exclusion
    if (userProfile.isDisabled === false) {
      const schemeText = [scheme.name || '', scheme.description || '', scheme.benefits || '', scheme.category || ''].join(' ').toLowerCase();
      const DISABILITY_ONLY_KEYWORDS = [
        'disability pension', 'disabled person', 'divyang', 'handicap', 'differently abled',
        'pwd scheme', 'specially abled', 'national disability', 'vikhyat', 'viklang',
        'blind', 'deaf', 'cerebral palsy', 'leprosy cured',
      ];
      if (DISABILITY_ONLY_KEYWORDS.some(kw => schemeText.includes(kw))) continue;
    }

    // FILTER 6: Postgrad-only scheme for 10th/12th student
    if (isPostgradOnlyMismatch(userProfile, scheme)) continue;

    // FILTER 7: Marks/percentage mismatch
    if (isMarksMismatch(userProfile, scheme)) continue;

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

  // ── HARD FAILS ──
  if (e.minAge && profile.age && profile.age < e.minAge) {
    hardFail = true;
    reasons.notMet.push('Minimum age is ' + e.minAge + ' (you are ' + profile.age + ')');
  }
  if (e.maxAge && profile.age && profile.age > e.maxAge) {
    hardFail = true;
    reasons.notMet.push('Maximum age is ' + e.maxAge + ' (you are ' + profile.age + ')');
  }
  if (e.gender && e.gender !== 'all' && profile.gender && profile.gender !== e.gender) {
    hardFail = true;
    reasons.notMet.push('This scheme is only for ' + e.gender);
  }
  if (e.maxAnnualIncome && profile.annualIncome && profile.annualIncome > e.maxAnnualIncome) {
    hardFail = true;
    reasons.notMet.push('Income limit is Rs.' + (e.maxAnnualIncome / 100000).toFixed(1) + ' lakh');
  }
  if (e.states && e.states.length > 0 && profile.state &&
    !e.states.map(s => s.toLowerCase()).includes(profile.state.toLowerCase())) {
    hardFail = true;
    reasons.notMet.push('Only available in: ' + e.states.join(', '));
  }
  if (e.category && e.category.length > 0 && !e.category.includes('all') && profile.category) {
    if (!e.category.includes(profile.category)) {
      hardFail = true;
      reasons.notMet.push('Only for ' + e.category.map(c => c.toUpperCase()).join('/') + ' category');
    }
  }

  if (hardFail) return { status: 'ineligible', reasons, score: 0 };

  // ── BUILD SCHEME TEXT ──
  const schemeText = [
    scheme.name || '',
    scheme.description || '',
    scheme.benefits || '',
    scheme.category || '',
    (scheme.tags || []).join(' '),
  ].join(' ').toLowerCase();

  // ── POSITIVE SCORING ──

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
      reasons.met.push(profile.state + ' is eligible');
    } else if (!profile.state) {
      reasons.unknown.push('State not provided');
    }
  }

  // State-specific scoring boosts
  if (profile.state) {
    const userStateLower = profile.state.toLowerCase();

    // Boost if scheme.state exactly matches user's state (e.g. scheme.state = "Rajasthan")
    if (scheme.state && typeof scheme.state === 'string' &&
      scheme.state.toLowerCase().trim() === userStateLower) {
      score += 40;
      reasons.met.push('State scheme specifically for ' + profile.state);
    }

    // Boost if scheme text mentions user's state
    if (schemeText.includes(userStateLower)) {
      score += 30;
      reasons.met.push('Scheme is specific to ' + profile.state);
    }
  }

  // Occupation from eligibility.occupation field
  if (e.occupation && e.occupation.length > 0) {
    if (profile.occupation && e.occupation.includes(profile.occupation)) {
      score += 30;
      reasons.met.push('Occupation matches: ' + profile.occupation);
    } else if (!profile.occupation) {
      reasons.unknown.push('Occupation not provided');
    } else {
      score -= 10;
    }
  }

  // ── KEYWORD MATCHING ──
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
      reasons.met.push('Scheme relevant to ' + occupation + ' (' + matchedKeywords.join(', ') + ')');
    }

    // Category bonus
    const expectedCategory = CATEGORY_TO_OCCUPATION[scheme.category];
    if (expectedCategory === occupation) {
      score += 20;
      reasons.met.push('Category (' + scheme.category + ') matches your profile');
    }

    // Extra boost: self-employed women
    if (occupation === 'self-employed' && profile.gender === 'female') {
      if (schemeText.includes('women') || schemeText.includes('mahila') ||
        schemeText.includes('stree') || schemeText.includes('nari')) {
        score += 25;
        reasons.met.push('Scheme supports women entrepreneurs');
      }
    }
  }

  // Women keyword bonus
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

  // Widow boost
  if (profile.maritalStatus === 'widow' || profile.occupation === 'widow') {
    if (schemeText.includes('widow') || schemeText.includes('vidhwa')) {
      score += 150;
      reasons.met.push('Scheme is explicitly for widows');
    }
  }

  // ── EDUCATION MATCH ──
  if (profile.education) {
    const userRank = EDUCATION_RANK[profile.education] || 0;

    // Graduate+ boost for higher education schemes
    if (userRank >= 3 && HIGHER_EDUCATION_KEYWORDS.some(kw => schemeText.includes(kw))) {
      score += 10;
      reasons.met.push('Scheme is relevant to your education level');
    }

    // 10th-class student specific boost
    if (userRank === 1) {
      const tenthKeywords = [
        '10th', 'tenth', 'class 10', 'matric', 'ssc', 'secondary school',
        'class x', '10 th', 'board exam', '10th pass', 'passed 10th',
        'cleared 10th', 'matriculation', 'secondary board',
      ];
      if (tenthKeywords.some(kw => schemeText.includes(kw))) {
        score += 25;
        reasons.met.push('Scheme is relevant to 10th-class students');
      }
    }
  }

  // ── DETERMINE STATUS ──
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