export type NavigationTab = 'home' | 'pay' | 'safecheck' | 'protect' | 'profile' | 'business_dashboard' | 'insights';

export type PaymentMethod = 'upi' | 'qr' | 'contact' | 'bank';

export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export type RiskDecision = 'allow' | 'verify' | 'pause' | 'escalate';

export type PaymentPurposeCategory = 
 | 'General Transfer'
 | 'Job Application / Registration Fee'
 | 'Rent / Security Deposit'
 | 'Crypto / High Return Investment'
 | 'Urgent Medical / Family Emergency'
 | 'E-Commerce / Online Marketplace'
 | 'Utility Bill'
 | 'Food & Dining'
 | 'Custom';

export interface Recipient {
 id: string;
 name: string;
 upiId: string;
 phone?: string;
 bankAccount?: string;
 avatarUrl?: string;
 initials: string;
 isKnown: boolean;
 previousPaymentsCount: number;
 totalTransferred: number;
 trustScore: number; // 0 - 100
 category?: 'Friend' | 'Merchant' | 'Unknown' | 'Flagged';
 isVerifiedMerchant?: boolean;
}

export interface RiskSignal {
 id: string;
 category: 'recipient' | 'amount' | 'context' | 'behaviour' | 'device';
 title: string;
 description: string;
 severity: 'low' | 'medium' | 'high' | 'critical';
 confidence: number; // percentage e.g. 94
 evidence?: string;
}

export interface RiskReason {
 id: string;
 title: string;
 description: string;
 severity: 'medium' | 'high' | 'critical';
 iconType: 'user-alert' | 'dollar-alert' | 'file-alert' | 'clock-alert' | 'shield-alert';
}

export interface RiskAssessment {
 level: RiskLevel;
 decision: RiskDecision;
 riskScore: number; // 0 (safest) - 100 (scam)
 headline: string;
 subheadline: string;
 responsibleDisclaimer: string;
 reasons: RiskReason[];
 signals: RiskSignal[];
 recommendation: string;
 suggestedActions: {
 label: string;
 actionType: 'verify' | 'ask-contact' | 'cancel' | 'override';
 isPrimary?: boolean;
 isSafe?: boolean;
 }[];
}

export interface PaymentTransaction {
 id: string;
 recipient: Recipient;
 amount: number;
 purpose: string;
 purposeCategory: PaymentPurposeCategory;
 paymentMethod: PaymentMethod;
 timestamp: string;
 formattedDate: string;
 status: 'completed' | 'paused' | 'cancelled' | 'flagged' | 'under_review' | 'blocked';
 riskAssessment?: RiskAssessment;
 transactionRef?: string;
 note?: string;
}

export type SafeCheckType = 'upi' | 'phone' | 'qr' | 'link' | 'message';

export interface SafeCheckResult {
 id: string;
 target: string;
 type: SafeCheckType;
 riskLevel: RiskLevel;
 riskScore: number;
 reputationSummary: string;
 signalsFound: string[];
 recommendation: string;
 verifiedIdentity?: {
 registeredName: string;
 bankName: string;
 accountAge: string;
 complaintHistory: string;
 };
}

export interface ScamMessageAnalysis {
 id: string;
 rawText: string;
 detectedType: string;
 riskLevel: 'Safe' | 'Low' | 'Elevated' | 'High' | 'Severe';
 confidenceScore: number;
 urgencyScore: number; // 0 - 100
 financialRiskScore: number; // 0 - 100
 impersonationTarget?: string;
 keyRedFlags: string[];
 legitimacyChecks: string[];
 recommendedAction: string;
 safetyTips: string[];
}

export interface CaseEvidence {
 id: string;
 type: 'screenshot' | 'message' | 'receipt' | 'link' | 'call_log';
 fileName: string;
 fileSize?: string;
 previewUrl?: string;
 timestamp: string;
 extractedText?: string;
}

export interface CaseTimelineEvent {
 id: string;
 title: string;
 description: string;
 timestamp: string;
 status: 'completed' | 'warning' | 'current' | 'pending';
}

export interface ScamCase {
 id: string;
 caseNumber: string;
 transactionId?: string;
 transaction?: PaymentTransaction;
 title: string;
 description: string;
 scamType: string;
 reportedAmount: number;
 reportedAt: string;
 status: 'draft' | 'submitted' | 'under_bank_review' | 'reported_to_cybercell' | 'resolved';
 evidence: CaseEvidence[];
 timeline: CaseTimelineEvent[];
 recommendedNextSteps: string[];
 cyberCellReference?: string;
 bankDisputeId?: string;
}

export interface TrustedContact {
 id: string;
 name: string;
 relationship: string;
 phone: string;
 avatarUrl?: string;
 isEmergencyContact: boolean;
 canApproveHighRisk: boolean;
 status: 'active' | 'pending';
}

export interface UserProfile {
 id: string;
 name: string;
 phone: string;
 upiId: string;
 avatarUrl: string;
 balance: number;
 protectionActive: boolean;
 frictionLevel: 'proportional' | 'high_vigilance' | 'standard';
 seniorSafetyMode: boolean;
 globalModeEnabled: boolean;
 familyUIEnabled: boolean;
 trustedContacts: TrustedContact[];
 securityScore: number; // e.g. 96
 stats: {
 scamsPrevented: number;
 amountSaved: number;
 scansPerformed: number;
 safePaymentsCount: number;
 };
}
