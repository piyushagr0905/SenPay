import { UserProfile, PaymentTransaction, Recipient, ScamCase, ScamMessageAnalysis, RiskAssessment } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://senpay-backend.onrender.com/api';

const getDeviceId = (): string => {
  return 'global-demo-device';
};


// All API calls automatically include this device's unique ID
const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'X-Device-Id': getDeviceId(),
});

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update user profile');
  return response.json();
};

export const fetchPayments = async (): Promise<PaymentTransaction[]> => {
  const response = await fetch(`${API_BASE_URL}/payments`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch payments');
  return response.json();
};

export const fetchRecipients = async (): Promise<Recipient[]> => {
  const response = await fetch(`${API_BASE_URL}/recipients`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch recipients');
  return response.json();
};

export const fetchCases = async (): Promise<ScamCase[]> => {
  const response = await fetch(`${API_BASE_URL}/cases`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch cases');
  return response.json();
};

export const fetchScamMessages = async (): Promise<ScamMessageAnalysis[]> => {
  const response = await fetch(`${API_BASE_URL}/scam-messages`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch scam messages');
  return response.json();
};

export const analyzeMessage = async (text: string, sender?: string): Promise<ScamMessageAnalysis> => {
  const response = await fetch(`${API_BASE_URL}/analyze-message`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ text, sender }),
  });
  if (!response.ok) throw new Error('Failed to analyze message');
  return response.json();
};

export const evaluatePaymentRiskAsync = async (recipient: Recipient, amount: number, purpose: string): Promise<RiskAssessment> => {
  const response = await fetch(`${API_BASE_URL}/evaluate-risk`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ recipient, amount, purpose }),
  });
  if (!response.ok) throw new Error('Failed to evaluate risk');
  return response.json();
};

export const fetchBusinessRiskFeed = async (): Promise<PaymentTransaction[]> => {
  const response = await fetch(`${API_BASE_URL}/business/risk-feed`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch risk feed');
  return response.json();
};

export const fetchBusinessQueue = async (): Promise<PaymentTransaction[]> => {
  const response = await fetch(`${API_BASE_URL}/business/queue`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch business queue');
  return response.json();
};

export const resolveBusinessQueue = async (txId: string, action: 'release' | 'block'): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/business/queue/${txId}/resolve`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ action }),
  });
  if (!response.ok) throw new Error('Failed to resolve queue item');
  return response.json();
};

export const fetchBusinessStats = async (): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/business/stats`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch business stats');
  return response.json();
};

export const fetchBusinessPatterns = async (): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/business/patterns`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Failed to fetch pattern radar');
  return response.json();
};

export const askSentinel = async (message: string, context?: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/ask-sentinel`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message, context }),
  });
  if (!response.ok) throw new Error('Failed to ask sentinel');
  return response.json();
};
