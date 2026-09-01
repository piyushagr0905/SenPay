const uuid = require('crypto').randomUUID;

// Expanded safe domains
const TRUSTED_DOMAINS = [
  'gov.in', 'hdfcbank.com', 'sbi.co.in', 'icicibank.com', 'axisbank.com',
  'amazon.in', 'amazon.com', 'flipkart.com', 'google.com', 'youtube.com', 
  'github.com', 'microsoft.com', 'apple.com', 'linkedin.com', 'twitter.com',
  'instagram.com', 'facebook.com', 'netflix.com', 'gmail.com', 'yahoo.com'
];

const SUSPICIOUS_TLDS = ['.xyz', '.top', '.click', '.info', '.biz', '.loan', '.win', '.vip'];
const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'ow.ly', 'cutt.ly'];

// Regex patterns for better detection
const PATTERNS = {
  urgency: /\b(urgent|immediately|act now|within \d+ hours|account suspended|blocked|final notice)\b/i,
  financial: /\b(send money|transfer|deposit|payment|crypto|bitcoin|gift card|lottery|winner|prize)\b/i,
  personalInfo: /\b(password|otp|pin|cvv|social security|ssn|aadhar|pan card|kyc)\b/i,
  jobScam: /\b(part-time job|daily income|work from home.*salary|hiring.*no experience.*$\d+)\b/i,
  imposterFamily: /\b(mom|dad|friend|brother|sister).*(accident|hospital|help me|stuck).*(send|transfer|money)\b/i
};

