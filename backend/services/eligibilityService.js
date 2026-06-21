/**
 * Eligibility Matching Engine v2
 * Works with Kaggle dataset where many schemes have empty eligibility fields
 * Uses category-based keyword matching as fallback
 */

// Keywords that map to occupations — used to match schemes by their NAME/DESCRIPTION
// when eligibility.occupation is not set in the database
const OCCUPATION_KEYWORDS = {
  student: [
    'student', 'scholarship', 'education', 'school', 'college', 'university',
    'btech', 'b.tech', 'engineering', 'medical', 'mbbs', 'study', 'academic',
    'tuition', 'fee', 'merit', 'post matric', 'pre matric', 'stipend',
    'vidya', 'shiksha', 'chhatra', 'अध्ययन', 'छात्र', 'छात्रवृत्ति'
  ],
  farmer: [
    'farmer', 'kisan', 'agriculture', 'farming', 'crop', 'soil', 'irrigation',
    'seed', 'fertilizer', 'mandi', 'agri', 'horticulture', 'fishermen', 'fishery',
    'animal husbandry', 'dairy', 'poultry', 'krishi', 'fasal', 'भूमि', 'किसान'
  ],
  'self-employed': [
    'mudra', 'loan', 'enterprise', 'msme', 'business', 'startup', 'entrepreneur',
    'self employed', 'vendor', 'artisan', 'handicraft', 'weaver', 'credit',
    'microfinance', 'svnidhi', 'udyog', 'vyapar'
  ],
  women: [
    'women', 'mahila', 'girl', 'beti', 'widow', 'maternity', 'female',
    'stree', 'nari', 'shakti', 'ladli', 'kanya', 'बेटी', 'महिला'
  ],
  unemployed: [
    'employment', 'job', 'rozgar', 'skill', 'training', 'apprentice',
    'placement', 'internship', 'nrega', 'mnrega', 'labour', 'worker'
  ],
  retired: [
    'pension', 'senior citizen', 'old age', 'vridha', 'elderly', 'retire'
  ],
};

const CATEGORY_TO_OCCUPATION = {
  education: 'student',
  agriculture: 'farmer',
  startup: 'self-employed',
  'skill-development': 'unemployed',
  'social-security': 'retired',
};

const matchSchemes = (userProfile, schemes) => {
  const eligible = [];
  const partial = [];

  for (const scheme of schemes) {
    const result = scoreScheme(userProfile, scheme);

    if (result.score <= 0) continue; // completely irrelevant — skip

    const schemeObj = scheme.toObject ? scheme.toObject() : { ...scheme };

    if (result.status === 'eligible') {
      eligible.push({ ...schemeObj, matchResult: result, score: result.score });
    } else if (result.status === 'partial') {
      partial.push({ ...schemeObj, matchResult: result, score: result.score });
    }
  }

  // Sort by score — most relevant first
  eligible.sort((a, b) => b.score - a.score);
  partial.sort((a, b) => b.score - a.score);

  return { eligible, partial };
};

