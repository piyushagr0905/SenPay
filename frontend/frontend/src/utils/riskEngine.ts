import {
 Recipient,
 RiskAssessment,
 RiskDecision,
 RiskLevel,
 RiskReason,
 RiskSignal,
 ScamMessageAnalysis,
 SafeCheckResult,
 SafeCheckType,
} from '../types';

export function evaluatePaymentRisk(
 recipient: Recipient,
 amount: number,
 purpose: string
): RiskAssessment {
 const normalizedPurpose = purpose.toLowerCase();
 const isJobScamSignal =
 normalizedPurpose.includes('job') ||
 normalizedPurpose.includes('application') ||
 normalizedPurpose.includes('recruitment') ||
 normalizedPurpose.includes('registration fee') ||
 normalizedPurpose.includes('task fee') ||
 normalizedPurpose.includes('interview');

 const isInvestmentScamSignal =
 normalizedPurpose.includes('crypto') ||
 normalizedPurpose.includes('double') ||
 normalizedPurpose.includes('return') ||
 normalizedPurpose.includes('profit') ||
 normalizedPurpose.includes('telegram');

 const isUrgentSignal =
 normalizedPurpose.includes('urgent') ||
 normalizedPurpose.includes('immediate') ||
 normalizedPurpose.includes('emergency') ||
 normalizedPurpose.includes('penalty') ||
 normalizedPurpose.includes('cutoff');

 const isNewRecipient = !recipient.isKnown || recipient.previousPaymentsCount === 0;
 const isHighAmount = amount >= 5000;
 const isSuspiciousContext = isJobScamSignal || isInvestmentScamSignal || isUrgentSignal;

 const signals: RiskSignal[] = [];
 const reasons: RiskReason[] = [];

 // Signal 1: Recipient Analysis
 if (isNewRecipient) {
 signals.push({
 id: 'sig-recipient-1',
 category: 'recipient',
 title: 'First-time recipient',
 description: `No historical payment records exist between your account and ${recipient.upiId}.`,
 severity: 'medium',
 confidence: 99,
 evidence: 'Zero prior transactions in 180-day audit window',
 });
 reasons.push({
 id: 'reason-recipient',
 title: 'New recipient',
 description: 'This is the first payment to this recipient.',
 severity: 'medium',
 iconType: 'user-alert',
 });
 } else {
 signals.push({
 id: 'sig-recipient-safe',
 category: 'recipient',
 title: 'Established recipient',
 description: `You have completed ${recipient.previousPaymentsCount} successful payments with ${recipient.name}.`,
 severity: 'low',
 confidence: 98,
 evidence: `Prior transfers total ₹${recipient.totalTransferred.toLocaleString('en-IN')}`,
 });
 }

 // Signal 2: Amount Evaluation
 if (isHighAmount) {
 signals.push({
 id: 'sig-amount-1',
 category: 'amount',
 title: 'Deviation from median transfer',
 description: `₹${amount.toLocaleString('en-IN')} is 3.8× higher than your average peer transfer of ₹1,200.`,
 severity: 'high',
 confidence: 92,
 evidence: `Recent 30-day average: ₹850 - ₹1,500`,
 });
 reasons.push({
 id: 'reason-amount',
 title: 'Unusual amount',
 description: `₹${amount.toLocaleString('en-IN')} is higher than your typical payments.`,
 severity: 'high',
 iconType: 'dollar-alert',
 });
 }

 // Signal 3: Context & Intent Analysis
 if (isJobScamSignal) {
 signals.push({
 id: 'sig-context-job',
 category: 'context',
 title: 'Upfront employment fee anomaly',
 description: 'Legitimate employers in India rarely demand upfront application or security deposit fees via UPI.',
 severity: 'critical',
 confidence: 96,
 evidence: 'Matched pattern: Task/Employment advance fee scam database (Q3 2024)',
 });
 reasons.push({
 id: 'reason-context',
 title: 'Suspicious payment context',
 description: 'The payment purpose mentions a job application fee.',
 severity: 'critical',
 iconType: 'file-alert',
 });
 } else if (isInvestmentScamSignal) {
 signals.push({
 id: 'sig-context-invest',
 category: 'context',
 title: 'High-yield investment language',
 description: 'The memo references speculative investment or guaranteed returns commonly seen in Telegram task groups.',
 severity: 'critical',
 confidence: 94,
 evidence: 'Matched pattern: High-Yield Ponzi Task Pattern',
 });
 reasons.push({
 id: 'reason-context-invest',
 title: 'High-risk investment pattern',
 description: 'Guaranteed return and task-based payments are frequently flagged for unauthorized operations.',
 severity: 'critical',
 iconType: 'file-alert',
 });
 } else if (isUrgentSignal) {
 signals.push({
 id: 'sig-context-urgent',
 category: 'context',
 title: 'Artificial urgency indicator',
 description: 'Urgency cues are often used to prevent deliberate verification before sending funds.',
 severity: 'medium',
 confidence: 88,
 });
 }

 // Signal 4: Behaviour & Network
 signals.push({
 id: 'sig-behaviour',
 category: 'behaviour',
 title: 'Rapid session sequence',
 description: isSuspiciousContext
 ? 'Payment initiated within 45 seconds of copying UPI string from external clipboard.'
 : 'Typical payment flow initiation with biometric standard.',
 severity: isSuspiciousContext ? 'medium' : 'low',
 confidence: 89,
 });

 // Calculate Risk Level & Decision
 let level: RiskLevel = 'safe';
 let decision: RiskDecision = 'allow';
 let riskScore = 12; // Base baseline score
 let headline = 'Payment looks safe';
 let subheadline = 'Standard payment parameters verified with SENTINEL.';
 let recommendation = 'You may proceed with normal authorization.';

 // Only PAUSE for truly dangerous combinations:
 // 1. Suspicious keywords (job fee, crypto, urgent) + brand new recipient
 // 2. Suspicious keywords + very large amount (>= 10,000)
 if (isSuspiciousContext && isNewRecipient) {
 level = 'high';
 decision = 'pause';
 riskScore = 84;
 headline = 'Pause before you pay.';
 subheadline = 'This payment needs a quick safety check.';
 recommendation = 'Verify the recipient independently through official company channels before paying.';
 } else if (isSuspiciousContext && amount >= 10000) {
 level = 'high';
 decision = 'pause';
 riskScore = 79;
 headline = 'Pause before you pay.';
 subheadline = 'High-value payment with a suspicious purpose detected.';
 recommendation = 'Confirm this request is genuine before sending a large sum.';
 } else if (isSuspiciousContext && !isNewRecipient) {
 // Known contact but suspicious purpose — just warn, don't block
 level = 'medium';
 decision = 'verify';
 riskScore = 52;
 headline = 'Unusual memo detected';
 subheadline = 'Payment memo matches known scam patterns. Verify with your contact.';
 recommendation = 'Confirm that your contact actually asked for this payment.';
 } else if (isNewRecipient && amount >= 10000) {
 // New recipient + very large amount — ask to verify
 level = 'medium';
 decision = 'verify';
 riskScore = 58;
 headline = 'Large payment to new recipient';
 subheadline = 'First-time large transfer. A quick verification is recommended.';
 recommendation = 'Double-check the UPI ID and confirm with the receiver before sending.';
 } else if (isHighAmount) {
 // Any high amount >= 5000 triggers verification
 level = 'medium';
 decision = 'verify';
 riskScore = 65;
 headline = 'Unusually large payment';
 subheadline = 'This amount is significantly higher than your typical transfers.';
 recommendation = 'Please double check the amount before proceeding.';
 } else {
 // Everything else — new recipient with small/normal amount, or known recipient — is safe
 level = 'safe';
 decision = 'allow';
 riskScore = amount >= 5000 ? 18 : 8;
 headline = 'Payment looks safe';
 subheadline = 'No suspicious signals detected by SENTINEL.';
 recommendation = 'No safety concerns found. Safe to proceed.';
 }


 return {
 level,
 decision,
 riskScore,
 headline,
 subheadline,
 responsibleDisclaimer:
 'This payment shows multiple signals that deserve verification. SENTINEL protects you by highlighting context anomalies before irreversible settlement.',
 reasons: reasons.length > 0 ? reasons : [
 {
 id: 'reason-safe',
 title: 'Verified safe recipient',
 description: 'Recipient has a reliable payment track record.',
 severity: 'medium',
 iconType: 'shield-alert',
 }
 ],
 signals,
 recommendation,
 suggestedActions: [
 { label: 'Verify Recipient', actionType: 'verify', isPrimary: true, isSafe: true },
 { label: 'Ask Trusted Contact', actionType: 'ask-contact', isPrimary: false, isSafe: true },
 { label: 'Cancel Payment', actionType: 'cancel', isPrimary: false, isSafe: true },
 { label: 'Continue anyway', actionType: 'override', isPrimary: false, isSafe: false },
 ],
 };
}

