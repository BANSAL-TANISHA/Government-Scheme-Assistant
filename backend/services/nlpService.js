// /**
//  * Rule-based NLP Profile Extractor
//  * Extracts structured user data from natural language input
//  */

// const stateMap = {
//   'rajasthan': 'Rajasthan', 'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan', 'udaipur': 'Rajasthan',
//   'maharashtra': 'Maharashtra', 'mumbai': 'Maharashtra', 'pune': 'Maharashtra',
//   'uttar pradesh': 'Uttar Pradesh', 'up': 'Uttar Pradesh', 'lucknow': 'Uttar Pradesh',
//   'bihar': 'Bihar', 'patna': 'Bihar',
//   'west bengal': 'West Bengal', 'kolkata': 'West Bengal',
//   'tamil nadu': 'Tamil Nadu', 'chennai': 'Tamil Nadu',
//   'karnataka': 'Karnataka', 'bangalore': 'Karnataka', 'bengaluru': 'Karnataka',
//   'gujarat': 'Gujarat', 'ahmedabad': 'Gujarat',
//   'madhya pradesh': 'Madhya Pradesh', 'mp': 'Madhya Pradesh', 'bhopal': 'Madhya Pradesh',
//   'andhra pradesh': 'Andhra Pradesh', 'hyderabad': 'Telangana', 'telangana': 'Telangana',
//   'kerala': 'Kerala', 'haryana': 'Haryana', 'punjab': 'Punjab',
//   'delhi': 'Delhi', 'new delhi': 'Delhi',
//   'odisha': 'Odisha', 'assam': 'Assam', 'jharkhand': 'Jharkhand',
// };

// const educationLevels = {
//   '10th': '10th', 'ssc': '10th', 'matriculation': '10th',
//   '12th': '12th', 'hsc': '12th', 'intermediate': '12th', 'higher secondary': '12th',
//   'graduate': 'Graduate', 'graduation': 'Graduate', 'b.tech': 'Graduate', 'btech': 'Graduate',
//   'b.sc': 'Graduate', 'bsc': 'Graduate', 'b.a': 'Graduate', 'ba': 'Graduate',
//   'b.com': 'Graduate', 'bcom': 'Graduate', 'mbbs': 'Graduate',
//   'postgraduate': 'Post-Graduate', 'pg': 'Post-Graduate', 'm.tech': 'Post-Graduate',
//   'mtech': 'Post-Graduate', 'm.sc': 'Post-Graduate', 'msc': 'Post-Graduate', 'mba': 'Post-Graduate',
//   'phd': 'PhD', 'doctorate': 'PhD',
//   'diploma': 'Diploma', 'iti': 'ITI',
// };

// const extractProfileFromText = (text) => {
//   const lower = text.toLowerCase();
//   const profile = {};

//   // Extract age
//   const ageMatch = lower.match(/\b(\d{1,2})\s*(year|yr|साल|वर्ष)/i) || lower.match(/age[:\s]+(\d{1,2})/i) || lower.match(/i(?:'m| am) (\d{1,2})/i);
//   if (ageMatch) profile.age = parseInt(ageMatch[1]);

//   // Extract gender
//   if (/\b(female|woman|girl|lady|महिला|लड़की|beti|daughter)\b/i.test(lower)) profile.gender = 'female';
//   else if (/\b(male|man|boy|पुरुष|लड़का)\b/i.test(lower)) profile.gender = 'male';

//   // Extract state/city
//   for (const [key, value] of Object.entries(stateMap)) {
//     if (lower.includes(key)) { profile.state = value; break; }
//   }

//   // Extract occupation
//   if (/\b(student|studying|padh raha|padh rahi|college|school|university)\b/i.test(lower)) profile.occupation = 'student';
//   else if (/\b(farmer|kisan|kheti|agriculture|farming)\b/i.test(lower)) profile.occupation = 'farmer';
//   else if (/\b(widow|vidhwa)\b/i.test(lower)) { profile.occupation = 'unemployed'; profile.maritalStatus = 'widow'; }
//   else if (/\b(self.?employed|business|entrepreneur|startup)\b/i.test(lower)) profile.occupation = 'self-employed';
//   else if (/\b(unemployed|job.?less|seeking job)\b/i.test(lower)) profile.occupation = 'unemployed';
//   else if (/\b(employed|working|job|service|naukri)\b/i.test(lower)) profile.occupation = 'employed';
//   else if (/\b(retired|pension)\b/i.test(lower)) profile.occupation = 'retired';

//   // Extract education
//   for (const [key, value] of Object.entries(educationLevels)) {
//     if (lower.includes(key)) { profile.education = value; break; }
//   }

//   // Extract income
//   const incomeMatch = lower.match(/(?:income|salary|earn|kamaata|kamaati)[:\s]+(?:rs\.?|₹|inr)?\s*([\d,]+)\s*(?:lakh|lac|l)?/i)
//     || lower.match(/(?:rs\.?|₹|inr)\s*([\d,]+)\s*(?:lakh|lac|l)/i)
//     || lower.match(/([\d.]+)\s*lakh/i);
//   if (incomeMatch) {
//     let income = parseFloat(incomeMatch[1].replace(/,/g, ''));
//     if (lower.match(/lakh|lac/i) && income < 100) income = income * 100000;
//     profile.annualIncome = income;
//   }

