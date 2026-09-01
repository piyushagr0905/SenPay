<div align="center">
  <img src="./frontend/frontend/public/logo.png" alt="SenPay Logo" width="120" />

  <h1>🛡️ SenPay (powered by Sentinel AI)</h1>

  <p>
    <strong>The world's first proactive, AI-driven financial guardian.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
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

<div align="center">

| 🏠 Home Dashboard | 🛡️ Pause Before Pay | 📈 AI Analyzer |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/25fc55b0-f9c8-4b3c-88bc-a0e8702de8e8" width="250" alt="SenPay Home Dashboard" /> | <img src="https://github.com/user-attachments/assets/ff1140ff-8267-410a-a3e5-62fd34bad6bd" width="250" alt="SenPay Pause Before Pay" /> | <img src="https://github.com/user-attachments/assets/53dc9060-0119-4970-99fe-56ead8e9d595" width="250" alt="SenPay AI Analyzer" /> |
| **Home Dashboard** | **AI Risk Intervention** | **Financial AI Analyzer** |

</div>

---

## 🚨 The Problem: The Paradox of Fast Fintech

In the golden age of digital finance, transferring money across the globe requires nothing more than a fingerprint and a fraction of a second.

But this unprecedented velocity has birthed a devastating paradox:

> **The speed of our transactions has vastly outpaced the speed of our security.**

Traditional banking applications are built on a reactive paradigm—they wait for the money to be stolen, and then offer you a dispute form.

For vulnerable demographics, a frictionless payment app isn't simply a convenience; **it can become a liability.**

**SenPay** was built to change that.

Instead of reacting after financial damage occurs, SenPay introduces an intelligent security layer that **identifies risk before money leaves the user's account.**

---

 
    

---

## 🧠 Why SenPay Is Different

Traditional financial security is largely **reactive**.

SenPay is designed to be **proactive**.

| Traditional Banking | SenPay |
| :--- | :--- |
| Detects fraud after the transaction | Detects risk before payment |
| Reactive dispute process | Proactive intervention |
| Generic security warnings | Context-aware AI explanations |
| One-size-fits-all controls | Adaptive protection |
| Security creates friction everywhere | Friction only when risk is detected |
| User acts alone | Trusted Contact intervention |
| Static savings | AI-assisted financial optimization |

> **SenPay doesn't just secure your money after something goes wrong. It tries to stop the wrong transaction before it happens.**

---

## 🏗️ System Architecture

```mermaid
graph TD

    A[Client App - React / Vite]
        -->|HTTPS Requests| B[Express.js Backend]

    B --> C{Sentinel AI Risk Engine}

    C -->|Low Risk| D[Process Transaction]
    C -->|Medium Risk| E[Enhanced Verification]
    C -->|High Risk| F[Pause Before Pay]

    F --> G[Explain Risk]
    F --> H[Trusted Contact]

    D --> I[(PostgreSQL Database)]
    E --> I
    G --> I
    H --> I

    I --> J[Prisma ORM]

    B --> K[SafeCheck AI]
    K --> L[Phishing / Scam Analysis]

    B --> M[Financial Intelligence]
    M --> N[Round-Up Engine]

    N --> O[Investment Allocation]