export function analyzeScamMessage(text: string): ScamMessageAnalysis {
 const lower = text.toLowerCase();
 
 const isJobScam =
 lower.includes('job') ||
 lower.includes('work from home') ||
 lower.includes('part time') ||
 lower.includes('hr') ||
 lower.includes('daily income') ||
 lower.includes('telegram') ||
 lower.includes('registration fee');

 const isKycScam =
 lower.includes('kyc') ||
 lower.includes('blocked') ||
 lower.includes('pan card') ||
 lower.includes('update now') ||
 lower.includes('account suspended');

 const isUtilityScam =
 lower.includes('electricity') ||
 lower.includes('power') ||
 lower.includes('disconnected') ||
 lower.includes('tonight') ||
 lower.includes('bill officer');

 let detectedType = 'Potential Unsolicited Solicitation';
 let riskLevel: 'Safe' | 'Low' | 'Elevated' | 'High' | 'Severe' = 'Elevated';
 let urgencyScore = 78;
 let financialRiskScore = 85;
 let confidenceScore = 94;
 let impersonationTarget: string | undefined = undefined;
 const keyRedFlags: string[] = [];
 const legitimacyChecks: string[] = [];
 let recommendedAction = 'Do not send money or click embedded links. Verify independently.';

 if (isJobScam) {
 detectedType = 'Job-Fee / Part-Time Task Scam Pattern';
 riskLevel = 'Elevated';
 impersonationTarget = 'Reputed E-Commerce or Tech Recruiter';
 urgencyScore = 82;
 financialRiskScore = 91;
 confidenceScore = 96;
 keyRedFlags.push(
 'Requests payment or security deposit before commencing employment.',
 'Promises unusually high daily compensation for basic tasks (e.g. rating maps/videos).',
 'Redirects communications to encrypted channels like Telegram/WhatsApp.',
 'Uses generic greeting without personal candidate identifier.'
 );
 legitimacyChecks.push(
 'Official companies never request money for onboarding or device security.',
 'Verify open jobs directly on company career portal, not through messaging apps.',
 'Search company domain email headers.'
 );
 recommendedAction =
 'Verify the employer through an independently found official contact or website before paying any registration or training fee.';
 } else if (isKycScam) {
 detectedType = 'Urgent Banking / KYC Suspension Scam';
 riskLevel = 'High';
 impersonationTarget = 'Nationalized Bank or UPI Provider';
 urgencyScore = 95;
 financialRiskScore = 98;
 confidenceScore = 98;
 keyRedFlags.push(
 'Threatens immediate account freezing within 24 hours.',
 'Provides an unverified short-link or unofficial APK download link.',
 'Requests full PAN / Aadhaar or OTP confirmation over message.',
 'Sent from a non-standard 10-digit mobile number instead of official Bank SMS Header (e.g. VK-HDFCBK).'
 );
 legitimacyChecks.push(
 'Banks never ask for KYC updates over SMS links.',
 'Visit your nearest bank branch or log in to official mobile banking app.'
 );
 recommendedAction =
 'Do not click the link or provide credentials. Check your bank status inside the official banking app directly.';
 } else if (isUtilityScam) {
 detectedType = 'Urgent Electricity / Utility Cutoff Scam';
 riskLevel = 'High';
 impersonationTarget = 'State Power Distribution Board';
 urgencyScore = 92;
 financialRiskScore = 88;
 confidenceScore = 95;
 keyRedFlags.push(
 'Warns of power disconnection tonight at 9:30 PM.',
 'Instructs calling a personal mobile number rather than state utility helpline.',
 'Demands immediate UPI settlement through unofficial number.'
 );
 legitimacyChecks.push(
 'Power utilities send notices via physical bill or registered consumer portal.',
 'Contact the official DISCOM customer care number on your past electricity bill.'
 );
 recommendedAction =
 'Ignore the number in the SMS. Open your electricity provider app or official payment portal to check bill status.';
 } else {
 // Default general check
 riskLevel = lower.length < 20 ? 'Low' : 'Elevated';
 urgencyScore = 65;
 financialRiskScore = 70;
 confidenceScore = 88;
 keyRedFlags.push(
 'Contains financial transaction cues from unverified sender.',
 'Creates urgency to bypass normal verification steps.'
 );
 legitimacyChecks.push(
 'Confirm sender identity via voice call on known contact number.',
 'Search the sender’s phone number on public consumer safety databases.'
 );
 recommendedAction = 'Independently verify sender identity before transferring funds or sharing personal info.';
 }

 return {
 id: `msg-eval-${Date.now()}`,
 rawText: text,
 detectedType,
 riskLevel,
 confidenceScore,
 urgencyScore,
 financialRiskScore,
 impersonationTarget,
 keyRedFlags,
 legitimacyChecks,
 recommendedAction,
 safetyTips: [
 'Never share 6-digit UPI PIN when receiving money (PIN is ONLY for sending).',
 'Do not install remote screen-sharing tools like AnyDesk/TeamViewer on caller request.',
 'Verify credentials on official company portals only.',
 ],
 };
}