//   // Extract category/caste
//   if (/\b(sc|scheduled caste|dalit)\b/i.test(lower)) profile.category = 'sc';
//   else if (/\b(st|scheduled tribe|tribal|adivasi)\b/i.test(lower)) profile.category = 'st';
//   else if (/\b(obc|other backward)\b/i.test(lower)) profile.category = 'obc';
//   else if (/\b(ews|economically weaker)\b/i.test(lower)) profile.category = 'ews';
//   else if (/\b(general|unreserved)\b/i.test(lower)) profile.category = 'general';

//   // Extract disability
//   if (/\b(disabled|disability|divyang|handicap|differently abled)\b/i.test(lower)) profile.isDisabled = true;

//   // Extract land holding for farmers
//   const landMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:acre|bigha|hectare)/i);
//   if (landMatch) profile.landHolding = parseFloat(landMatch[1]);

//   return profile;
// };

// module.exports = { extractProfileFromText };


/**
 * NLP Profile Extractor - FIXED VERSION
 * More accurately extracts user info from natural language
 */

const stateMap = {
  'rajasthan': 'Rajasthan', 'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan',
  'udaipur': 'Rajasthan', 'kota': 'Rajasthan', 'bikaner': 'Rajasthan',
  'maharashtra': 'Maharashtra', 'mumbai': 'Maharashtra', 'pune': 'Maharashtra', 'nagpur': 'Maharashtra',
  'uttar pradesh': 'Uttar Pradesh', 'up': 'Uttar Pradesh', 'lucknow': 'Uttar Pradesh', 'kanpur': 'Uttar Pradesh',
  'bihar': 'Bihar', 'patna': 'Bihar',
  'west bengal': 'West Bengal', 'kolkata': 'West Bengal',
  'tamil nadu': 'Tamil Nadu', 'chennai': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu',
  'karnataka': 'Karnataka', 'bangalore': 'Karnataka', 'bengaluru': 'Karnataka', 'mysore': 'Karnataka',
  'gujarat': 'Gujarat', 'ahmedabad': 'Gujarat', 'surat': 'Gujarat',
  'madhya pradesh': 'Madhya Pradesh', 'mp': 'Madhya Pradesh', 'bhopal': 'Madhya Pradesh', 'indore': 'Madhya Pradesh',
  'andhra pradesh': 'Andhra Pradesh', 'hyderabad': 'Telangana', 'telangana': 'Telangana',
  'kerala': 'Kerala', 'thiruvananthapuram': 'Kerala', 'kochi': 'Kerala',
  'haryana': 'Haryana', 'gurugram': 'Haryana', 'faridabad': 'Haryana',
  'punjab': 'Punjab', 'amritsar': 'Punjab', 'ludhiana': 'Punjab',
  'delhi': 'Delhi', 'new delhi': 'Delhi',
  'odisha': 'Odisha', 'bhubaneswar': 'Odisha',
  'assam': 'Assam', 'guwahati': 'Assam',
  'jharkhand': 'Jharkhand', 'ranchi': 'Jharkhand',
  'chhattisgarh': 'Chhattisgarh', 'raipur': 'Chhattisgarh',
  'uttarakhand': 'Uttarakhand', 'dehradun': 'Uttarakhand',
  'himachal pradesh': 'Himachal Pradesh', 'shimla': 'Himachal Pradesh',
};

