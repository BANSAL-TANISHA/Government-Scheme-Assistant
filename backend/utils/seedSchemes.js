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

    const schemes = rawRows.map(s => {
      // ── Get the raw eligibility text from CSV ──
      const rawEligibility = s.eligibility || s['Eligibility'] || s['eligibility_criteria'] || '';

      // ── Parse eligibility text for structured fields ──
      let minAge = null, maxAge = null;
      // Try to extract age range like "18-60 years" or "above 18" or "below 35"
      const ageRangeMatch = rawEligibility.match(/age(?:\s+group)?(?:\s+of)?\s+(\d+)[-–to\s]+(\d+)\s*years?/i);
      const ageAboveMatch = rawEligibility.match(/(?:above|above the age of|atleast|at least|minimum age of)\s+(\d+)\s*years?/i);
      const ageBelowMatch = rawEligibility.match(/(?:below|below the age of|not more than|maximum age of|upto)\s+(\d+)\s*years?/i);
      if (ageRangeMatch) { minAge = parseInt(ageRangeMatch[1]); maxAge = parseInt(ageRangeMatch[2]); }
      else if (ageAboveMatch) { minAge = parseInt(ageAboveMatch[1]); }
      else if (ageBelowMatch) { maxAge = parseInt(ageBelowMatch[1]); }

      // Try to detect gender from eligibility text
      let gender = 'all';
      const lowerElig = rawEligibility.toLowerCase();
      if (lowerElig.includes('women') || lowerElig.includes('girl') || lowerElig.includes('female') || lowerElig.includes('mahila') || lowerElig.includes('widow')) gender = 'female';
      else if (lowerElig.includes('men only') || lowerElig.includes('male only')) gender = 'male';

      return {
        name: s.name || s.schemeName || s.scheme_name || s['Scheme Name'] || s['Name'] || 'Unknown Scheme',
        nameHindi: s.nameHindi || s.name_hindi || s['Name Hindi'] || '',
        // CSV uses 'details' column for the description
        description: s.details || s.description || s.about || s['Details'] || s['Description'] || '',
        category: mapCategory(s.schemeCategory || s.category || s.tag || s.sector || s['Category'] || s['Sector'] || ''),
        level: (s.level || s.type || s['Level'] || s['Type'] || 'central').toLowerCase().includes('state') ? 'state' : 'central',
        state: s.state || s.stateName || s['State'] || null,
        ministry: s.ministry || s.department || s['Ministry'] || s['Department'] || '',
        benefits: s.benefits || s.benefit || s['Benefits'] || s['Benefit'] || '',
        benefitsAmount: s.benefitsAmount || s.amount || s['Amount'] || '',
        // CSV uses 'documents' column — it's a paragraph of sentences, NOT comma-separated items
        // Split only on ". Capital" boundaries to get clean document names
        documentsRequired: (() => {
          const raw = s.documents || s['Documents Required'] || s['documents'] || '';
          if (!raw) return [];
          return raw
            .split(/\.\s+(?=[A-Z0-9])/)      // split on ". NextSentence"
            .map(d => d.replace(/^[\s.]+/, '').trim())
            .filter(d => d.length > 7);       // skip fragments shorter than 8 chars
        })(),
        // CSV uses 'application' column for how to apply
        applicationProcess: s.application || s.applicationProcess || s.howToApply || s['Application Process'] || s['How To Apply'] || '',
        portalLink: s.slug ? `https://www.myscheme.gov.in/schemes/${s.slug}` : '',
        isActive: true,
        tags: s.tags
          ? s.tags.split(',').map(t => t.trim()).filter(Boolean)
          : s['Tags']
            ? s['Tags'].split(',').map(t => t.trim()).filter(Boolean)
            : [],
        eligibility: {
          gender,
          minAge,
          maxAge,
          maxAnnualIncome: parseFloat(s.maxIncome || s.income || s['Max Income'] || s['Annual Income'] || 0) || null,
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
          // ── Store raw CSV eligibility text here so it always shows ──
          otherCriteria: rawEligibility.trim() || null,
        },
      };
    });

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