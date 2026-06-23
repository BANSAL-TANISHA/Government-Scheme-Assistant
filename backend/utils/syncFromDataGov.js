/**
 * data.gov.in Scheme Sync Script
 * ─────────────────────────────────────────────────────
 * Fetches government scheme data from India's official open data portal
 * and merges it into MongoDB alongside existing Kaggle data.
 *
 * Usage:
 *   node utils/syncFromDataGov.js
 *
 * Setup:
 *   1. Register free at https://data.gov.in/user/register
 *   2. Get your API key from https://data.gov.in/user/me
 *   3. Add to backend/.env:  DATA_GOV_API_KEY=your_key_here
 */

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');

const API_KEY = process.env.DATA_GOV_API_KEY;
const BASE_URL = 'https://api.data.gov.in/resource';

// ── Known scheme dataset Resource IDs from data.gov.in ───────────────────────
// Each entry: { resourceId, description }
// Find more at: https://data.gov.in/catalog/government-schemes
const DATASETS = [
  // Central government scheme datasets — add more as you discover them
  {
    id: '6176ee09-3d56-4a3b-8115-21841576a808',
    label: 'PM Welfare Schemes',
  },
  {
    id: 'db9bd51a-1db4-4b2a-b793-d6cf6e4bfa46',
    label: 'Scholarships India',
  },
  {
    id: 'a6f7f2d4-5a34-4b8c-ae1a-04d8a08d2bff',
    label: 'Ministry of Social Justice Schemes',
  },
];

const mapCategory = (str = '') => {
  const s = str.toLowerCase();
  if (s.includes('education') || s.includes('scholarship') || s.includes('student')) return 'education';
  if (s.includes('agriculture') || s.includes('farmer') || s.includes('kisan')) return 'agriculture';
  if (s.includes('women') || s.includes('mahila') || s.includes('girl')) return 'women';
  if (s.includes('health') || s.includes('medical') || s.includes('ayushman')) return 'health';
  if (s.includes('housing') || s.includes('home') || s.includes('awas')) return 'housing';
  if (s.includes('employment') || s.includes('job') || s.includes('rozgar')) return 'employment';
  if (s.includes('startup') || s.includes('msme') || s.includes('business')) return 'startup';
  if (s.includes('social') || s.includes('pension') || s.includes('elderly')) return 'social-security';
  if (s.includes('skill') || s.includes('training') || s.includes('vocational')) return 'skill-development';
  if (s.includes('disability') || s.includes('divyang')) return 'disability';
  return 'other';
};

const fetchDataset = async (resourceId, label) => {
  if (!API_KEY) {
    console.error('❌ DATA_GOV_API_KEY not found in .env');
    return [];
  }

  console.log(`\n📡 Fetching: ${label} (${resourceId})`);
  const schemes = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    try {
      const url = `${BASE_URL}/${resourceId}?api-key=${API_KEY}&format=json&offset=${offset}&limit=${limit}`;
      const res = await axios.get(url, { timeout: 15000 });
      const records = res.data?.records || res.data?.data || [];

      if (records.length === 0) { hasMore = false; break; }

      for (const r of records) {
        // Map common field names from data.gov.in datasets
        const name = r.scheme_name || r.schemename || r.name || r.title || '';
        const description = r.scheme_description || r.description || r.details || r.about || '';
        if (!name || !description) continue;

        schemes.push({
          name: name.trim(),
          description: description.trim(),
          benefits: r.benefits || r.benefit || r.scheme_benefits || '',
          eligibility: {
            otherCriteria: r.eligibility || r.eligibility_criteria || r.eligibilitycriteria || '',
            states: r.state ? [r.state] : [],
          },
          documentsRequired: (r.documents || r.documents_required || '')
            .split(/\.\s+(?=[A-Z0-9])/)
            .map(d => d.trim())
            .filter(d => d.length > 7),
          applicationProcess: r.how_to_apply || r.application_process || r.applicationprocess || '',
          ministry: r.ministry || r.department || r.nodal_ministry || '',
          level: (r.scheme_type || r.level || 'central').toLowerCase().includes('state') ? 'state' : 'central',
          state: r.state || null,
          category: mapCategory(r.category || r.sector || r.ministry || name + ' ' + description),
          portalLink: r.portal_link || r.url || r.website || '',
          tags: (r.tags || r.keywords || '').split(',').map(t => t.trim()).filter(Boolean),
          isActive: true,
          source: 'data.gov.in',
        });
      }

      console.log(`  ✅ Fetched ${records.length} records (offset ${offset})`);
      offset += limit;
      if (records.length < limit) hasMore = false;

      // Rate limit: 1 req/second
      await new Promise(r => setTimeout(r, 1000));

    } catch (err) {
      console.error(`  ⚠️  Error at offset ${offset}:`, err.message);
      hasMore = false;
    }
  }

  return schemes;
};

const syncToMongoDB = async (newSchemes) => {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const scheme of newSchemes) {
    try {
      const existing = await Scheme.findOne({
        name: { $regex: scheme.name.substring(0, 40), $options: 'i' }
      });

      if (existing) {
        // Update with fresh data if it came from data.gov.in (more authoritative)
        await Scheme.updateOne({ _id: existing._id }, {
          $set: {
            benefits: scheme.benefits || existing.benefits,
            applicationProcess: scheme.applicationProcess || existing.applicationProcess,
            ministry: scheme.ministry || existing.ministry,
            updatedAt: new Date(),
          }
        });
        updated++;
      } else {
        await Scheme.create(scheme);
        inserted++;
      }
    } catch (e) {
      skipped++;
    }
  }

  return { inserted, updated, skipped };
};

const sync = async () => {
  if (!API_KEY) {
    console.error('\n❌ ERROR: DATA_GOV_API_KEY not set in .env');
    console.log('\n📌 Steps to get your free API key:');
    console.log('  1. Go to https://data.gov.in/user/register');
    console.log('  2. Register with your email');
    console.log('  3. Visit https://data.gov.in/user/me → copy your API key');
    console.log('  4. Add to backend/.env: DATA_GOV_API_KEY=your_key_here');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    let allSchemes = [];
    for (const dataset of DATASETS) {
      const schemes = await fetchDataset(dataset.id, dataset.label);
      allSchemes = allSchemes.concat(schemes);
      console.log(`  📦 Total from "${dataset.label}": ${schemes.length}`);
    }

    console.log(`\n📊 Total schemes fetched: ${allSchemes.length}`);

    const { inserted, updated, skipped } = await syncToMongoDB(allSchemes);
    console.log(`\n🎉 Sync complete:`);
    console.log(`   ✅ Inserted: ${inserted} new schemes`);
    console.log(`   🔄 Updated: ${updated} existing schemes`);
    console.log(`   ⚠️  Skipped: ${skipped} (errors)`);

    const total = await Scheme.countDocuments({ isActive: true });
    console.log(`\n📦 Total schemes in database: ${total}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Sync error:', err.message);
    process.exit(1);
  }
};

sync();
