const { getModel } = require('../config/gemini');

// ── Rich system prompt ──────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Yojana Sahayak (योजना सहायक), India's most trusted AI welfare assistant. You help Indian citizens discover government schemes they are eligible for.

YOUR ROLE:
- Ask warm, simple questions to understand: age, gender, state, occupation, income, category (SC/ST/OBC/EWS/General), education, disability
- Explain scheme eligibility clearly — WHY they qualify
- List matched schemes with benefit amounts prominently
- Give document checklists and step-by-step application guidance
- Support Hindi, English, and Hinglish fluently
- NEVER fabricate scheme information

RESPONSE RULES:
- Keep responses 100-200 words (concise but complete)
- Format scheme names in bold using **Name**
- Always mention benefit amount (₹) if available
- If fewer than 2 profile fields known, ask ONE specific friendly question
- Always end with a helpful next step
- For Hindi speakers, mix Hindi naturally: "आप के लिए", "यह योजना", etc.

CONVERSATION STYLE:
- Warm and supportive like a helpful government official
- Use simple words, never bureaucratic jargon
- Acknowledge the user's situation with empathy`;

// ── Extract user profile from chat message using Gemini ──────────────────────
const extractProfileWithGemini = async (text, existingProfile = {}) => {
  const model = getModel();
  if (!model) return null;

  try {
    const prompt = `Extract user profile information from this message and return ONLY valid JSON (no markdown, no explanation):

Message: "${text}"
Existing profile: ${JSON.stringify(existingProfile)}

Return JSON with ONLY the fields you are confident about extracting. Use null for unknown:
{
  "age": number or null,
  "gender": "male" | "female" | "all" | null,
  "state": "full state name like Rajasthan" or null,
  "occupation": "student" | "farmer" | "self-employed" | "unemployed" | "retired" | "employed" | null,
  "annualIncome": number in rupees or null,
  "category": "sc" | "st" | "obc" | "ews" | "general" | null,
  "education": "10th" | "12th" | "Graduate" | "Post-Graduate" | "Diploma" | "ITI" | "PhD" | null,
  "isDisabled": true | null,
  "maritalStatus": "widow" | "married" | "unmarried" | null
}

Rules:
- "Rajasthan" not "rajasthan" — proper case for state
- If message says "kisan" or "kheti", occupation = "farmer"
- If message says "chhatra" or "padh raha", occupation = "student"  
- Income "3 lakh" = 300000, "50 hazar" = 50000
- Only override existing fields if new message gives clearer info
- Return ONLY the JSON object, nothing else`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Extract JSON from response (handle cases where model adds extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    // Remove null values
    return Object.fromEntries(Object.entries(parsed).filter(([_, v]) => v !== null));
  } catch (e) {
    console.error('Gemini NLP error:', e.message);
    return null;
  }
};

// ── Generate AI chat response ─────────────────────────────────────────────────
const generateAIResponse = async ({ userMessage, history, extractedProfile, eligibleSchemes, partialSchemes, language }) => {
  const model = getModel();

  if (!model) {
    return { text: generateFallbackResponse(userMessage, extractedProfile, eligibleSchemes) };
  }

  try {
    // Build profile context
    const profileFields = Object.keys(extractedProfile).filter(k => extractedProfile[k]);
    const profileContext = profileFields.length > 0
      ? `\n\nUser profile so far: ${JSON.stringify(extractedProfile, null, 2)}\nProfile completeness: ${profileFields.length}/8 fields known`
      : '\n\nUser profile: Unknown — need to gather info';

    // Build scheme context with key details
    const schemesContext = eligibleSchemes.length > 0
      ? `\n\nELIGIBLE SCHEMES (${eligibleSchemes.length} found):\n${eligibleSchemes.slice(0, 8).map((s, i) =>
        `${i + 1}. **${s.name}** — ${s.benefits?.substring(0, 120)}${s.benefits?.length > 120 ? '...' : ''}`
      ).join('\n')}`
      : '';

    const partialContext = partialSchemes.length > 0
      ? `\n\nPOTENTIALLY ELIGIBLE (need more info): ${partialSchemes.slice(0, 3).map(s => s.name).join(', ')}`
      : '';

    const langHint = language === 'hi'
      ? '\n\nIMPORTANT: Respond primarily in Hindi.'
      : '\n\nIMPORTANT: Respond in simple English with some Hindi words naturally.';

    const chatHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: { maxOutputTokens: 600, temperature: 0.65 },
    });

    const prompt = `${SYSTEM_PROMPT}${profileContext}${schemesContext}${partialContext}${langHint}\n\nUser message: "${userMessage}"`;
    const result = await chat.sendMessage(prompt);
    return { text: result.response.text() };

  } catch (error) {
    console.error('Gemini error:', error.message);
    return { text: generateFallbackResponse(userMessage, extractedProfile, eligibleSchemes) };
  }
};

// ── Rule-based fallback (when Gemini is unavailable) ─────────────────────────
const generateFallbackResponse = (message, profile, schemes) => {
  if (schemes.length > 0) {
    const schemeList = schemes.slice(0, 3).map(s =>
      `• **${s.name}** – ${s.benefits?.substring(0, 100)}...`
    ).join('\n');
    return `Based on your profile, here are schemes you may be eligible for:\n\n${schemeList}\n\nWould you like details, documents required, or how to apply for any of these?`;
  }

  if (!profile.age) return "To find the right schemes for you, could you please tell me your age?";
  if (!profile.state) return "Which state do you live in? (e.g., Rajasthan, Maharashtra, Delhi...)";
  if (!profile.occupation) return "What do you do? (Student / Farmer / Self-employed / Unemployed / Retired / Government employee)";
  if (!profile.category) return "What is your caste category? (General / OBC / SC / ST / EWS) — this helps find reserved quota schemes.";
  if (!profile.annualIncome) return "What is your approximate annual family income? Many schemes have income limits.";
  if (!profile.gender) return "Are you male or female? Some schemes are exclusively for women.";

  return "I'm searching through 3400+ government schemes to find the best matches for your profile. Please share any additional details about your specific needs.";
};

module.exports = { generateAIResponse, extractProfileWithGemini };