const scoreScheme = (profile, scheme) => {
  const e = scheme.eligibility || {};
  const reasons = { met: [], notMet: [], unknown: [] };
  let score = 0;
  let hardFail = false;

  // ════════════════════════════════════════════
  // HARD FAILS — if any of these fail, score = 0
  // ════════════════════════════════════════════

  // Age hard fail
  if (e.minAge && profile.age && profile.age < e.minAge) {
    hardFail = true;
    reasons.notMet.push(`Minimum age is ${e.minAge} (you are ${profile.age})`);
  }
  if (e.maxAge && profile.age && profile.age > e.maxAge) {
    hardFail = true;
    reasons.notMet.push(`Maximum age is ${e.maxAge} (you are ${profile.age})`);
  }

  // Gender hard fail
  if (e.gender && e.gender !== 'all' && profile.gender && profile.gender !== e.gender) {
    hardFail = true;
    reasons.notMet.push(`This scheme is only for ${e.gender}`);
  }

  // Income hard fail
  if (e.maxAnnualIncome && profile.annualIncome && profile.annualIncome > e.maxAnnualIncome) {
    hardFail = true;
    reasons.notMet.push(`Income limit is ₹${(e.maxAnnualIncome / 100000).toFixed(1)} lakh`);
  }

  // State hard fail
  if (e.states && e.states.length > 0 && profile.state && !e.states.includes(profile.state)) {
    hardFail = true;
    reasons.notMet.push(`Only available in: ${e.states.join(', ')}`);
  }

  // Category hard fail
  if (e.category && e.category.length > 0 && !e.category.includes('all') && profile.category) {
    if (!e.category.includes(profile.category)) {
      hardFail = true;
      reasons.notMet.push(`Only for ${e.category.map(c => c.toUpperCase()).join('/')} category`);
    }
  }

  if (hardFail) return { status: 'ineligible', reasons, score: 0 };

  // ════════════════════════════════════════════
  // POSITIVE SCORING — add points for matches
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

  // State match
  if (e.states && e.states.length > 0) {
    if (profile.state && e.states.includes(profile.state)) { score += 20; reasons.met.push(`${profile.state} is eligible`); }
    else if (!profile.state) reasons.unknown.push('State not provided');
  }

  // Occupation from eligibility field
  if (e.occupation && e.occupation.length > 0) {
    if (profile.occupation && e.occupation.includes(profile.occupation)) {
      score += 30;
      reasons.met.push(`Occupation matches: ${profile.occupation}`);
    } else if (!profile.occupation) {
      reasons.unknown.push('Occupation not provided');
    } else {
      // Occupation mismatch — but NOT a hard fail unless it's clearly wrong
      score -= 10;
    }
  }

  // ════════════════════════════════════════════
  // KEYWORD MATCHING — for Kaggle schemes with no eligibility data
  // Match user occupation against scheme name + description text
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
        if (keywordHits >= 3) break; // max 3 hits
      }
    }

    if (keywordHits > 0) {
      score += keywordHits * 15; // 15 points per keyword match
      reasons.met.push(`Scheme relevant to ${profile.occupation} (matched: ${matchedKeywords.join(', ')})`);
    }

    // If women occupation-keyword match
    if (profile.gender === 'female') {
      const womenKws = OCCUPATION_KEYWORDS.women;
      for (const kw of womenKws) {
        if (schemeText.includes(kw)) {
          score += 10;
          reasons.met.push(`Women-focused scheme detected`);
          break;
        }
      }
    }

    // Category bonus — if scheme category aligns with user occupation
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


// /**
//  * Eligibility Matching Engine v3
//  * - Strict state filtering
//  * - Better relevance scoring
//  * - No cross-state scheme leakage
//  */

// const OCCUPATION_KEYWORDS = {
//   student: [
//     'student', 'scholarship', 'education', 'school', 'college', 'university',
//     'btech', 'b.tech', 'engineering', 'medical', 'mbbs', 'study', 'academic',
//     'tuition', 'fee', 'merit', 'post matric', 'pre matric', 'stipend',
//     'vidya', 'shiksha', 'chhatra', 'fellowship', 'research', 'degree', 'course'
//   ],
//   farmer: [
//     'farmer', 'kisan', 'agriculture', 'farming', 'crop', 'soil', 'irrigation',
//     'seed', 'fertilizer', 'mandi', 'agri', 'horticulture',
//     'animal husbandry', 'dairy', 'poultry', 'krishi', 'fasal'
//   ],
//   'self-employed': [
//     'mudra', 'enterprise', 'msme', 'business', 'startup', 'entrepreneur',
//     'self employed', 'vendor', 'artisan', 'handicraft', 'weaver',
//     'microfinance', 'udyog', 'vyapar', 'svnidhi'
//   ],
//   unemployed: [
//     'employment', 'rozgar', 'skill', 'training', 'apprentice',
//     'placement', 'nrega', 'mnrega', 'labour', 'worker', 'job seeker'
//   ],
//   retired: [
//     'pension', 'senior citizen', 'old age', 'vridha', 'elderly'
//   ],
// };