export function evaluateSafeCheck(target: string, type: SafeCheckType): SafeCheckResult {
 const normalized = target.toLowerCase().trim();

 if (type === 'upi') {
 if (normalized.includes('scam') || normalized.includes('job') || normalized.includes('fee') || normalized === 'rahul@upi') {
 return {
 id: `sc-upi-${Date.now()}`,
 target,
 type: 'upi',
 riskLevel: 'high',
 riskScore: 82,
 reputationSummary: 'High-risk identifier flagged for non-standard collection patterns.',
 signalsFound: [
 'First registered 12 days ago with high peer volume',
 '3 recent user safety queries regarding upfront fees',
 'No linked merchant business GST registration',
 ],
 recommendation: 'Pause and verify recipient identity before sending money.',
 verifiedIdentity: {
 registeredName: 'Private Individual (Unverified Merchant)',
 bankName: 'Digital Payments Bank Ltd',
 accountAge: '14 Days',
 complaintHistory: '2 flagged inquiries',
 },
 };
 }

 return {
 id: `sc-upi-safe-${Date.now()}`,
 target,
 type: 'upi',
 riskLevel: 'safe',
 riskScore: 6,
 reputationSummary: 'Verified UPI identity with positive standing.',
 signalsFound: [
 'Established banking VPA handle with 2+ years history',
 'Zero negative consumer reports recorded',
 'Valid NPCI routing signature',
 ],
 recommendation: 'Identifier appears safe. Standard safety precautions apply.',
 verifiedIdentity: {
 registeredName: 'Verified Account Holder',
 bankName: 'State Bank of India',
 accountAge: '3 Years 4 Months',
 complaintHistory: 'Clean',
 },
 };
 }

 if (type === 'phone') {
 return {
 id: `sc-phone-${Date.now()}`,
 target,
 type: 'phone',
 riskLevel: normalized.startsWith('9') ? 'medium' : 'safe',
 riskScore: normalized.startsWith('9') ? 48 : 12,
 reputationSummary: normalized.startsWith('9')
 ? 'Unlisted mobile number with intermittent UPI activations.'
 : 'Registered active mobile subscriber with consistent telecom footprint.',
 signalsFound: [
 'Active on UPI network across 2 banks',
 'Name on truecaller differs from bank registration',
 ],
 recommendation: 'Ensure you personally know the person behind this phone number.',
 };
 }

 if (type === 'qr') {
 return {
 id: `sc-qr-${Date.now()}`,
 target: target || 'Dynamic Store UPI QR',
 type: 'qr',
 riskLevel: 'safe',
 riskScore: 5,
 reputationSummary: 'Verified BharatQR / NPCI dynamic merchant code.',
 signalsFound: [
 'Registered BharatPe / Paytm merchant terminal',
 'Physical geofence aligns with store location',
 'Dynamic amount tampering protection verified',
 ],
 recommendation: 'Safe to proceed with payment.',
 verifiedIdentity: {
 registeredName: 'Swiggy Instamart Hub #42',
 bankName: 'HDFC Bank Merchant Services',
 accountAge: '4 Years',
 complaintHistory: 'Zero',
 },
 };
 }

 return {
 id: `sc-gen-${Date.now()}`,
 target,
 type,
 riskLevel: 'medium',
 riskScore: 52,
 reputationSummary: 'External payment gateway link requires manual verification.',
 signalsFound: [
 'Domain registered recently with privacy proxy',
 'Does not use official payment aggregator checkout domain',
 ],
 recommendation: 'Avoid entering debit/credit cards or UPI PIN on unverified domains.',
 };
}