const extractProfileFromText = (text) => {
  const lower = text.toLowerCase();
  const profile = {};

  // ── Age extraction ──
  // Matches: "I am 20", "I'm 20 years old", "age 20", "20 saal"
  const agePatterns = [
    /\bi(?:'m| am) (\d{1,2})\b/i,
    /\b(\d{1,2})\s*(?:year|yr|saal|sal|वर्ष|साल)s?\s*old\b/i,
    /\bage[:\s]+(\d{1,2})\b/i,
    /\b(\d{1,2})\s*(?:year|yr)s?\s*of\s*age\b/i,
  ];
  for (const pattern of agePatterns) {
    const match = lower.match(pattern);
    if (match && parseInt(match[1]) > 5 && parseInt(match[1]) < 100) {
      profile.age = parseInt(match[1]);
      break;
    }
  }

  // ── Gender extraction ──
  if (/\b(female|woman|girl|lady|women|mahila|ladki|beti|daughter|herself|she)\b/i.test(lower)) {
    profile.gender = 'female';
  } else if (/\b(male|man|boy|purush|ladka|himself|he)\b/i.test(lower)) {
    profile.gender = 'male';
  }

  // ── State extraction ── (check longer names first)
  const sortedStates = Object.keys(stateMap).sort((a, b) => b.length - a.length);
  for (const key of sortedStates) {
    if (lower.includes(key)) {
      profile.state = stateMap[key];
      break;
    }
  }

  // ── Occupation extraction ── (ORDER MATTERS — more specific first)
  if (/\b(btech|b\.tech|b tech|engineering student|engg student|medical student|mbbs student|law student)\b/i.test(lower)) {
    profile.occupation = 'student';
    // Also extract education from this
    if (/btech|b\.tech|b tech|engineering/i.test(lower)) profile.education = 'Graduate'; // pursuing
  } else if (/\b(student|studying|study|college|school|university|pursuing|padh raha|padh rahi|padhai)\b/i.test(lower)) {
    profile.occupation = 'student';
  } else if (/\b(farmer|kisan|kheti|agriculture|farming|kisaan|krishi)\b/i.test(lower)) {
    profile.occupation = 'farmer';
  } else if (/\b(widow|vidhwa|widowed)\b/i.test(lower)) {
    profile.occupation = 'unemployed';
    profile.maritalStatus = 'widow';
    profile.gender = profile.gender || 'female'; // widows are likely female
  } else if (/\b(self.?employed|business|entrepreneur|startup|shop|dukan|vyapari)\b/i.test(lower)) {
    profile.occupation = 'self-employed';
  } else if (/\b(unemployed|job.?less|no job|seeking job|job dhundh|berozgar)\b/i.test(lower)) {
    profile.occupation = 'unemployed';
  } else if (/\b(employed|working|job|service|naukri|sarkari|private job)\b/i.test(lower)) {
    profile.occupation = 'employed';
  } else if (/\b(retired|pension|retired)\b/i.test(lower)) {
    profile.occupation = 'retired';
  }

  // ── Education extraction ──
  const educationMap = {
    'phd': 'PhD', 'doctorate': 'PhD',
    'mtech': 'Post-Graduate', 'm.tech': 'Post-Graduate', 'm tech': 'Post-Graduate',
    'mba': 'Post-Graduate', 'msc': 'Post-Graduate', 'm.sc': 'Post-Graduate', 'ma ': 'Post-Graduate',
    'postgrad': 'Post-Graduate', 'post grad': 'Post-Graduate', 'post graduate': 'Post-Graduate',
    'btech': 'Graduate', 'b.tech': 'Graduate', 'b tech': 'Graduate',
    'bsc': 'Graduate', 'b.sc': 'Graduate', 'ba ': 'Graduate', 'bcom': 'Graduate',
    'b.com': 'Graduate', 'mbbs': 'Graduate', 'graduation': 'Graduate', 'graduate': 'Graduate',
    'diploma': 'Diploma', 'iti': 'ITI', 'polytechnic': 'Diploma',
    '12th': '12th', 'hsc': '12th', 'intermediate': '12th', 'higher secondary': '12th', 'plus two': '12th',
    '10th': '10th', 'ssc': '10th', 'matric': '10th',
  };
  for (const [key, value] of Object.entries(educationMap)) {
    if (lower.includes(key)) { profile.education = value; break; }
  }

  // ── Income extraction ──
  // Matches: "income 1.5 lakh", "₹2,00,000", "earn 50000", "salary 30k"
  const incomePatterns = [
    /(?:income|salary|earn|kamaata|kamaati|annual)[:\s]+(?:rs\.?|₹|inr)?\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|l|k|thousand)?/i,
    /(?:rs\.?|₹|inr)\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|l|k)?/i,
    /([\d,]+(?:\.\d+)?)\s*(lakh|lac)\s*(?:per year|annual|salary|income)?/i,
  ];
  for (const pattern of incomePatterns) {
    const match = lower.match(pattern);
    if (match) {
      let amount = parseFloat(match[1].replace(/,/g, ''));
      const unit = (match[2] || '').toLowerCase();
      if (unit.includes('lakh') || unit.includes('lac') || unit === 'l') amount *= 100000;
      else if (unit === 'k' || unit.includes('thousand')) amount *= 1000;
      if (amount > 0 && amount < 100000000) { // sanity check
        profile.annualIncome = amount;
        break;
      }
    }
  }

  // ── Category / Caste ──
  if (/\b(sc|scheduled caste|dalit|harijan)\b/i.test(lower)) profile.category = 'sc';
  else if (/\b(st|scheduled tribe|tribal|adivasi|vanvasi)\b/i.test(lower)) profile.category = 'st';
  else if (/\b(obc|other backward class|backward)\b/i.test(lower)) profile.category = 'obc';
  else if (/\b(ews|economically weaker|general poor)\b/i.test(lower)) profile.category = 'ews';
  else if (/\b(general|unreserved|open category)\b/i.test(lower)) profile.category = 'general';

  // ── Disability ──
  if (/\b(disabled|disability|divyang|handicap|differently abled|specially abled|pwd)\b/i.test(lower)) {
    profile.isDisabled = true;
  }

  // ── Land holding (for farmers) ──
  const landMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:acre|bigha|hectare|guntha)/i);
  if (landMatch) profile.landHolding = parseFloat(landMatch[1]);

  // ── Year of study (for students) ──
  const yearMatch = lower.match(/(\d(?:st|nd|rd|th))\s*year/i);
  if (yearMatch) profile.studyYear = yearMatch[1];

  return profile;
};

module.exports = { extractProfileFromText };