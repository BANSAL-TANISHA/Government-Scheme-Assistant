// require('dotenv').config();
// const mongoose = require('mongoose');
// const Scheme = require('../models/Scheme');

// const schemes = [
//   {
//     name: 'PM Scholarship Scheme for Central Armed Police Forces',
//     nameHindi: 'केन्द्रीय सशस्त्र पुलिस बलों के लिए पीएम छात्रवृत्ति योजना',
//     description: 'Scholarship for children of ex-servicemen and widows of armed forces for professional degree courses.',
//     category: 'education',
//     ministry: 'Ministry of Home Affairs',
//     level: 'central',
//     eligibility: { minAge: 17, maxAge: 25, gender: 'all', occupation: ['student'], maxAnnualIncome: 600000 },
//     benefits: 'Rs. 2500/month for boys, Rs. 3000/month for girls',
//     benefitsAmount: '₹36,000/year',
//     documentsRequired: ['Aadhaar Card', 'Marksheet (10th & 12th)', 'Income Certificate', 'Bank Passbook', 'College Bonafide Certificate'],
//     applicationProcess: 'Apply online at KSB portal. Fill form, upload documents, submit.',
//     portalLink: 'https://ksb.gov.in',
//     isActive: true,
//     tags: ['scholarship', 'student', 'education'],
//   },
//   {
//     name: 'PM Kisan Samman Nidhi',
//     nameHindi: 'प्रधानमंत्री किसान सम्मान निधि',
//     description: 'Financial support of Rs 6000/year in three installments to small and marginal farmer families.',
//     category: 'agriculture',
//     ministry: 'Ministry of Agriculture',
//     level: 'central',
//     eligibility: { gender: 'all', occupation: ['farmer'], maxAnnualIncome: 200000 },
//     benefits: '₹6,000 per year in 3 equal installments of ₹2,000 each',
//     benefitsAmount: '₹6,000/year',
//     documentsRequired: ['Aadhaar Card', 'Land Records (Khasra-Khatauni)', 'Bank Account Details', 'Mobile Number'],
//     applicationProcess: 'Register at pmkisan.gov.in or through Common Service Centre (CSC).',
//     portalLink: 'https://pmkisan.gov.in',
//     isActive: true,
//     tags: ['farmer', 'agriculture', 'income support'],
//   },
//   {
//     name: 'PM Mudra Yojana (PMMY)',
//     nameHindi: 'प्रधानमंत्री मुद्रा योजना',
//     description: 'Loans up to Rs 10 lakh for non-corporate, non-farm small/micro enterprises.',
//     category: 'startup',
//     ministry: 'Ministry of Finance',
//     level: 'central',
//     eligibility: { gender: 'all', occupation: ['self-employed', 'unemployed'] },
//     benefits: 'Shishu: up to ₹50,000 | Kishore: ₹50,000–₹5 lakh | Tarun: ₹5–₹10 lakh',
//     documentsRequired: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Address Proof', 'Bank Statement (6 months)'],
//     applicationProcess: 'Apply at any bank, MFI, or NBFCs. Fill MUDRA loan application form.',
//     portalLink: 'https://www.mudra.org.in',
//     isActive: true,
//     tags: ['loan', 'business', 'startup', 'self-employment'],
//   },
//   {
//     name: 'Beti Bachao Beti Padhao',
//     nameHindi: 'बेटी बचाओ बेटी पढ़ाओ',
//     description: 'Scheme to address declining child sex ratio and promote welfare and education of girl child.',
//     category: 'women',
//     ministry: 'Ministry of Women and Child Development',
//     level: 'central',
//     eligibility: { gender: 'female', minAge: 0, maxAge: 10 },
//     benefits: 'Suchanita Samridhi Yojana + educational support + awareness campaigns',
//     documentsRequired: ['Birth Certificate', 'Aadhaar of Parents', 'Address Proof'],
//     applicationProcess: 'Contact Anganwadi center or district office.',
//     portalLink: 'https://wcd.nic.in',
//     isActive: true,
//     tags: ['girl child', 'women', 'education'],
//   },
//   {
//     name: 'Pradhan Mantri Awas Yojana (Urban)',
//     nameHindi: 'प्रधानमंत्री आवास योजना (शहरी)',
//     description: 'Affordable housing for urban poor. Credit linked subsidy for home loans.',
//     category: 'housing',
//     ministry: 'Ministry of Housing and Urban Affairs',
//     level: 'central',
//     eligibility: { gender: 'all', maxAnnualIncome: 1800000, category: ['ews', 'obc', 'sc', 'st', 'general'] },
//     benefits: 'Up to ₹2.67 lakh subsidy on home loan interest',
//     documentsRequired: ['Aadhaar Card', 'Income Certificate', 'Address Proof', 'Property Documents', 'Bank Account'],
//     applicationProcess: 'Apply online at pmaymis.gov.in or through bank/housing finance company.',
//     portalLink: 'https://pmaymis.gov.in',
//     isActive: true,
//     tags: ['housing', 'home loan', 'subsidy'],
//   },
//   {
//     name: 'National Scholarship Portal - Post Matric Scholarship (SC)',
//     description: 'Post matric scholarship for Scheduled Caste students pursuing higher education.',
//     category: 'education',
//     ministry: 'Ministry of Social Justice and Empowerment',
//     level: 'central',
//     eligibility: { gender: 'all', occupation: ['student'], category: ['sc'], maxAnnualIncome: 250000 },
//     benefits: 'Full tuition fees + maintenance allowance',
//     documentsRequired: ['Aadhaar Card', 'Caste Certificate', 'Income Certificate', 'Previous Marksheet', 'Bank Account', 'College Bonafide'],
//     applicationProcess: 'Apply at scholarships.gov.in during August–November.',
//     portalLink: 'https://scholarships.gov.in',
//     isActive: true,
//     tags: ['scholarship', 'SC', 'post matric', 'education'],
//   },
//   {
//     name: 'PM SVANidhi – Street Vendor Scheme',
//     nameHindi: 'पीएम स्वनिधि',
//     description: 'Micro-credit loan of up to Rs 10,000 for street vendors to restart their livelihoods post-COVID.',
//     category: 'employment',
//     ministry: 'Ministry of Housing and Urban Affairs',
//     level: 'central',
//     eligibility: { gender: 'all', occupation: ['self-employed', 'unemployed'] },
//     benefits: '₹10,000 initial loan, expandable to ₹20,000 then ₹50,000',
//     documentsRequired: ['Aadhaar Card', 'Identity Certificate from Local Body', 'Bank Account'],
//     applicationProcess: 'Apply at pmsvanidhi.mohua.gov.in or through Urban Local Body.',
//     portalLink: 'https://pmsvanidhi.mohua.gov.in',
//     isActive: true,
//     tags: ['loan', 'street vendor', 'micro-credit'],
//   },
//   {
//     name: 'Rajasthan Mukhyamantri Kanyadan Yojana',
//     description: 'Financial assistance for marriage of girls from BPL/OBC/SC/ST families in Rajasthan.',
//     category: 'women',
//     ministry: 'Social Justice and Empowerment Department, Rajasthan',
//     level: 'state',
//     state: 'Rajasthan',
//     eligibility: { gender: 'female', states: ['Rajasthan'], category: ['sc', 'st', 'obc', 'ews'], maxAnnualIncome: 50000 },
//     benefits: '₹31,000 for 10th pass, ₹41,000 for graduates',
//     documentsRequired: ['Aadhaar Card', 'BPL/Caste Certificate', 'Income Certificate', 'Marriage Registration', 'Bank Account'],
//     applicationProcess: 'Apply through E-Mitra Kiosk or SSO Portal at sso.rajasthan.gov.in.',
//     portalLink: 'https://sso.rajasthan.gov.in',
//     isActive: true,
//     tags: ['marriage', 'women', 'Rajasthan', 'financial assistance'],
//   },
// ];