async function analyzeMessageHeuristics(text, sender, prisma) {
  const lowerText = text.toLowerCase();
  const lowerSender = sender ? sender.toLowerCase() : '';
  
  let riskScore = 0;
  let urgencyScore = 0;
  let financialRiskScore = 0;
  
  let detectedType = 'Unknown';
  let riskLevel = 'Safe';
  let impersonationTarget = null;
  const keyRedFlags = [];
  const legitimacyChecks = [];
  let recommendedAction = 'No immediate threat detected. Exercise standard caution.';
  let safetyTips = ['Verify unexpected requests with the sender directly.'];

  // 1. Sender Verification
  let isWhitelisted = false;
  if (lowerSender) {
    const recipient = await prisma.recipient.findFirst({
      where: {
        OR: [
          { name: { equals: sender, mode: 'insensitive' } },
          { phone: sender },
          { upiId: sender }
        ]
      }
    });

    if (recipient && recipient.isWhitelisted) {
      isWhitelisted = true;
      legitimacyChecks.push(`Sender "${sender}" is marked as SAFE in your whitelist.`);
    } else if (lowerSender === 'unknown' || lowerSender === 'unknown sender' || /^\+?\d+$/.test(lowerSender)) {
      // Don't arbitrarily add risk just because it's a number, just note it.
      legitimacyChecks.push('Sender is an unsaved number or unknown.');
    }
  }

  // If explicitly whitelisted, skip heavy heuristics
  if (isWhitelisted) {
    return {
      id: `scan-${uuid ? uuid() : Date.now()}`,
      rawText: text,
      detectedType: 'Safe (Whitelisted)',
      riskLevel: 'Safe',
      confidenceScore: 100,
      urgencyScore: 0,
      financialRiskScore: 0,
      impersonationTarget: null,
      keyRedFlags: ['Sender is explicitly whitelisted as SAFE'],
      legitimacyChecks,
      recommendedAction: 'Sender is trusted. No action needed.',
      safetyTips: [],
    };
  }

  // 2. Link Analysis
  const urlRegex = /https?:\/\/(?:www\.)?([^\s/]+)/gi;
  let match;
  let hasSuspiciousLink = false;
  let hasShortenedLink = false;
  let linkCount = 0;

  while ((match = urlRegex.exec(lowerText)) !== null) {
    linkCount++;
    const domain = match[1].toLowerCase();
    
    if (TRUSTED_DOMAINS.some(trusted => domain.endsWith(trusted))) {
      legitimacyChecks.push(`Link domain '${domain}' is a known safe domain.`);
    } else if (URL_SHORTENERS.some(shortener => domain.includes(shortener))) {
      hasShortenedLink = true;
      keyRedFlags.push(`Contains a shortened link (${domain}) which can hide malicious sites.`);
      riskScore += 15;
    } else if (SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld))) {
      hasSuspiciousLink = true;
      keyRedFlags.push(`Link uses a suspicious top-level domain (${domain}).`);
      riskScore += 25;
    } else {
      // Normal unknown link. Don't heavily penalize unless combined with other factors
      legitimacyChecks.push(`Message contains a link to an unverified domain: ${domain}`);
      riskScore += 5; // Minimal penalty for standard unknown links
    }
  }

  if (linkCount > 2) {
    riskScore += 10;
    keyRedFlags.push('Message contains multiple links, which is unusual for standard texts.');
  }

  // 3. Content Pattern Matching
  if (PATTERNS.urgency.test(lowerText)) {
    urgencyScore += 40;
    riskScore += 15;
    keyRedFlags.push('Message uses urgent or threatening language.');
  }

  if (PATTERNS.financial.test(lowerText)) {
    financialRiskScore += 40;
    riskScore += 20;
    keyRedFlags.push('Message contains requests for money or financial transactions.');
  }

  if (PATTERNS.personalInfo.test(lowerText)) {
    riskScore += 30;
    keyRedFlags.push('Message asks for sensitive personal information (OTP, PIN, passwords).');
    safetyTips.push('Never share your OTP, PIN, or passwords with anyone.');
  }

  // 4. Specific Scam Archetypes (Contextual Multipliers)
  if (PATTERNS.jobScam.test(lowerText)) {
    detectedType = 'Job & Task Scam';
    riskScore += 40;
    financialRiskScore += 30;
    keyRedFlags.push('Matches patterns of common job/task scams (easy money for simple tasks).');
    recommendedAction = 'Ignore and block. Legitimate jobs do not promise easy daily income via texts.';
    safetyTips.push('Never pay upfront fees to secure a job or task.');
  } else if (PATTERNS.imposterFamily.test(lowerText)) {
    detectedType = 'Imposter Scam';
    riskScore += 40;
    urgencyScore += 30;
    financialRiskScore += 30;
    keyRedFlags.push('Claims to be a family member/friend in an emergency needing money.');
    recommendedAction = 'Do NOT send money. Call the person directly on their known phone number to verify.';
  } else if ((hasSuspiciousLink || hasShortenedLink) && urgencyScore > 0) {
    detectedType = 'Phishing';
    riskScore += 30; // Synergy bonus for link + urgency
    keyRedFlags.push('Combines suspicious links with urgent language (classic phishing).');
    recommendedAction = 'Do not click the link. If it claims to be an institution, contact them directly.';
  }

  // 5. Final Risk Assessment
  // Adjusted thresholds so normal emails don't get flagged.
  // 0-15: Safe
  // 16-39: Low
  // 40-69: Elevated
  // 70-89: High
  // 90+: Severe
  if (riskScore >= 90) riskLevel = 'Severe';
  else if (riskScore >= 70) riskLevel = 'High';
  else if (riskScore >= 40) riskLevel = 'Elevated';
  else if (riskScore >= 16) riskLevel = 'Low';
  else {
    riskLevel = 'Safe';
    if (keyRedFlags.length === 0) {
      keyRedFlags.push('None detected');
      legitimacyChecks.push('Message appears standard and safe.');
    }
  }

  if (riskLevel === 'Safe' && detectedType === 'Unknown') {
     detectedType = 'General Conversation';
  }

  return {
    id: `scan-${uuid ? uuid() : Date.now()}`,
    rawText: text,
    detectedType,
    riskLevel,
    confidenceScore: Math.min(Math.max(riskScore + 10, 50), 99), // Adjusted confidence calculation
    urgencyScore: Math.min(urgencyScore, 100),
    financialRiskScore: Math.min(financialRiskScore, 100),
    impersonationTarget,
    keyRedFlags,
    legitimacyChecks,
    recommendedAction,
    safetyTips,
  };
}

module.exports = { analyzeMessageHeuristics };

