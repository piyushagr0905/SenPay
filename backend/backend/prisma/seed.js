require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.caseTimelineEvent.deleteMany();
  await prisma.caseEvidence.deleteMany();
  await prisma.suggestedAction.deleteMany();
  await prisma.riskSignal.deleteMany();
  await prisma.riskReason.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.scamCase.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.recipient.deleteMany();
  await prisma.trustedContact.deleteMany();
  await prisma.userStats.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.scamMessageAnalysis.deleteMany();
  await prisma.safeCheckResult.deleteMany();

  console.log('Cleared existing data.');

  // Create User Profile
  const user = await prisma.userProfile.create({
    data: {
      id: 'user-krishu',
      name: 'Krishu Chaurasia',
      phone: '+91 99887 76655',
      upiId: 'krishuchaurasia0092@oksbi',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      balance: 105000.00,
      protectionActive: true,
      frictionLevel: 'proportional',
      seniorSafetyMode: false,
      securityScore: 98,
      stats: {
        create: {
          scamsPrevented: 3,
          amountSaved: 23500,
          scansPerformed: 42,
          safePaymentsCount: 184,
        }
      },
      trustedContacts: {
        create: [
          {
            id: 'tc-dad',
            name: 'Dad (Sanjay)',
            relationship: 'Father',
            phone: '+91 98200 12345',
            avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
            isEmergencyContact: true,
            canApproveHighRisk: true,
            status: 'active',
          }
        ]
      }
    }
  });

  console.log('Created User Profile.');

  // Create Recipients
  const recipients = [
    {
      id: 'rec-mayank-known',
      name: 'Mayank Chaurasia',
      upiId: 'mayankchaurasia@oksbi',
      phone: '+91 98765 43210',
      initials: 'MC',
      isKnown: true,
      previousPaymentsCount: 14,
      totalTransferred: 18500,
      trustScore: 98,
      category: 'Friend',
      isVerifiedMerchant: false,
    },
    {
      id: 'rec-swiggy',
      name: 'Swiggy',
      upiId: 'swiggy.pay@hdfcbank',
      initials: 'SW',
      isKnown: true,
      previousPaymentsCount: 38,
      totalTransferred: 34200,
      trustScore: 100,
      category: 'Merchant',
      isVerifiedMerchant: true,
    }
  ];

  for (const recipient of recipients) {
    await prisma.recipient.create({ data: recipient });
  }

  console.log('Created Recipients.');

  // Create Payments
  await prisma.paymentTransaction.create({
    data: {
      id: 'tx-89012',
      amount: 450,
      purpose: 'Dinner at Rajdhani',
      purposeCategory: 'Food & Dining',
      paymentMethod: 'upi',
      timestamp: new Date('2023-11-20T20:30:00Z'),
      formattedDate: '20 Nov 2023, 8:30 PM',
      status: 'completed',
      recipientId: 'rec-mayank-known',
    }
  });
  
  await prisma.scamMessageAnalysis.create({
    data: {
      id: 'msg-1',
      rawText: 'Dear customer, your bank account is blocked. Click here to update KYC immediately.',
      detectedType: 'Phishing',
      riskLevel: 'Severe',
      confidenceScore: 98.5,
      urgencyScore: 90,
      financialRiskScore: 95,
      impersonationTarget: 'Bank',
      keyRedFlags: ['Urgency', 'Suspicious link', 'Generic greeting'],
      legitimacyChecks: ['No official communication found', 'Link domain mismatch'],
      recommendedAction: 'Do not click the link. Block the sender.',
      safetyTips: ['Banks never ask for KYC via SMS link.', 'Always use official apps.']
    }
  });

  console.log('Created Payments and Scam Messages.');

  // Create Synthetic Mule Network Graph Data
  await prisma.graphEdge.deleteMany();
  await prisma.graphEntity.deleteMany();

  const entities = [
    {
      id: 'node-victim-1',
      label: 'Victim A',
      type: 'victim',
      riskLevel: 'low',
      totalReceived: 5000,
      totalSent: 25000,
      transactionCount: 4,
      connectedCount: 2,
    },
    {
      id: 'node-victim-2',
      label: 'Victim B',
      type: 'victim',
      riskLevel: 'low',
      totalReceived: 2000,
      totalSent: 18000,
      transactionCount: 3,
      connectedCount: 1,
    },
    {
      id: 'node-mule-1',
      label: 'Suspected Mule X',
      type: 'mule',
      riskLevel: 'critical',
      totalReceived: 43000,
      totalSent: 42500,
      transactionCount: 45,
      connectedCount: 8,
      location: 'New Delhi',
      flaggedAt: new Date(),
    },
    {
      id: 'node-mule-2',
      label: 'Suspected Mule Y',
      type: 'mule',
      riskLevel: 'high',
      totalReceived: 42500,
      totalSent: 42000,
      transactionCount: 28,
      connectedCount: 4,
      location: 'Mumbai',
    },
    {
      id: 'node-cashout-1',
      label: 'Crypto Cashout',
      type: 'cashout',
      riskLevel: 'critical',
      totalReceived: 150000,
      totalSent: 150000,
      transactionCount: 120,
      connectedCount: 15,
      flaggedAt: new Date(),
    }
  ];

  for (const entity of entities) {
    await prisma.graphEntity.create({ data: entity });
  }

  const edges = [
    {
      id: 'edge-1',
      sourceId: 'node-victim-1',
      targetId: 'node-mule-1',
      relationType: 'paid_to',
      amount: 25000,
      timestamp: new Date('2023-11-20T10:00:00Z'),
      isHighRisk: true,
    },
    {
      id: 'edge-2',
      sourceId: 'node-victim-2',
      targetId: 'node-mule-1',
      relationType: 'paid_to',
      amount: 18000,
      timestamp: new Date('2023-11-20T11:30:00Z'),
      isHighRisk: true,
    },
    {
      id: 'edge-3',
      sourceId: 'node-mule-1',
      targetId: 'node-mule-2',
      relationType: 'rapid_transfer',
      amount: 42500,
      timestamp: new Date('2023-11-20T11:45:00Z'),
      isHighRisk: true,
    },
    {
      id: 'edge-4',
      sourceId: 'node-mule-2',
      targetId: 'node-cashout-1',
      relationType: 'rapid_transfer',
      amount: 42000,
      timestamp: new Date('2023-11-20T12:00:00Z'),
      isHighRisk: true,
    }
  ];

  for (const edge of edges) {
    await prisma.graphEdge.create({ data: edge });
  }

  console.log('Created Synthetic Graph Data.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