// // Indian states list — used to detect if a scheme belongs to a specific state
// const ALL_STATES = [
//   'andhra pradesh', 'assam', 'bihar', 'chhattisgarh', 'delhi', 'goa',
//   'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
//   'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya',
//   'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim',
//   'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand',
//   'west bengal'
// ];

// /**
//  * Check if a scheme text mentions a DIFFERENT state than user's state
//  * Returns true if scheme is for another state (should be excluded)
//  */
// const isForDifferentState = (scheme, userState) => {
//   if (!userState) return false;

//   const schemeText = [
//     scheme.name || '',
//     scheme.description || '',
//     scheme.ministry || '',
//     scheme.state || '',
//   ].join(' ').toLowerCase();

//   const userStateLower = userState.toLowerCase();

//   // If scheme has explicit state field set to a different state
//   if (scheme.state && scheme.state.toLowerCase() !== userStateLower) {
//     return true;
//   }

//   // Check if scheme text mentions another state name explicitly
//   for (const state of ALL_STATES) {
//     if (state === userStateLower) continue; // skip user's own state
//     if (schemeText.includes(state)) {
//       // Another state is mentioned in this scheme
//       return true;
//     }
//   }

//   return false;
// };

// const matchSchemes = (userProfile, schemes) => {
//   const eligible = [];
//   const partial = [];

//   for (const scheme of schemes) {
//     // ── STRICT STATE FILTER ──
//     // If user told us their state, exclude schemes that are for OTHER states
//     if (userProfile.state && isForDifferentState(scheme, userProfile.state)) {
//       continue; // skip this scheme entirely
//     }

//     const result = scoreScheme(userProfile, scheme);
//     if (result.score <= 0) continue;

//     const schemeObj = scheme.toObject ? scheme.toObject() : { ...scheme };

//     if (result.status === 'eligible') {
//       eligible.push({ ...schemeObj, matchResult: result, score: result.score });
//     } else if (result.status === 'partial') {
//       partial.push({ ...schemeObj, matchResult: result, score: result.score });
//     }
//   }

//   eligible.sort((a, b) => b.score - a.score);
//   partial.sort((a, b) => b.score - a.score);

//   return { eligible, partial };
// };

// const scoreScheme = (profile, scheme) => {
//   const e = scheme.eligibility || {};
//   const reasons = { met: [], notMet: [], unknown: [] };
//   let score = 0;

//   // ── HARD FAILS ──
//   if (e.minAge && profile.age && profile.age < e.minAge) {
//     return { status: 'ineligible', reasons: { met: [], notMet: [`Min age ${e.minAge}`], unknown: [] }, score: 0 };
//   }
//   if (e.maxAge && profile.age && profile.age > e.maxAge) {
//     return { status: 'ineligible', reasons: { met: [], notMet: [`Max age ${e.maxAge}`], unknown: [] }, score: 0 };
//   }
//   if (e.gender && e.gender !== 'all' && profile.gender && profile.gender !== e.gender) {
//     return { status: 'ineligible', reasons: { met: [], notMet: [`Only for ${e.gender}`], unknown: [] }, score: 0 };
//   }
//   if (e.maxAnnualIncome && profile.annualIncome && profile.annualIncome > e.maxAnnualIncome) {
//     return { status: 'ineligible', reasons: { met: [], notMet: [`Income exceeds limit`], unknown: [] }, score: 0 };
//   }
//   if (e.states && e.states.length > 0 && profile.state && !e.states.map(s => s.toLowerCase()).includes(profile.state.toLowerCase())) {
//     return { status: 'ineligible', reasons: { met: [], notMet: [`Not available in ${profile.state}`], unknown: [] }, score: 0 };
//   }
//   if (e.category && e.category.length > 0 && !e.category.includes('all') && profile.category) {
//     if (!e.category.includes(profile.category)) {
//       return { status: 'ineligible', reasons: { met: [], notMet: [`Only for ${e.category.join('/')}`], unknown: [] }, score: 0 };
//     }
//   }

