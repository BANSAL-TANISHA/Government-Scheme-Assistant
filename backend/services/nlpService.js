const { extractProfileWithGemini } = require('./geminiService');

// ── State name map (city → state, Hindi words → state) ──────────────────────
const stateMap = {
  // Rajasthan
  'rajasthan': 'Rajasthan', 'rajastahn': 'Rajasthan', 'rajsthan': 'Rajasthan', 'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan',
  'udaipur': 'Rajasthan', 'kota': 'Rajasthan', 'bikaner': 'Rajasthan', 'ajmer': 'Rajasthan',
  // Maharashtra
  'maharashtra': 'Maharashtra', 'maharahstra': 'Maharashtra', 'mumbai': 'Maharashtra', 'pune': 'Maharashtra',
  'nagpur': 'Maharashtra', 'nashik': 'Maharashtra', 'aurangabad': 'Maharashtra',
  // Uttar Pradesh
  'uttar pradesh': 'Uttar Pradesh', 'up': 'Uttar Pradesh', 'lucknow': 'Uttar Pradesh',
  'kanpur': 'Uttar Pradesh', 'agra': 'Uttar Pradesh', 'varanasi': 'Uttar Pradesh', 'allahabad': 'Uttar Pradesh',
  // Bihar
  'bihar': 'Bihar', 'patna': 'Bihar', 'gaya': 'Bihar',
  // West Bengal
  'west bengal': 'West Bengal', 'kolkata': 'West Bengal', 'wb': 'West Bengal',
  // Tamil Nadu
  'tamil nadu': 'Tamil Nadu', 'chennai': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu',
  'madurai': 'Tamil Nadu', 'tn': 'Tamil Nadu',
  // Karnataka
  'karnataka': 'Karnataka', 'bangalore': 'Karnataka', 'bengaluru': 'Karnataka',
  'mysore': 'Karnataka', 'mysuru': 'Karnataka', 'hubli': 'Karnataka',
  // Gujarat
  'gujarat': 'Gujarat', 'ahmedabad': 'Gujarat', 'surat': 'Gujarat',
  'vadodara': 'Gujarat', 'baroda': 'Gujarat',
  // Madhya Pradesh
  'madhya pradesh': 'Madhya Pradesh', 'mp': 'Madhya Pradesh', 'bhopal': 'Madhya Pradesh',
  'indore': 'Madhya Pradesh', 'jabalpur': 'Madhya Pradesh',
  // Andhra Pradesh
  'andhra pradesh': 'Andhra Pradesh', 'ap': 'Andhra Pradesh', 'visakhapatnam': 'Andhra Pradesh',
  'vijayawada': 'Andhra Pradesh',
  // Telangana
  'telangana': 'Telangana', 'hyderabad': 'Telangana', 'warangal': 'Telangana',
  // Kerala
  'kerala': 'Kerala', 'thiruvananthapuram': 'Kerala', 'kochi': 'Kerala',
  'kozhikode': 'Kerala', 'trivandrum': 'Kerala',
  // Haryana
  'haryana': 'Haryana', 'gurugram': 'Haryana', 'faridabad': 'Haryana',
  'gurgaon': 'Haryana', 'rohtak': 'Haryana', 'hisar': 'Haryana',
  // Punjab
  'punjab': 'Punjab', 'amritsar': 'Punjab', 'ludhiana': 'Punjab', 'chandigarh': 'Punjab',
  // Delhi
  'delhi': 'Delhi', 'new delhi': 'Delhi',
  // Odisha
  'odisha': 'Odisha', 'orissa': 'Odisha', 'bhubaneswar': 'Odisha', 'cuttack': 'Odisha',
  // Assam
  'assam': 'Assam', 'guwahati': 'Assam', 'dispur': 'Assam',
  // Jharkhand
  'jharkhand': 'Jharkhand', 'ranchi': 'Jharkhand', 'jamshedpur': 'Jharkhand',
  // Chhattisgarh
  'chhattisgarh': 'Chhattisgarh', 'raipur': 'Chhattisgarh', 'bilaspur': 'Chhattisgarh',
  // Uttarakhand
  'uttarakhand': 'Uttarakhand', 'dehradun': 'Uttarakhand', 'haridwar': 'Uttarakhand',
  // Himachal Pradesh
  'himachal pradesh': 'Himachal Pradesh', 'shimla': 'Himachal Pradesh', 'hp': 'Himachal Pradesh',
  // Goa
  'goa': 'Goa', 'panaji': 'Goa',
  // Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura, Arunachal
  'manipur': 'Manipur', 'meghalaya': 'Meghalaya', 'mizoram': 'Mizoram',
  'nagaland': 'Nagaland', 'sikkim': 'Sikkim', 'tripura': 'Tripura',
  'arunachal pradesh': 'Arunachal Pradesh',
  // UTs
  'puducherry': 'Puducherry', 'pondicherry': 'Puducherry',
  'jammu and kashmir': 'Jammu and Kashmir', 'j&k': 'Jammu and Kashmir',
  'ladakh': 'Ladakh',
};

