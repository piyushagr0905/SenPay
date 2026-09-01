<div align="center">
  <img src="./frontend/frontend/public/logo.png" alt="SenPay Logo" width="120" />
  <h1>🛡️ SenPay (powered by Sentinel AI)</h1>
  <p><strong>The world's first proactive, AI-driven financial guardian.</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#the-problem">The Problem</a> •
    <a href="#installation">Installation</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

---

## 📸 Screenshots
*(Add your screenshots here before pushing to GitHub!)*

| Home Dashboard | Pause Before Pay (AI Intervention) | AI Round-Ups (Buy the Dip) |
| :---: | :---: | :---: |
| <img src="path/to/home-ss.png" width="250" /> | <img src="path/to/pause-ss.png" width="250" /> | <img src="path/to/roundup-ss.png" width="250" /> |

---

## 🚨 The Problem: The Paradox of Fast Fintech

In the golden age of digital finance, transferring money across the globe requires nothing more than a fingerprint and a fraction of a second. But this unprecedented velocity has birthed a devastating paradox: **The speed of our transactions has vastly outpaced the speed of our security.**

Traditional banking applications are built on a reactive paradigm—they wait for the money to be stolen, and then offer you a dispute form. For vulnerable demographics, a frictionless payment app isn't a convenience; it's a loaded weapon. **SenPay** was built to change that.

---

## ✨ Core Features

### 🛡️ Sentinel Risk Engine (Pause Before Pay)
SenPay introduces **Cognitive Friction**. If you initiate a transaction to a known scammer or under suspicious circumstances (e.g., 2 AM transfers to unknown offshore accounts), Sentinel physically intercepts the flow. It flags the anomaly, forces a "Pause Before Pay" screen, and gives you a plain-English explanation of why the transfer is risky. You can even ping a **Trusted Contact** for a second opinion before the money leaves your device.

### 📈 AI Round-Ups ("Buy-The-Dip")
Why just save spare change when your app can trade for you? Sentinel analyzes real-time macro-economic data. If you buy a ₹145 coffee while the stock market is crashing, Sentinel dynamically applies a **2.5x multiplier** to your spare change, aggressively "buying the dip" on your behalf. 

### 🔍 SafeCheck Sandbox
Don't click that link. Paste suspicious SMS messages, WhatsApp forwards, or phishing links directly into the SafeCheck analyzer. Sentinel AI immediately cross-references the text against known phishing patterns and malicious domains to deliver a definitive safe/scam verdict.

### 💳 Intelligent Financial Tools
- **SenPay Credit Line:** Zero-interest, pre-approved 'Buy Now, Pay Later' liquidity.
- **Smart Bill Split:** Uses Optical Character Recognition (OCR) and AI to scan a restaurant receipt, itemize it, and instantly request exact amounts from friends.
- **Inclusive Controls:** Family Wallets (to block gaming purchases for kids) and Senior Safety Mode (strict verification for elderly parents).

---

## 💻 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express
- **Database & ORM:** PostgreSQL, Prisma (v7.10)
- **AI/ML:** Sentinel Risk Heuristics

---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sentinal.git
   cd sentinal
   ```

2. **Backend Setup**
   ```bash
   cd backend/backend
   npm install
   # Set up your .env file with DATABASE_URL
   npx prisma db push
   npx prisma generate
   npm start
   ```

3. **Frontend Setup**
   *(Note: Vite requires the project path to not contain `#` characters)*
   ```bash
   cd frontend/frontend
   npm install
   npm run dev
   ```

---

> *"For the past decade, the fintech industry has been obsessed with asking, 'How fast can we move the user's money?' With SenPay, we are finally asking the right question: 'How safely and intelligently can we manage it?' We are not just building another digital wallet. We are building a financial sanctuary. We are restoring trust to the digital economy, one intelligent transaction at a time."*
