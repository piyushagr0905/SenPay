const { OpenAI } = require('openai');
const uuid = require('crypto').randomUUID;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeMessageOpenAI({ text, sender }) {
  const systemPrompt = `
You are SENTINEL, an advanced AI fraud detection engine. Analyze the provided message and sender info for potential scams.
Return ONLY a raw JSON object matching the following structure:
{
  "detectedType": "Category of scam (e.g., Phishing, Job Scam, Imposter Scam) or 'Safe'",
  "riskLevel": "Severe" | "High" | "Elevated" | "Low" | "Safe",
  "confidenceScore": number (0-100),
  "urgencyScore": number (0-100),
  "financialRiskScore": number (0-100),
  "impersonationTarget": "Who they are pretending to be (or null)",
  "keyRedFlags": ["list", "of", "flags"],
  "legitimacyChecks": ["list", "of", "checks"],
  "recommendedAction": "What the user should do next",
  "safetyTips": ["list", "of", "tips"]
}

Guidelines:
- Analyze URLs to see if they look suspicious or malicious.
- Consider Sender Reputation (e.g. if the sender is marked as "Unknown", risk is higher. If "Saved Contact", risk is generally lower unless it's an imposter scam).
- Extract contextual urgency (e.g., "disconnect tonight").
- Do NOT wrap the JSON in markdown blocks like \`\`\`json. Return pure JSON.
`;

  const userMessage = `
Message Content: "${text}"
Sender Info: "${sender || 'Unknown Sender'}"
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for speed and cost-effectiveness
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.1, // Keep it deterministic
    });

    const content = response.choices[0].message.content.trim();
    
    // Parse the JSON string
    const parsedResult = JSON.parse(content);
    
    // Add internal ID
    parsedResult.id = `scan-${uuid ? uuid() : Date.now()}`;
    parsedResult.rawText = text;
    
    return parsedResult;
  } catch (error) {
    console.error("OpenAI Analysis Error:", error);
    throw new Error('Failed to analyze message via OpenAI');
  }
}

module.exports = { analyzeMessageOpenAI };