// const seedDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yojana-sahayak');
//     await Scheme.deleteMany({});
//     await Scheme.insertMany(schemes);
//     console.log(`✅ Seeded ${schemes.length} schemes successfully`);
//     process.exit(0);
//   } catch (error) {
//     console.error('Seed error:', error);
//     process.exit(1);
//   }
// };

// seedDB();


require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');           // ← THIS WAS MISSING
const path = require('path');       // ← THIS WAS MISSING
const csv = require('csv-parser');
const Scheme = require('../models/Scheme');

// ---------- Category Mapper ----------
const mapCategory = (cat = '') => {
  const c = cat.toLowerCase();
  if (c.includes('education') || c.includes('scholar') || c.includes('student')) return 'education';
  if (c.includes('agri') || c.includes('farm') || c.includes('kisan') || c.includes('crop')) return 'agriculture';
  if (c.includes('women') || c.includes('girl') || c.includes('mahila') || c.includes('beti')) return 'women';
  if (c.includes('health') || c.includes('medical') || c.includes('hospital')) return 'health';
  if (c.includes('hous') || c.includes('awas') || c.includes('shelter')) return 'housing';
  if (c.includes('employ') || c.includes('job') || c.includes('rozgar') || c.includes('work')) return 'employment';
  if (c.includes('startup') || c.includes('business') || c.includes('mudra') || c.includes('enterprise')) return 'startup';
  if (c.includes('skill') || c.includes('training') || c.includes('vocational')) return 'skill-development';
  if (c.includes('pension') || c.includes('social') || c.includes('welfare') || c.includes('senior')) return 'social-security';
  if (c.includes('disab') || c.includes('divyang') || c.includes('handicap')) return 'disability';
  if (c.includes('minor') || c.includes('muslim') || c.includes('christian')) return 'minority';
  return 'other';
};

