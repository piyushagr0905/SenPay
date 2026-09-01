const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { analyzeMessageHeuristics } = require('./utils/heuristics');
const { getCaseDetails, generateGraphData } = require('./utils/graphMockData');
const { analyzeMessageWithGemini, evaluateTransactionRiskWithGemini } = require('./utils/ai');
const connectionString = process.env.DATABASE_URL;
const app = express();
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints will be added here

// ─── USER PROFILE ─────────────────────────────────────────────────────────────
// Auto find-or-create user profile by device ID (invisible to user)
app.get('/api/users/me', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'];
    if (!deviceId) return res.status(400).json({ error: 'Missing device ID' });

    // Try to find existing profile for this device
    let user = await prisma.userProfile.findUnique({
      where: { deviceId },
      include: { trustedContacts: true, stats: true },
    });

    // Auto-create a brand new profile if this is a new device
    if (!user) {
      user = await prisma.userProfile.create({
        data: {
          deviceId,
          name: 'SenPay User',
          phone: '',
          upiId: `user_${deviceId.slice(0, 8)}@senpay`,
          avatarUrl: `https://ui-avatars.com/api/?name=S&background=6366f1&color=fff&size=120`,
          balance: 105000.00,
          protectionActive: true,
          frictionLevel: 'proportional',
          seniorSafetyMode: false,
          securityScore: 98,
          stats: {
            create: {
              scamsPrevented: 0,
              amountSaved: 0,
              scansPerformed: 0,
              safePaymentsCount: 0,
            }
          },
        },
        include: { trustedContacts: true, stats: true },
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/me', async (req, res) => {
  try {
    const { name, balance } = req.body;
    
    const user = await prisma.userProfile.findFirst();
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const dataToUpdate = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (balance !== undefined) dataToUpdate.balance = parseFloat(balance);

    const updated = await prisma.userProfile.update({
      where: { id: user.id },
      data: dataToUpdate,
      include: {
        trustedContacts: true,
        stats: true,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save payment linked to this device's user
app.post('/api/payments', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'];
    const { amount, purpose, purposeCategory, paymentMethod, recipientId, recipientUpi, recipientName, riskAssessment } = req.body;
    if (!amount || !purpose) return res.status(400).json({ error: 'amount and purpose are required' });

    // Find this device's user for linking
    let userRecord = null;
    if (deviceId) {
      userRecord = await prisma.userProfile.findUnique({ where: { deviceId } });
    }

    let recipient = await prisma.recipient.findFirst({
      where: { OR: [{ id: recipientId }, { upiId: recipientUpi }] }
    });
    if (!recipient) {
      recipient = await prisma.recipient.create({
        data: {
          name: recipientName || recipientUpi || 'Unknown',
          upiId: recipientUpi || `unknown-${Date.now()}`,
          initials: (recipientName || 'U').substring(0, 2).toUpperCase(),
          isKnown: false,
          previousPaymentsCount: 0,
          totalTransferred: 0,
          trustScore: 40,
        }
      });
    }

    const tx = await prisma.paymentTransaction.create({
      data: {
        amount, purpose,
        purposeCategory: purposeCategory || 'General Transfer',
        paymentMethod: paymentMethod || 'upi',
        timestamp: new Date(),
        formattedDate: new Date().toLocaleDateString('en-IN'),
        status: riskAssessment?.decision === 'block' ? 'blocked' : ['pause', 'verify'].includes(riskAssessment?.decision) ? 'paused' : 'completed',
        transactionRef: `SENT-${Date.now().toString().slice(-6)}`,
        recipientId: recipient.id,
        ...(userRecord ? { userId: userRecord.id } : {}),
        ...(riskAssessment ? {
          riskAssessment: {
            create: {
              level: riskAssessment.level || 'low',
              decision: riskAssessment.decision || 'allow',
              riskScore: riskAssessment.riskScore || 0,
              headline: riskAssessment.headline || 'Payment Processed',
              subheadline: riskAssessment.subheadline || '',
              responsibleDisclaimer: riskAssessment.responsibleDisclaimer || '',
              recommendation: riskAssessment.recommendation || '',
              reasons: {
                create: (riskAssessment.reasons || []).map((r) => ({
                  title: r.title || 'Risk Signal',
                  description: r.description || '',
                  severity: r.severity || 'low',
                  iconType: r.iconType || 'alert',
                }))
              },
            }
          }
        } : {})
      },
      include: { recipient: true, riskAssessment: true }
    });

    if (userRecord && tx.status !== 'blocked') {
      await prisma.userProfile.update({
        where: { id: userRecord.id },
        data: { balance: { decrement: amount } }
      });
    }

    res.json(tx);
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payments scoped to this device only
app.get('/api/payments', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'];
    let userId = undefined;
    if (deviceId) {
      const u = await prisma.userProfile.findUnique({ where: { deviceId } });
      userId = u?.id;
    }
    const payments = await prisma.paymentTransaction.findMany({
      where: userId ? { userId } : {},
      include: {
        recipient: true,
        riskAssessment: { include: { reasons: true, signals: true, suggestedActions: true } },
      },
      orderBy: { timestamp: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/recipients', async (req, res) => {
  try {
    const recipients = await prisma.recipient.findMany();
    res.json(recipients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cases', async (req, res) => {
  try {
    const cases = await prisma.scamCase.findMany({
      include: {
        evidence: true,
        timeline: true,
        transaction: {
          include: {
            recipient: true
          }
        }
      }
    });
    res.json(cases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/scam-messages', async (req, res) => {
  try {
    const messages = await prisma.scamMessageAnalysis.findMany();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/analyze-message', async (req, res) => {
  try {
    const { text, sender } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for analysis' });
    }
    
    // You can switch this to `analyzeMessageWithGemini(text, sender)` when you add your API key!
    const analysisResult = await analyzeMessageHeuristics(text, sender, prisma);
    
    // Save to DB so it shows up in Pattern Radar
    await prisma.scamMessageAnalysis.create({
      data: {
        rawText: analysisResult.rawText || text,
        detectedType: analysisResult.detectedType || 'Unknown',
        riskLevel: analysisResult.riskLevel || 'Safe',
        confidenceScore: analysisResult.confidenceScore || 0,
        urgencyScore: analysisResult.urgencyScore || 0,
        financialRiskScore: analysisResult.financialRiskScore || 0,
        impersonationTarget: analysisResult.impersonationTarget || null,
        keyRedFlags: analysisResult.keyRedFlags || [],
        legitimacyChecks: analysisResult.legitimacyChecks || [],
        recommendedAction: analysisResult.recommendedAction || '',
        safetyTips: analysisResult.safetyTips || []
      }
    });

    res.json(analysisResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during analysis' });
  }
});

app.post('/api/evaluate-risk', async (req, res) => {
  try {
    const { recipient, amount, purpose } = req.body;
    if (!recipient || !amount || !purpose) {
      return res.status(400).json({ error: 'Recipient, amount, and purpose are required' });
    }

    // Basic heuristic for payment risk since no dedicated heuristic engine exists
    let level = 'low';
    let decision = 'allow';
    let riskScore = 15;
    let headline = 'Payment Looks Safe';
    let subheadline = 'Based on our heuristics engine analysis.';
    
    // Demo Scenario Handlers
    if (amount === 75000) {
        // High-risk pause demo (Mule network)
        level = 'critical';
        decision = 'pause';
        riskScore = 95;
        headline = 'High Risk Payment Paused';
        subheadline = 'Matches known mule network activity.';
    } else if (purpose.toLowerCase().includes('job') || purpose.toLowerCase().includes('registration fee')) {
        // Legitimate unusual payment (False positive override demo)
        level = 'high';
        decision = 'verify';
        riskScore = 80;
        headline = 'Unusual Payment Pattern';
        subheadline = 'This matches some scam profiles, please verify.';
    } else if (amount >= 10000 || purpose.toLowerCase().includes('crypto') || purpose.toLowerCase().includes('investment')) {
        level = 'high';
        decision = 'pause';
        riskScore = 75;
        headline = 'High Risk Payment Detected';
    }

    const riskAssessment = {
      level, decision, riskScore,
      headline,
      subheadline,
      responsibleDisclaimer: 'Always verify recipient identity.',
      reasons: [], signals: [], recommendation: 'Proceed with caution.',
      suggestedActions: [
        { label: "Cancel Payment", actionType: "cancel", isPrimary: true, isSafe: true },
        { label: "Continue anyway", actionType: "override", isPrimary: false, isSafe: false }
      ]
    };
    res.json(riskAssessment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error during risk evaluation' });
  }
});

app.post('/api/whitelist-sender', async (req, res) => {
  try {
    const { sender } = req.body;
    if (!sender) {
      return res.status(400).json({ error: 'Sender is required' });
    }

    // Find or create recipient
    let recipient = await prisma.recipient.findFirst({
      where: {
        OR: [
          { name: { equals: sender, mode: 'insensitive' } },
          { phone: sender },
          { upiId: sender }
        ]
      }
    });

    if (recipient) {
      recipient = await prisma.recipient.update({
        where: { id: recipient.id },
        data: { isWhitelisted: true }
      });
    } else {
      recipient = await prisma.recipient.create({
        data: {
          name: sender,
          phone: sender,
          upiId: sender,
          initials: sender.substring(0, 2).toUpperCase(),
          isKnown: true,
          previousPaymentsCount: 0,
          totalTransferred: 0,
          trustScore: 100,
          isWhitelisted: true
        }
      });
    }

    res.json({ success: true, recipient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MISSING 5: SafeCheck recipient risk endpoint
app.post('/api/safecheck/recipient', async (req, res) => {
  try {
    const { target, type } = req.body;
    if (!target) return res.status(400).json({ error: 'Target is required' });

    // Mock risk assessment based on input
    let riskLevel = 'Low';
    let riskScore = 15;
    let reputationSummary = 'This recipient appears legitimate.';
    let signalsFound = ['Active for 2+ years'];
    let recommendation = 'Safe to pay.';

    if (target.includes('unknown') || target.includes('test')) {
       riskLevel = 'Medium';
       riskScore = 45;
       reputationSummary = 'This is a new or unknown recipient.';
       signalsFound = ['New account', 'No payment history'];
       recommendation = 'Verify identity before paying.';
    } else if (target.includes('scam') || target.includes('fake')) {
       riskLevel = 'High';
       riskScore = 85;
       reputationSummary = 'This recipient has been reported for suspicious activity.';
       signalsFound = ['Multiple user reports', 'Suspicious activity pattern'];
       recommendation = 'Do not pay. High risk of fraud.';
    }

    const result = await prisma.safeCheckResult.create({
      data: {
        target,
        type: type || 'upi',
        riskLevel,
        riskScore,
        reputationSummary,
        signalsFound,
        recommendation
      }
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MISSING 5: Business Dashboard Risk Feed
app.get('/api/business/risk-feed', async (req, res) => {
  try {
    const highRiskTx = await prisma.paymentTransaction.findMany({
      where: {
        riskAssessment: {
          isNot: null
        }
      },
      include: {
        recipient: true,
        riskAssessment: true
      },
      orderBy: { timestamp: 'desc' },
      take: 20
    });
    res.json(highRiskTx);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MISSING 5: Business Dashboard Stats
app.get('/api/business/queue', async (req, res) => {
  try {
    const queueTxs = await prisma.paymentTransaction.findMany({
      where: {
        riskAssessment: {
          decision: { in: ['pause', 'verify'] }
        },
        status: { notIn: ['completed', 'blocked'] }
      },
      include: {
        recipient: true,
        riskAssessment: {
          include: { reasons: true }
        }
      },
      orderBy: { timestamp: 'asc' }
    });
    res.json(queueTxs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/business/queue/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    
    if (!['release', 'block'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const txToUpdate = await prisma.paymentTransaction.findUnique({ where: { id } });
    if (!txToUpdate) return res.status(404).json({ error: 'Transaction not found' });

    const newStatus = action === 'release' ? 'completed' : 'blocked';
    
    const tx = await prisma.paymentTransaction.update({
      where: { id },
      data: { status: newStatus },
      include: { recipient: true }
    });

    if (txToUpdate.amount) {
      if (action === 'release') {
        // Money was already deducted when payment was initiated.

      } else if (action === 'block') {
        // Add money back if blocked
        if (txToUpdate.userId) {
          await prisma.userProfile.update({
            where: { id: txToUpdate.userId },
            data: { balance: { increment: txToUpdate.amount } }
          });
        }
      }
    }
    
    res.json({ success: true, transaction: tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/business/cases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const details = getCaseDetails(id);
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/business/graph/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const graphData = generateGraphData(id);
    res.json(graphData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/business/stats', async (req, res) => {
  try {
    // Total payment risk scans (from all RiskAssessments ever created)
    const totalPaymentScans = await prisma.riskAssessment.count();
    // Total message scans from the Scam Analyzer
    const totalMessageScans = await prisma.scamMessageAnalysis.count();
    const totalScansToday = totalPaymentScans + totalMessageScans;

    // Interventions = payments that were flagged/paused/blocked
    const interventionsToday = await prisma.riskAssessment.count({
      where: { decision: { in: ['pause', 'block', 'verify'] } }
    });

    // Amount saved = sum of all paused/blocked payment amounts
    const blockedTxs = await prisma.paymentTransaction.findMany({
      where: { riskAssessment: { decision: { in: ['pause', 'block', 'verify'] } } }
    });
    const amountSavedToday = blockedTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    // Total recipients scanned via SafeCheck
    const safeChecks = await prisma.safeCheckResult.count();

    const stats = {
      totalScansToday,
      interventionsToday,
      amountSavedToday,
      safeChecksPerformed: safeChecks,
      falsePositiveRate: totalScansToday > 0 
        ? ((totalScansToday - interventionsToday) / totalScansToday * 100).toFixed(1) + '%'
        : '0%'
    };
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MISSING 6: Follow the Money Network Graph Data
app.get('/api/business/network', async (req, res) => {
  try {
    const nodes = await prisma.graphEntity.findMany();
    const edges = await prisma.graphEdge.findMany();
    res.json({ nodes, edges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MISSING 5: Pattern Radar Data
app.get('/api/business/patterns', async (req, res) => {
  try {
    const analyses = await prisma.scamMessageAnalysis.findMany();
    
    if (analyses.length === 0) {
      // Return empty array if no data exists, no fake mock data!
      return res.json([]);
    }

    const typeCount = {};
    analyses.forEach(a => {
      const type = a.detectedType || 'Unknown';
      if (!typeCount[type]) typeCount[type] = { count: 0, highRisk: 0 };
      typeCount[type].count++;
      if (a.riskLevel === 'Severe' || a.riskLevel === 'High') {
        typeCount[type].highRisk++;
      }
    });

    const patterns = Object.keys(typeCount).map((type, i) => {
      const data = typeCount[type];
      return {
        id: i + 1,
        name: type,
        severity: data.highRisk > 5 ? 'critical' : (data.highRisk > 0 ? 'high' : 'medium'),
        occurrences: data.count,
        growth: '+10%'
      };
    }).sort((a, b) => b.occurrences - a.occurrences).slice(0, 5);

    res.json(patterns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MISSING 2: Ask SENTINEL AI Assistant
app.post('/api/ask-sentinel', async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Use OpenAI to analyze the message + context
    let aiResponseText = '';
    
    // Using analyzeMessageHeuristics as the AI engine (Swap to analyzeMessageWithGemini for real LLM)
    const analysis = await analyzeMessageHeuristics(message, context || 'User Input', prisma);
    
    if (analysis.riskLevel === 'Severe' || analysis.riskLevel === 'High') {
      aiResponseText = `I detected a ${analysis.detectedType} pattern in this message. \n\n**Risk Level:** ${analysis.riskLevel}\n\n**Red Flags:** ${analysis.keyRedFlags.join(', ')}\n\n**Recommendation:** ${analysis.recommendedAction}\n\n${analysis.safetyTips.join(' ')}`;
    } else {
      aiResponseText = `This message doesn't strongly match known scam patterns, but always stay vigilant. Ensure you personally know the sender before making any payments.`;
    }

    res.json({ 
      id: `chat-${Date.now()}`,
      text: aiResponseText,
      analysisResult: analysis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
