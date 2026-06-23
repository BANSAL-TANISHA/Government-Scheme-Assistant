/**
 * MyScheme.gov.in Scraper
 * ─────────────────────────────────────────────────────────────────────
 * Fetches live scheme data from India's official MyScheme portal
 * using their public search API (no auth required — it's public data).
 *
 * MyScheme.gov.in is the BEST source — same data as Kaggle, always live.
 *
 * Usage:
 *   node utils/scrapeMyScheme.js
 *   node utils/scrapeMyScheme.js --limit=100   (fetch only 100 schemes)
 *   node utils/scrapeMyScheme.js --category=education
 *
 * This merges NEW schemes into your existing database (does NOT delete
 * your Kaggle data). Run this weekly for fresh updates.
 */

require('dotenv').config();
const https = require('https');
const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');

// ── Parse CLI args ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (name) => {
  const found = args.find(a => a.startsWith(`--${name}=`));
  return found ? found.split('=')[1] : null;
};
const FETCH_LIMIT = parseInt(getArg('limit') || '500');
const FILTER_CATEGORY = getArg('category') || '';

// ── Category mapping ────────────────────────────────────────────────────────
const mapCategory = (tags = '', title = '', desc = '') => {
  const text = (tags + ' ' + title + ' ' + desc).toLowerCase();
  if (text.includes('education') || text.includes('scholarship') || text.includes('student') || text.includes('school') || text.includes('college')) return 'education';
  if (text.includes('agriculture') || text.includes('farmer') || text.includes('kisan') || text.includes('crop') || text.includes('irrigation')) return 'agriculture';
  if (text.includes('women') || text.includes('mahila') || text.includes('girl') || text.includes('beti') || text.includes('widow')) return 'women';
  if (text.includes('health') || text.includes('medical') || text.includes('ayushman') || text.includes('hospital')) return 'health';
  if (text.includes('housing') || text.includes('home') || text.includes('awas') || text.includes('shelter')) return 'housing';
  if (text.includes('employment') || text.includes('job') || text.includes('rozgar') || text.includes('labour')) return 'employment';
  if (text.includes('startup') || text.includes('msme') || text.includes('business') || text.includes('entrepreneur') || text.includes('mudra')) return 'startup';
  if (text.includes('social') || text.includes('pension') || text.includes('elderly') || text.includes('senior') || text.includes('disability') || text.includes('divyang')) return 'social-security';
  if (text.includes('skill') || text.includes('training') || text.includes('vocational') || text.includes('apprentice')) return 'skill-development';
  return 'other';
};

// ── Fetch from MyScheme public search API ────────────────────────────────────
const fetchPage = (offset, limit = 20) => new Promise((resolve, reject) => {
  // MyScheme.gov.in uses a public Next.js API endpoint — no auth needed
  const query = FILTER_CATEGORY
    ? `schemeCategory=${encodeURIComponent(FILTER_CATEGORY)}&`
    : '';

  const url = `https://api.myscheme.gov.in/search/v4/schemes?lang=en&${query}keyword=&q=&page=${Math.floor(offset / limit) + 1}&limit=${limit}`;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; YojanaSahayak/1.0; +https://github.com/student-project)',
      'Accept': 'application/json',
      'Referer': 'https://www.myscheme.gov.in/',
    }
  };

  https.get(url, options, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        resolve({ status: res.statusCode, data: json });
      } catch (e) {
        resolve({ status: res.statusCode, data: null, raw: data.substring(0, 200) });
      }
    });
  }).on('error', reject);
});

// ── Map a MyScheme record to our Scheme model ────────────────────────────────
const mapScheme = (s) => {
  const eligibility = s.eligibility || {};
  const details = s.schemeDetails || s.details || {};

  return {
    name: s.schemeName || s.title || '',
    nameHindi: s.schemeNameHindi || s.hindiTitle || '',
    description: s.briefDescription || s.description || details.description || '',
    category: mapCategory(
      (s.tags || []).join(' '),
      s.schemeName || '',
      s.briefDescription || ''
    ),
    level: (s.schemeType || s.level || 'central').toLowerCase().includes('state') ? 'state' : 'central',
    state: s.stateName || s.state || null,
    ministry: s.ministry || s.department || s.nodal_ministry_name || '',
    benefits: (s.benefits || s.benefitDetails || []).map(b => b.text || b.description || b).join(' '),
    benefitsAmount: s.benefitAmount || '',
    documentsRequired: (s.documents_required || s.documentsRequired || [])
      .map(d => d.documentName || d.name || d)
      .filter(d => typeof d === 'string' && d.length > 5),
    applicationProcess: (s.applicationProcess || s.howToApply || '')
      .replace(/<[^>]+>/g, '') // strip HTML
      .trim(),
    portalLink: s.slug ? `https://www.myscheme.gov.in/schemes/${s.slug}` : (s.schemeUrl || ''),
    eligibility: {
      minAge: eligibility.minAge || null,
      maxAge: eligibility.maxAge || null,
      gender: eligibility.gender || 'all',
      category: eligibility.category || [],
      occupation: eligibility.occupation || [],
      maxAnnualIncome: eligibility.maxIncome || null,
      states: eligibility.states || (s.stateName ? [s.stateName] : []),
      otherCriteria: eligibility.otherCriteria || s.eligibilityDescription || '',
    },
    tags: (s.tags || s.keywords || []).slice(0, 10),
    isActive: true,
    source: 'myscheme.gov.in',
    updatedAt: new Date(),
  };
};