// ── Education level map ──────────────────────────────────────────────────────
const educationMap = {
  'phd': 'PhD', 'doctorate': 'PhD',
  'mtech': 'Post-Graduate', 'm.tech': 'Post-Graduate', 'm tech': 'Post-Graduate',
  'mba': 'Post-Graduate', 'msc': 'Post-Graduate', 'm.sc': 'Post-Graduate',
  'postgrad': 'Post-Graduate', 'post graduate': 'Post-Graduate', 'masters': 'Post-Graduate',
  'btech': 'Graduate', 'b.tech': 'Graduate', 'b tech': 'Graduate',
  'bsc': 'Graduate', 'b.sc': 'Graduate', 'bcom': 'Graduate', 'b.com': 'Graduate',
  'mbbs': 'Graduate', 'llb': 'Graduate', 'graduation': 'Graduate', 'graduate': 'Graduate',
  'ba ': 'Graduate', ' ba ': 'Graduate',
  'diploma': 'Diploma', 'iti': 'ITI', 'polytechnic': 'Diploma',
  '12th': '12th', 'hsc': '12th', 'intermediate': '12th', 'higher secondary': '12th',
  '10th': '10th', 'ssc': '10th', 'matric': '10th',
};

// ── Fast regex-based extractor (runs first, instant) ─────────────────────────
const extractWithRegex = (text) => {
  const lower = text.toLowerCase();
  const profile = {};

  // Age
  const agePatterns = [
    /\bi(?:'m| am) (\d{1,2})\b/i,
    /\b(\d{1,2})\s*(?:year|yr|saal|sal|वर्ष|साल)s?\s*old\b/i,
    /\bage[:\s]+(\d{1,2})\b/i,
    /\b(\d{1,2})\s*(?:year|yr)s?\s*of\s*age\b/i,
    /\b(\d{1,2})\s*(?:saal|sal)\b/i,
    /umra\s*(\d{1,2})/i,
  ];
  for (const p of agePatterns) {
    const m = lower.match(p);
    if (m && parseInt(m[1]) > 5 && parseInt(m[1]) < 100) { profile.age = parseInt(m[1]); break; }
  }

  // Gender
  if (/\b(female|woman|girl|lady|women|mahila|ladki|beti|daughter|herself|she|विधवा|महिला|लड़की)\b/i.test(lower)) {
    profile.gender = 'female';
  } else if (/\b(male|man|boy|purush|ladka|himself|he|पुरुष|लड़का)\b/i.test(lower)) {
    profile.gender = 'male';
  }

  // State (check longest keys first to avoid partial matches)
  const sortedKeys = Object.keys(stateMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(key)) { profile.state = stateMap[key]; break; }
  }

  // Occupation — CHECK MOST SPECIFIC FIRST to avoid false triggers
  // 1. Woman entrepreneur (must come before student/entrepreneur generic checks)
  if (/\b(woman entrepreneur|women entrepreneur|businesswoman|female entrepreneur|lady entrepreneur|mahila entrepreneur|female business)\b/i.test(lower)) {
    profile.occupation = 'self-employed';
    profile.gender = 'female';
    // 2. Widow
  } else if (/\b(widow|vidhwa|widowed|\u0935\u093f\u0927\u0935\u093e)\b/i.test(lower)) {
    profile.maritalStatus = 'widow';
    profile.occupation = 'widow';
    profile.gender = profile.gender || 'female';
    // 3. Farmer
  } else if (/\b(farmer|kisan|kisaan|kheti|agriculture|farming|krishi|\u0916\u0947\u0924\u0940|\u0915\u093f\u0938\u093e\u0928)\b/i.test(lower)) {
    profile.occupation = 'farmer';
    // 4. Retired / pension
  } else if (/\b(retired|pension|\u0938\u0947\u0935\u093e\u0928\u093f\u0935\u0943\u0924\u094d\u0924)\b/i.test(lower)) {
    profile.occupation = 'retired';
    // 5. Self-employed / business (generic)
  } else if (/\b(self.?employed|business owner|startup founder|entrepreneur|shop owner|dukan|vyapari|\u0935\u094d\u092f\u093e\u092a\u093e\u0930\u0940)\b/i.test(lower)) {
    profile.occupation = 'self-employed';
    // 6. Student — NOTE: btech/mbbs alone do NOT mean "currently student" (could be completed)
    //    Only set student if paired with student context words
  } else if (/\b(engineering student|medical student|mbbs student|law student|btech student|b\.tech student|mbbs stduent|mbbs stdnt)\b/i.test(lower)) {
    profile.occupation = 'student';
    // Detect MBBS/medical → set education as Graduate-level
    if (/\bmbbs\b/i.test(lower)) profile.education = profile.education || 'Graduate';
  } else if (/\bmbbs\b.*\b(student|stduent|stdnt|studying|pursuing)\b|\b(student|stduent|stdnt|studying|pursuing)\b.*\bmbbs\b/i.test(lower)) {
    // "mbbs student" or "student mbbs" with typos
    profile.occupation = 'student';
    profile.education = profile.education || 'Graduate';
  } else if (/\b(student|stduent|stdnt|studying|pursuing|chhatra|padh raha|padh rahi|padhai kar)\b/i.test(lower)) {
    profile.occupation = 'student';
  } else if (/\b(in college|in school|in university|in class|attending college)\b/i.test(lower)) {
    profile.occupation = 'student';

    // 7. Unemployed
  } else if (/\b(unemployed|job.?less|no job|berozgar|\u092c\u0947\u0930\u094b\u091c\u0917\u093e\u0930)\b/i.test(lower)) {
    profile.occupation = 'unemployed';
  }


  // Education
  for (const [key, value] of Object.entries(educationMap)) {
    if (lower.includes(key)) { profile.education = value; break; }
  }

  // Income
  const incomePatterns = [
    /(?:income|salary|earn|kamaata|kamaati|annual|monthly\s*salary)[:\s]+(?:rs\.?|₹|inr)?\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|l|k|thousand)?/i,
    /(?:rs\.?|₹|inr)\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|l|k|thousand)?/i,
    /([\d,]+(?:\.\d+)?)\s*(lakh|lac)\s*(?:per year|annual|salary|income|rupees)?/i,
    /(\d+(?:\.\d+)?)\s*hazar/i,
  ];
  for (const p of incomePatterns) {
    const m = lower.match(p);
    if (m) {
      let amount = parseFloat(m[1].replace(/,/g, ''));
      const unit = (m[2] || '').toLowerCase();
      if (unit.includes('lakh') || unit.includes('lac') || unit === 'l') amount *= 100000;
      else if (unit === 'k' || unit.includes('thousand') || unit === 'hazar') amount *= 1000;
      if (amount > 0 && amount < 100000000) { profile.annualIncome = amount; break; }
    }
  }

  // Category
  if (/\b(sc|scheduled caste|dalit|harijan)\b/i.test(lower)) profile.category = 'sc';
  else if (/\b(st|scheduled tribe|tribal|adivasi|vanvasi|आदिवासी)\b/i.test(lower)) profile.category = 'st';
  else if (/\b(obc|other backward class|backward class|पिछड़ा)\b/i.test(lower)) profile.category = 'obc';
  else if (/\b(ews|economically weaker|general poor)\b/i.test(lower)) profile.category = 'ews';
  else if (/\b(general|unreserved|open category|सामान्य)\b/i.test(lower)) profile.category = 'general';

  // Disability
  if (/\b(disabled|disability|divyang|handicap|differently abled|specially abled|pwd|दिव्यांग)\b/i.test(lower)) {
    profile.isDisabled = true;
  }

  // Land
  const landM = lower.match(/(\d+(?:\.\d+)?)\s*(?:acre|bigha|hectare|guntha)/i);
  if (landM) profile.landHolding = parseFloat(landM[1]);

  return profile;
};

/**
 * Main extraction function:
 * 1. Try Gemini first (handles complex/Hindi/Hinglish sentences)
 * 2. Fall back to regex if Gemini fails or unavailable
 * 3. Merge results — Gemini wins on conflicts
 */
const extractProfileFromText = async (text, existingProfile = {}) => {
  // Always run regex (fast, synchronous)
  const regexResult = extractWithRegex(text);

  try {
    // Try Gemini for better understanding of complex messages
    const geminiResult = await extractProfileWithGemini(text, existingProfile);
    if (geminiResult && Object.keys(geminiResult).length > 0) {
      // Merge: Gemini result takes priority, fill gaps with regex
      return { ...regexResult, ...geminiResult };
    }
  } catch (e) {
    // Gemini failed — use regex result only
  }

  return regexResult;
};

module.exports = { extractProfileFromText };