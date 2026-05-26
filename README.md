# 🚀 CoSaaS: Enterprise-Grade Coworking Space Management Platform

CoSaaS is a modern, high-fidelity Software-as-a-Service (SaaS) web application designed for enterprise coworking operators. It combines stunning **neon glassmorphism aesthetics** with a responsive **interactive SVG blueprint seating map**, live branch analytics, support ticket CRM tracking, and robust backend authentication.

---

## 🌟 Key Features Implemented

### 🎨 1. SVG Seating Blueprint Architecture
* **Accurate Architectural Proportions**: Replaced legacy grid-based layouts with a highly realistic, responsive SVG floor map (`viewBox="0 0 1000 600"`) featuring executive glass cabins, phone booths, circular lounge seats, corridors, and entrance lobbies.
* **100% Fluid Responsiveness**: Designed using responsive container bindings (`w-full h-auto`) to scale naturally across all laptops, viewports, and mobile viewports with **absolutely zero horizontal scrollbars**.
* **Ergonomic Neon Seating States**: Every seat (A1–E8) is visually animated with live status-dependent glowing rings:
  * 🟢 **Emerald (Available)**: Glows soft emerald indicating open hot desks ready to book.
  * 🔴 **Rose (Occupied)**: Indicates active corporate allocations.
  * 🟡 **Amber (Reserved)**: Displays pre-assigned slots.
* **Tactile Spring Animations**: Animated cursor hovering and active selection rings using `framer-motion` for an incredibly premium user experience.

### 📊 2. Live Branch Analytics & Metrics Dashboard
* **Dynamic Seeding & Real-Time Stats**: Features customized seeding loops (`seatSeeder.js`) with active offsets per branch. Switching locations dynamically renders distinct operational statistics.
* **Premium KPI Cards**: Clean dashboard metrics tracking revenue, occupancy rates, open tickets, active bookings, and visitor check-ins.
* **Unified Branch Selector**: Supports instant location switching across 6 prime centers:
  * Bengaluru Indiranagar
  * Mumbai BKC
  * Gurugram Cyber City
  * Hyderabad HITEC
  * Bangalore Koramangala
  * Chennai OMR

### 🔑 3. Authentication & Role-Based Access Control (RBAC)
* **JWT Secure Middleware**: Fully secure, stateless JWT token issuances, authorization header injections (`Bearer <token>`), and encrypted password matching using `bcryptjs`.
* **Session Hydration**: Auto-hydrates active login credentials on app startup via local storage scanning.
* **RBAC Protected Routes**: Custom routing safeguards access depending on exact corporate roles (Admin, Branch Manager, Receptionist).

### 💬 4. Conference Rooms & Support CRM
* **Conference Suite Bookings**: Fully interactive boardroom scheduling calendar.
* **Support Ticket Desk**: Interactive ticketing suite showing real-time priority markers (Low, Medium, High, Critical), assignee updates, and ticket resolution logs.

---

## 🛠️ Tech Stack Used

### Frontend (Client)
* **React 18** (Vite-powered environment for lightning-fast bundling)
* **TailwindCSS** (Custom utilities & dark mode styling)
* **Framer Motion** (Spring physics & glass micro-animations)
* **Lucide React** (Clean, minimalist iconography)

### Backend (Server)
* **Node.js** & **Express** (RESTful MVC API backend router)
* **Mongoose ORM** & **MongoDB** (Object data modeling & persistent storage)
* **JSON Web Token** (Stateless access credentials)
* **BcryptJS** (Corporate credential salting & hashing)

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (local database running or active MongoDB Atlas instance URI)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <your-repo-link>
cd cosaas

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

#### Backend Configuration (`server/.env`)
Create a file named `.env` in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/your_local_db_name
JWT_SECRET=your_jwt_secret_key_here
```

#### Frontend Configuration (`client/.env`)
Create a file named `.env` in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Seed Database Records
We have provided comprehensive seeder scripts to prepare highly realistic workspace data:
```bash
cd server
node seed/userSeeder.js    # Seeds mock Admin and Manager profiles
node seed/seatSeeder.js    # Seeds distinct seat layouts per branch
node seed/roomSeeder.js    # Seeds ready-to-use conference suites
node seed/ticketSeeder.js  # Seeds dummy customer service logs
```

##### Launch Backend Server
```bash
cd server
npm start
```
*Backend runs on: `http://localhost:5000`*

##### Launch Frontend Client
```bash
cd client
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🌎 Cloud Deployment Specifications
CoSaaS is fully optimized for continuous delivery (CI/CD) and production hosting:
* **Backend API Base**: The client codebase imports `API_BASE` centrally from `src/config.js` utilizing `import.meta.env.VITE_API_URL`, supporting zero-localhost overrides on **Render** (backend) and **Vercel** (frontend).
