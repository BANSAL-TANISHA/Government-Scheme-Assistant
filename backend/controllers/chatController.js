const Conversation = require('../models/Conversation');
const { extractProfileFromText } = require('../services/nlpService');
const { generateAIResponse } = require('../services/geminiService');
const { matchSchemes } = require('../services/eligibilityService');
const Scheme = require('../models/Scheme');
const { v4: uuidv4 } = require('uuid');

const sessionStore = new Map();

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId, language = 'en' } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const sid = sessionId || uuidv4();

    let conversation;
    let history = [];
    let extractedProfile = {};

    if (req.user) {
      conversation = await Conversation.findOne({ sessionId: sid, user: req.user.id });
      if (!conversation) {
        conversation = await Conversation.create({ user: req.user.id, sessionId: sid, messages: [], language });
      }
      history = conversation.messages.slice(-10);
      extractedProfile = conversation.extractedProfile || {};
    } else {
      const session = sessionStore.get(sid) || { messages: [], extractedProfile: {} };
      history = session.messages.slice(-10);
      extractedProfile = session.extractedProfile;
    }

    // Extract profile from new message
    const newProfileData = extractProfileFromText(message);
    extractedProfile = { ...extractedProfile, ...newProfileData };

    console.log('🔍 Extracted Profile:', JSON.stringify(extractedProfile));

    // ── Fetch ALL active schemes — no pre-filtering ──
    // Let the eligibility engine handle the matching logic
    let schemes = [];
    try {
      schemes = await Scheme.find({ isActive: true }).lean();
      console.log(`📦 Total schemes loaded: ${schemes.length}`);
    } catch (e) {
      console.error('DB fetch error:', e.message);
    }

    // ── Match schemes ──
    let matchedSchemes = { eligible: [], partial: [] };
    if (Object.keys(extractedProfile).length >= 1 && schemes.length > 0) {
      matchedSchemes = matchSchemes(extractedProfile, schemes);
      console.log(`✅ Eligible: ${matchedSchemes.eligible.length}, Partial: ${matchedSchemes.partial.length}`);
    }

    // ── Generate AI response ──
    const aiResponse = await generateAIResponse({
      userMessage: message,
      history,
      extractedProfile,
      eligibleSchemes: matchedSchemes.eligible.slice(0, 5),
      partialSchemes: matchedSchemes.partial.slice(0, 3),
      language,
    });

    // ── Save messages ──
    const userMsg = { role: 'user', content: message };
    const assistantMsg = {
      role: 'assistant',
      content: aiResponse.text,
      schemesFound: matchedSchemes.eligible.slice(0, 5).map(s => s._id).filter(Boolean),
    };

    if (req.user && conversation) {
      conversation.messages.push(userMsg, assistantMsg);
      conversation.extractedProfile = extractedProfile;
      conversation.updatedAt = new Date();
      await conversation.save();
    } else {
      const session = sessionStore.get(sid) || { messages: [], extractedProfile: {} };
      session.messages.push(userMsg, assistantMsg);
      session.extractedProfile = extractedProfile;
      sessionStore.set(sid, session);
    }

    res.json({
      success: true,
      sessionId: sid,
      response: aiResponse.text,
      extractedProfile,
      eligibleSchemes: matchedSchemes.eligible.slice(0, 5),
      partialSchemes: matchedSchemes.partial.slice(0, 3),
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      sessionId: req.params.sessionId,
      user: req.user.id,
    }).populate('messages.schemesFound', 'name category');
    if (!conversation) return res.json({ success: true, messages: [] });
    res.json({ success: true, messages: conversation.messages, extractedProfile: conversation.extractedProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await Conversation.deleteOne({ sessionId: req.params.sessionId, user: req.user.id });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// const Conversation = require('../models/Conversation');
// const { extractProfileFromText } = require('../services/nlpService');
// const { generateAIResponse } = require('../services/geminiService');
// const { matchSchemes } = require('../services/eligibilityService');
// const Scheme = require('../models/Scheme');
// const { v4: uuidv4 } = require('uuid');

// const sessionStore = new Map();

// exports.sendMessage = async (req, res) => {
//   try {
//     const { message, sessionId, language = 'en' } = req.body;
//     if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

//     const sid = sessionId || uuidv4();

//     let conversation;
//     let history = [];
//     let extractedProfile = {};

//     if (req.user) {
//       conversation = await Conversation.findOne({ sessionId: sid, user: req.user.id });
//       if (!conversation) {
//         conversation = await Conversation.create({ user: req.user.id, sessionId: sid, messages: [], language });
//       }
//       history = conversation.messages.slice(-10);
//       extractedProfile = conversation.extractedProfile || {};
//     } else {
//       const session = sessionStore.get(sid) || { messages: [], extractedProfile: {} };
//       history = session.messages.slice(-10);
//       extractedProfile = session.extractedProfile;
//     }

//     // Extract profile from new message
//     const newProfileData = extractProfileFromText(message);
//     extractedProfile = { ...extractedProfile, ...newProfileData };

//     console.log('🔍 Extracted Profile:', JSON.stringify(extractedProfile));

//     // ── Fetch ALL active schemes — no pre-filtering ──
//     // Let the eligibility engine handle the matching logic
//     let schemes = [];
//     try {
//       schemes = await Scheme.find({ isActive: true }).lean();
//       console.log(`📦 Total schemes loaded: ${schemes.length}`);
//     } catch (e) {
//       console.error('DB fetch error:', e.message);
//     }

//     // ── Match schemes ──
//     let matchedSchemes = { eligible: [], partial: [] };
//     if (Object.keys(extractedProfile).length >= 1 && schemes.length > 0) {
//       matchedSchemes = matchSchemes(extractedProfile, schemes);
//       console.log(`✅ Eligible: ${matchedSchemes.eligible.length}, Partial: ${matchedSchemes.partial.length}`);
//     }

//     // ── Generate AI response ──
//     const aiResponse = await generateAIResponse({
//       userMessage: message,
//       history,
//       extractedProfile,
//       eligibleSchemes: matchedSchemes.eligible.slice(0, 5),
//       partialSchemes: matchedSchemes.partial.slice(0, 3),
//       language,
//     });

//     // ── Save messages ──
//     const userMsg = { role: 'user', content: message };
//     const assistantMsg = {
//       role: 'assistant',
//       content: aiResponse.text,
//       schemesFound: matchedSchemes.eligible.slice(0, 5).map(s => s._id).filter(Boolean),
//     };

//     if (req.user && conversation) {
//       conversation.messages.push(userMsg, assistantMsg);
//       conversation.extractedProfile = extractedProfile;
//       conversation.updatedAt = new Date();
//       await conversation.save();
//     } else {
//       const session = sessionStore.get(sid) || { messages: [], extractedProfile: {} };
//       session.messages.push(userMsg, assistantMsg);
//       session.extractedProfile = extractedProfile;
//       sessionStore.set(sid, session);
//     }

//     res.json({
//       success: true,
//       sessionId: sid,
//       response: aiResponse.text,
//       extractedProfile,
//       eligibleSchemes: matchedSchemes.eligible.slice(0, 5),
//       partialSchemes: matchedSchemes.partial.slice(0, 3),
//     });

//   } catch (error) {
//     console.error('Chat error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.getChatHistory = async (req, res) => {
//   try {
//     const conversation = await Conversation.findOne({
//       sessionId: req.params.sessionId,
//       user: req.user.id,
//     }).populate('messages.schemesFound', 'name category');
//     if (!conversation) return res.json({ success: true, messages: [] });
//     res.json({ success: true, messages: conversation.messages, extractedProfile: conversation.extractedProfile });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.clearHistory = async (req, res) => {
//   try {
//     await Conversation.deleteOne({ sessionId: req.params.sessionId, user: req.user.id });
//     res.json({ success: true, message: 'Chat history cleared' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };