# Build My Vision — Design Collaboration Platform

> **Bridging the gap between customers and architectural designers through guided vision submission, automated technical translation, and a streamlined request-to-delivery collaboration workflow.**

---

## 🌟 Executive Summary & Abstract

Many individuals have a clear, inspiring vision for their ideal home, school, or commercial building, but struggle to articulate their ideas due to unfamiliarity with architectural terminology and structural engineering concepts. This disconnect leads to miscommunication, lengthy revision cycles, and unsatisfactory design outcomes.

**Build My Vision** democratizes architectural services by providing:
1. **A Guided "Vision Builder" Wizard**: Empowers everyday customers to express lifestyle, lighting, spatial, and functional preferences without needing technical architectural jargon.
2. **Automated Architectural Translation Engine**: Interprets everyday customer desires (e.g., *"lots of morning sun in the kitchen"*, *"sound-isolated room for work"*, *"safe play courtyard"*) into professional specifications (clerestory fenestration, acoustic STC ratings, spatial zoning, mass timber joinery).
3. **Certified Designer & Portfolio Showcase**: Connects clients with architects and structural engineers filtered by style, credentials, and previous works.
4. **5-Stage Request-to-Delivery Workflow**: End-to-end milestone tracker from initial brief through schematic drafts, interactive pinpoint revisions, and permit blueprint handover.
5. **Real-Time Collaboration**: WebSocket chat room per project with typing indicators, notification badges, and file attachments.
6. **Interactive Pinpoint Feedback**: Reviewers click anywhere on 2D floor plans or 3D renders to drop numbered annotation pins with targeted revision instructions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | **React.js 19**, **Vite**, **Tailwind CSS v4**, **Lucide React** |
| **Backend** | **Node.js**, **Express.js**, **Socket.IO** (WebSockets) |
| **Database** | **MySQL 8.0** via `mysql2/promise` (with automated schema creation & seamless persistent fallback engine) |
| **Auth & Security** | **JSON Web Tokens (JWT)**, **Bcrypt.js** password hashing |
| **File Handling** | **Multer** for schematic uploads, blueprints, and assets |

---

## 🔄 The 5-Stage Request-to-Delivery Workflow

```
[ Stage 1: Brief Submitted ]
            ↓
[ Stage 2: Designer Scoped & Matched ]
            ↓
[ Stage 3: Drafting Schematics & 3D Photometrics ]
            ↓
[ Stage 4: Client Review & Pinpoint Revisions ]
            ↓
[ Stage 5: Final Delivery Approved & Blueprint Package Handover ]
```

1. **Stage 1 — Vision Brief Submitted**: Customer completes the guided questionnaire. System auto-generates the Architectural Translation Matrix.
2. **Stage 2 — Designer Scoped**: Architect or engineer reviews the brief, kickoff questions, and accepts the project.
3. **Stage 3 — Drafting Schematics**: Designer drafts 2D spatial layouts, structural plans, and 3D daylight studies.
4. **Stage 4 — Client Review & Revisions**: Customer views high-res schematics in the interactive viewer, drops pinpoint revision markers directly on the drawing, and requests adjustments.
5. **Stage 5 — Final Delivery & Handover**: Designer uploads the final permit construction package (PDF blueprints, CAD DWG source, 4K renders). Customer signs off and leaves a verified review.

---

## 📊 Database Schema (MySQL)

The relational schema is configured in [`server/config/schema.sql`](file:///C:/Users/aishd/.gemini/antigravity/scratch/build-my-vision/server/config/schema.sql):

- `users`: Core authentication for customers and designers (`id`, `name`, `email`, `password`, `role`, `avatar`, `bio`).
- `designer_profiles`: Credentials, rating, years of experience, software tools, location.
- `portfolios`: Completed showcase projects with photos, blueprint previews, category, square footage, tags.
- `projects`: The core project lifecycle record with structure type, plot dimensions, style, budget expectation, timeline, plain-English description, and `technical_summary` JSON.
- `deliverables`: Schematics, 2D floor plans, 3D daylight studies, and final blueprints with versions and status.
- `revisions`: Customer pinpoint feedback entries with relative image coordinates (`pin_x`, `pin_y`) and feedback text.
- `messages`: Real-time conversation history between customer and designer.
- `reviews`: Star ratings (1-5) and testimonial comments for delivered projects.

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v18+ or v22+)
- **MySQL 8.0** *(Optional: the platform includes a zero-config persistent engine that activates automatically if MySQL credentials are not yet configured!)*

### 1. Install Dependencies
```bash
# In the project root directory
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables (Optional MySQL Setup)
In `server/.env`:
```env
PORT=5000
JWT_SECRET=build_my_vision_secret_jwt_key_2026
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=build_my_vision
DB_PORT=3306
```

### 3. Run the Development Server
From the root directory:
```bash
npm run dev
```
This runs both:
- **Backend Server & WebSockets**: `http://localhost:5000`
- **React Frontend**: `http://localhost:5173`

---

## 🧪 Demo Test Drive Accounts

The database comes pre-seeded with realistic architectural projects, portfolio works, and active collaboration rooms. You can instantly toggle between accounts using the **One-Click Role Switcher** in the top navigation bar, or log in with:

| Role | Email | Password | Persona |
|---|---|---|---|
| **Customer** | `customer@vision.com` | `password123` | **Alex Morgan** (Residential homebuilder with active revision pins) |
| **Architect** | `designer@vision.com` | `password123` | **Elena Vance, AIA** (Lead sustainable architect & passive house specialist) |

---

## 📐 Key Components Overview

- [`VisionBuilderPage.jsx`](file:///C:/Users/aishd/.gemini/antigravity/scratch/build-my-vision/client/src/pages/VisionBuilderPage.jsx): 5-step guided wizard for non-technical users.
- [`TechnicalTranslatorBadge.jsx`](file:///C:/Users/aishd/.gemini/antigravity/scratch/build-my-vision/client/src/components/TechnicalTranslatorBadge.jsx): Displays live translation of customer words into architectural parameters.
- [`DeliveryViewer.jsx`](file:///C:/Users/aishd/.gemini/antigravity/scratch/build-my-vision/client/src/components/DeliveryViewer.jsx): Interactive schematic inspection canvas with pinpoint coordinate annotations.
- [`ChatRoom.jsx`](file:///C:/Users/aishd/.gemini/antigravity/scratch/build-my-vision/client/src/components/ChatRoom.jsx): Real-time Socket.IO chat room with quick architectural prompts.
- [`CustomerDashboard.jsx`](file:///C:/Users/aishd/.gemini/antigravity/scratch/build-my-vision/client/src/pages/CustomerDashboard.jsx): Customer project command center with progress bars and action alerts.
- [`DesignerDashboard.jsx`](file:///C:/Users/aishd/.gemini/antigravity/scratch/build-my-vision/client/src/pages/DesignerDashboard.jsx): Architect studio with brief acceptance queue and deliverable uploader.
- [`ProjectDetailPage.jsx`](file:///C:/Users/aishd/.gemini/antigravity/scratch/build-my-vision/client/src/pages/ProjectDetailPage.jsx): Unified collaboration workspace combining deliverables, chat, translation matrix, and blueprint package handover.
