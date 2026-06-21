const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

const initGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set - AI features will use fallback responses');
    return null;
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  console.log('✅ Gemini AI initialized');
  return model;
};

const getModel = () => {
  if (!model) return initGemini();
  return model;
};

module.exports = { initGemini, getModel };
