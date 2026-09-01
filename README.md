<div align="center">
  <img src="./frontend/frontend/public/logo.png" alt="SenPay Logo" width="120" />
  <h1>🛡️ SenPay (powered by Sentinel AI)</h1>
  <p><strong>The world's first proactive, AI-driven financial guardian.</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>

  <p>
    <a href="#-the-problem">The Problem</a> •
    <a href="#-core-features">Features</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-installation--setup">Installation</a>
  </p>
</div>

---

## 📸 App Interface

*(Replace the placeholder URLs with your actual GitHub image URLs once you take screenshots)*

| 🏠 Home Dashboard | 🛡️ Pause Before Pay (AI) | 📈 AI Round-Ups |
| :---: | :---: | :---: |
| <img src="https://placehold.co/250x500/0f172a/ffffff?text=Home+Screen\nScreenshot" width="250" /> | <img src="https://placehold.co/250x500/4c1d95/ffffff?text=AI+Intervention\nScreenshot" width="250" /> | <img src="https://placehold.co/250x500/0ea5e9/ffffff?text=Buy+The+Dip\nScreenshot" width="250" /> |

---

## 🚨 The Problem: The Paradox of Fast Fintech

In the golden age of digital finance, transferring money across the globe requires nothing more than a fingerprint and a fraction of a second. But this unprecedented velocity has birthed a devastating paradox: **The speed of our transactions has vastly outpaced the speed of our security.**

Traditional banking applications are built on a reactive paradigm—they wait for the money to be stolen, and then offer you a dispute form. For vulnerable demographics, a frictionless payment app isn't a convenience; it's a loaded weapon. **SenPay** was built to change that.

---

## ✨ Core Features

<table>
  <tr>
    <td width="50%">
      <h3>🛡️ Sentinel Risk Engine</h3>
      <p>Introduces <strong>Cognitive Friction</strong>. If you initiate a transaction to a known scammer or under suspicious circumstances (e.g., 2 AM transfers to unknown offshore accounts), Sentinel physically intercepts the flow. It forces a "Pause Before Pay" screen and gives you a plain-English explanation of why the transfer is risky. You can even ping a <strong>Trusted Contact</strong> for a second opinion.</p>
    </td>
    <td width="50%">
      <h3>📈 AI Round-Ups ("Buy-The-Dip")</h3>
      <p>Why just save spare change when your app can trade for you? Sentinel analyzes real-time macro-economic data. If you buy a ₹145 coffee while the stock market is crashing, Sentinel dynamically applies a <strong>2.5x multiplier</strong> to your spare change, aggressively "buying the dip" on your behalf.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔍 SafeCheck Sandbox</h3>
      <p>Don't click that link. Paste suspicious SMS messages, WhatsApp forwards, or phishing links directly into the SafeCheck analyzer. Sentinel AI immediately cross-references the text against known phishing patterns and malicious domains to deliver a definitive safe/scam verdict.</p>
    </td>
    <td width="50%">
      <h3>💳 Intelligent Financial Tools</h3>
      <ul>
        <li><strong>Credit Line:</strong> Zero-interest 'Buy Now, Pay Later'.</li>
        <li><strong>Smart Bill Split:</strong> AI scans restaurant receipts, itemizes them, and requests exact amounts from friends.</li>
        <li><strong>Inclusive Controls:</strong> Family Wallets & Senior Safety Mode.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Client App - React/Vite] -->|HTTPS Requests| B(Express.js Backend)
    B --> C{Sentinel Risk Engine}
    C -->|Safe| D[Process Transaction]
    C -->|High Risk| E[Trigger 'Pause Before Pay']
    D --> F[(PostgreSQL Database)]
    E --> F
    F -->|ORM| G(Prisma Client)







🛠️ Installation & Setup
Clone the repository

bash
git clone https://github.com/piyushagr0905/SenPay.git
cd SenPay
Backend Setup

bash
cd backend/backend
npm install
# Set up your .env file with your PostgreSQL DATABASE_URL
npx prisma db push
npx prisma generate
npm start
Frontend Setup (Note: Vite requires the project path to not contain # characters)

bash
cd frontend/frontend
npm install
npm run dev