// ── Upsert a scheme (update if exists, insert if new) ───────────────────────
const upsertScheme = async (schemeData) => {
  if (!schemeData.name || schemeData.name.length < 5) return 'skip';
  try {
    const existing = await Scheme.findOne({
      $or: [
        { name: schemeData.name },
        { portalLink: schemeData.portalLink, portalLink: { $ne: '' } },
      ]
    });

    if (existing) {
      // Update with fresh data from MyScheme
      await Scheme.updateOne({ _id: existing._id }, {
        $set: {
          description: schemeData.description || existing.description,
          benefits: schemeData.benefits || existing.benefits,
          documentsRequired: schemeData.documentsRequired?.length ? schemeData.documentsRequired : existing.documentsRequired,
          applicationProcess: schemeData.applicationProcess || existing.applicationProcess,
          ministry: schemeData.ministry || existing.ministry,
          portalLink: schemeData.portalLink || existing.portalLink,
          'eligibility.otherCriteria': schemeData.eligibility?.otherCriteria || existing.eligibility?.otherCriteria,
          updatedAt: new Date(),
          source: 'myscheme.gov.in',
        }
      });
      return 'updated';
    } else {
      await Scheme.create(schemeData);
      return 'inserted';
    }
  } catch (e) {
    return 'error:' + e.message.substring(0, 50);
  }
};

// ── Main ─────────────────────────────────────────────────────────────────────
const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  const BATCH = 20;
  let offset = 0;
  let inserted = 0, updated = 0, errors = 0, skipped = 0;
  let hasMore = true;

  console.log(`\n🌐 Fetching from MyScheme.gov.in (max ${FETCH_LIMIT} schemes)...\n`);

  while (hasMore && offset < FETCH_LIMIT) {
    const { status, data, raw } = await fetchPage(offset, BATCH);

    if (status !== 200 || !data) {
      console.error(`❌ API error at offset ${offset}: HTTP ${status}`, raw || '');

      if (status === 403 || status === 401) {
        console.log('\n⚠️  MyScheme API returned 403. They may have restricted public access.');
        console.log('→ Fallback: Your Kaggle data (3400 schemes) is still in your database.');
        console.log('→ Alternative: Download fresh CSV from https://www.kaggle.com/datasets');
        break;
      }
      break;
    }

    const schemes = data.data?.scheme || data.schemes || data.results || [];
    const totalAvailable = data.data?.totalCount || data.total || 0;

    if (schemes.length === 0) { hasMore = false; break; }

    for (const s of schemes) {
      const schemeData = mapScheme(s);
      const result = await upsertScheme(schemeData);
      if (result === 'inserted') inserted++;
      else if (result === 'updated') updated++;
      else if (result === 'skip') skipped++;
      else errors++;
    }

    offset += BATCH;
    const fetched = Math.min(offset, FETCH_LIMIT);
    process.stdout.write(`\r📡 Fetched ${fetched}/${Math.min(totalAvailable, FETCH_LIMIT)} schemes... (✅ ${inserted} new, 🔄 ${updated} updated)`);

    if (offset >= totalAvailable) hasMore = false;

    // Polite delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 800));
  }

  const totalInDB = await Scheme.countDocuments({ isActive: true });

  console.log(`\n\n🎉 Sync complete!`);
  console.log(`   ✅ New schemes added: ${inserted}`);
  console.log(`   🔄 Existing schemes updated: ${updated}`);
  console.log(`   ⚠️  Skipped/errors: ${skipped + errors}`);
  console.log(`   📦 Total in database: ${totalInDB}`);

  process.exit(0);
};

run().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