//   // ── POSITIVE SCORING ──

//   // Age match
//   if (e.minAge || e.maxAge) {
//     if (profile.age) { score += 15; reasons.met.push('Age within range'); }
//     else reasons.unknown.push('Age not provided');
//   }

//   // Gender match (bonus for gender-specific schemes matching user)
//   if (e.gender && e.gender !== 'all') {
//     if (profile.gender === e.gender) { score += 20; reasons.met.push('Gender matches'); }
//     else if (!profile.gender) reasons.unknown.push('Gender not provided');
//   }

//   // Income match
//   if (e.maxAnnualIncome) {
//     if (profile.annualIncome) { score += 15; reasons.met.push('Income within limit'); }
//     else reasons.unknown.push('Income not provided');
//   }

//   // State match (bonus if scheme explicitly lists user's state)
//   if (e.states && e.states.length > 0) {
//     if (profile.state && e.states.map(s => s.toLowerCase()).includes(profile.state.toLowerCase())) {
//       score += 25; reasons.met.push(`${profile.state} is eligible`);
//     }
//   }

//   // Scheme mentions user's state in name/description (state-specific scheme)
//   if (profile.state) {
//     const schemeText = (scheme.name + ' ' + (scheme.description || '') + ' ' + (scheme.ministry || '')).toLowerCase();
//     if (schemeText.includes(profile.state.toLowerCase())) {
//       score += 20;
//       reasons.met.push(`Scheme is specific to ${profile.state}`);
//     }
//   }

//   // Occupation from eligibility field
//   if (e.occupation && e.occupation.length > 0) {
//     if (profile.occupation && e.occupation.includes(profile.occupation)) {
//       score += 30; reasons.met.push(`Occupation matches`);
//     } else if (!profile.occupation) {
//       reasons.unknown.push('Occupation not provided');
//     }
//   }

//   // ── KEYWORD MATCHING ── (for Kaggle schemes with empty eligibility)
//   if (profile.occupation) {
//     const schemeText = [
//       scheme.name || '',
//       scheme.description || '',
//       scheme.category || '',
//       (scheme.tags || []).join(' '),
//     ].join(' ').toLowerCase();

//     const keywords = OCCUPATION_KEYWORDS[profile.occupation] || [];
//     let keywordHits = 0;
//     const matchedKeywords = [];

//     for (const kw of keywords) {
//       if (schemeText.includes(kw)) {
//         keywordHits++;
//         matchedKeywords.push(kw);
//         if (keywordHits >= 3) break;
//       }
//     }

//     if (keywordHits > 0) {
//       score += keywordHits * 15;
//       reasons.met.push(`Scheme relevant to ${profile.occupation}`);
//     }

//     // Women-specific keyword bonus
//     if (profile.gender === 'female') {
//       const womenKws = ['women', 'mahila', 'girl', 'beti', 'kanya', 'stree', 'nari', 'ladli', 'female'];
//       for (const kw of womenKws) {
//         if (schemeText.includes(kw)) {
//           score += 15;
//           reasons.met.push('Women-focused scheme');
//           break;
//         }
//       }
//     }

//     // Category match in scheme text
//     const categoryOccupationMap = {
//       education: 'student',
//       agriculture: 'farmer',
//       startup: 'self-employed',
//       'skill-development': 'unemployed',
//       'social-security': 'retired',
//       women: 'women-focused',
//     };
//     if (categoryOccupationMap[scheme.category] === profile.occupation) {
//       score += 20;
//       reasons.met.push(`Category (${scheme.category}) matches your profile`);
//     }
//   }

//   // ── DETERMINE STATUS ──
//   let status;
//   if (score <= 0) {
//     status = 'ineligible';
//   } else if (reasons.met.length === 0 && reasons.unknown.length > 0) {
//     status = 'partial';
//   } else if (score >= 25) {
//     status = 'eligible';
//   } else {
//     status = 'partial';
//   }

//   return { status, reasons, score };
// };

// module.exports = { matchSchemes, scoreScheme };