// ---------- Main Seed Function ----------
const seedDB = async () => {
  try {
    // Step 1: Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yojana-sahayak');
    console.log('✅ MongoDB connected');

    // Step 2: Check if CSV file exists
    const filePath = path.join(__dirname, 'schemes_data.csv');
    if (!fs.existsSync(filePath)) {
      console.error('❌ ERROR: schemes_data.csv not found!');
      console.error('📁 Please place the CSV file at: backend/utils/schemes_data.csv');
      process.exit(1);
    }

    // Step 3: Read CSV and collect all rows
    const rawRows = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => rawRows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`📦 Total rows found in CSV: ${rawRows.length}`);

    // Step 4: Map CSV rows to your Scheme model
    // NOTE: Print first row to see actual column names
    if (rawRows.length > 0) {
      console.log('📋 CSV Column Names detected:', Object.keys(rawRows[0]));
    }

    const schemes = rawRows.map(s => ({
      name: s.name || s.schemeName || s.scheme_name || s['Scheme Name'] || s['Name'] || 'Unknown Scheme',
      nameHindi: s.nameHindi || s.name_hindi || s['Name Hindi'] || '',
      description: s.description || s.details || s.about || s['Description'] || s['Details'] || '',
      category: mapCategory(s.category || s.tag || s.sector || s['Category'] || s['Sector'] || ''),
      level: (s.level || s.type || s['Level'] || s['Type'] || 'central').toLowerCase().includes('state') ? 'state' : 'central',
      state: s.state || s.stateName || s['State'] || null,
      ministry: s.ministry || s.department || s['Ministry'] || s['Department'] || '',
      benefits: s.benefits || s.benefit || s['Benefits'] || s['Benefit'] || '',
      benefitsAmount: s.benefitsAmount || s.amount || s['Amount'] || '',
      documentsRequired: s.documents
        ? s.documents.split(',').map(d => d.trim()).filter(Boolean)
        : s['Documents Required']
          ? s['Documents Required'].split(',').map(d => d.trim()).filter(Boolean)
          : [],
      applicationProcess: s.applicationProcess || s.howToApply || s['Application Process'] || s['How To Apply'] || '',
      // portalLink:         s.link || s.url || s.portalLink || s['Link'] || s['URL'] || s['Portal Link'] || '',
      portalLink: s.slug ? `https://www.myscheme.gov.in/schemes/${s.slug}` : '',

      isActive: true,
      tags: s.tags
        ? s.tags.split(',').map(t => t.trim()).filter(Boolean)
        : s['Tags']
          ? s['Tags'].split(',').map(t => t.trim()).filter(Boolean)
          : [],
      eligibility: {
        gender: (s.gender || s['Gender'] || 'all').toLowerCase() || 'all',
        maxAnnualIncome: parseFloat(s.maxIncome || s.income || s['Max Income'] || s['Annual Income'] || 0) || null,
        minAge: parseInt(s.minAge || s['Min Age'] || 0) || null,
        maxAge: parseInt(s.maxAge || s['Max Age'] || 0) || null,
        category: s.caste
          ? [s.caste.toLowerCase()]
          : s['Caste']
            ? [s['Caste'].toLowerCase()]
            : [],
        states: s.state ? [s.state] : s['State'] ? [s['State']] : [],
        occupation: s.occupation
          ? [s.occupation.toLowerCase()]
          : s['Occupation']
            ? [s['Occupation'].toLowerCase()]
            : [],
      }
    }));

    // Step 5: Filter out schemes with no name or description
    const validSchemes = schemes.filter(s => s.name !== 'Unknown Scheme' && s.description);
    console.log(`✅ Valid schemes to insert: ${validSchemes.length}`);
    console.log(`⚠️  Skipped (no name/description): ${schemes.length - validSchemes.length}`);

    // Step 6: Clear old data and insert new
    await Scheme.deleteMany({});
    await Scheme.insertMany(validSchemes, { ordered: false });
    console.log(`🎉 Successfully seeded ${validSchemes.length} schemes into MongoDB!`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();