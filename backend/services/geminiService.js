const { getModel } = require('../config/gemini');

const SYSTEM_PROMPT = `You are Yojana Sahayak (योजना सहायक), an AI assistant helping Indian citizens discover and apply for government welfare schemes.

Your role:
- Ask simple, friendly questions to understand the user's profile (age, gender, state, occupation, income, category)
- Match users with relevant central and state government schemes
- Explain eligibility clearly - WHY they qualify or don't qualify
- Provide document checklists and application guidance
- Be conversational, warm, and supportive
- Support Hindi and English (Hinglish is fine)
- NEVER give wrong information - if unsure, say so

Response format:
- Keep responses concise but helpful (150-250 words)
- Use simple language, avoid bureaucratic jargon
- When listing schemes, format them clearly
- If you need more info to match schemes, ask ONE specific question
- Always end with next steps or an offer to help further`;

const generateAIResponse = async ({ userMessage, history, extractedProfile, eligibleSchemes, partialSchemes, language }) => {
  const model = getModel();

  // If Gemini not available, use rule-based fallback
  if (!model) {
    return { text: generateFallbackResponse(userMessage, extractedProfile, eligibleSchemes) };
  }

  try {
    // Build conversation context
    const profileContext = Object.keys(extractedProfile).length > 0
      ? `\n\nUser profile extracted so far: ${JSON.stringify(extractedProfile, null, 2)}`
      : '';

    const schemesContext = eligibleSchemes.length > 0
      ? `\n\nEligible schemes found:\n${eligibleSchemes.map(s => `- ${s.name}: ${s.benefits}`).join('\n')}`
      : '';

    const partialContext = partialSchemes.length > 0
      ? `\n\nPotentially eligible (need more info):\n${partialSchemes.map(s => `- ${s.name}`).join('\n')}`
      : '';

    // Build history for Gemini
    const chatHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
    });

    const prompt = `${SYSTEM_PROMPT}${profileContext}${schemesContext}${partialContext}\n\nUser says: "${userMessage}"`;
    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    return { text };
  } catch (error) {
    console.error('Gemini error:', error.message);
    return { text: generateFallbackResponse(userMessage, extractedProfile, eligibleSchemes) };
  }
};

const generateFallbackResponse = (message, profile, schemes) => {
  const lower = message.toLowerCase();

  if (schemes.length > 0) {
    const schemeList = schemes.slice(0, 3).map(s => `• **${s.name}** – ${s.benefits}`).join('\n');
    return `Based on your profile, here are some schemes you may be eligible for:\n\n${schemeList}\n\nWould you like more details about any of these schemes, including required documents and how to apply?`;
  }

  if (!profile.age) return "To find the right schemes for you, could you tell me your age?";
  if (!profile.state) return `Thanks! Now, which state do you live in?`;
  if (!profile.occupation) return "Are you a student, farmer, employed, self-employed, or looking for work?";
  if (!profile.annualIncome) return "What is your approximate annual family income? (This helps filter income-based schemes)";
  if (!profile.gender) return "Could you tell me your gender? Some schemes are specifically for women or men.";

  return "I'm analyzing your profile to find the best government schemes for you. Could you share any additional details about your situation?";
};

module.exports = { generateAIResponse };
