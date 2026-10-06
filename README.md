# 🌴 Aura Palms Luxury Resort & Spa — Management System & Web Portal

[![React 18](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An enterprise-grade, luxury Resort Management System (RMS) paired with a high-converting guest-facing landing website. Built with React 18, Vite, TypeScript, and Tailwind CSS, featuring an executive Dark + Warm Orange theme (`#0B0B0F` & `#FF6B00`), Indian GST tax invoice billing, multi-role access control (RBAC), and mobile-first responsive architecture.

---

## ✨ Key Features

### 🏨 Guest-Facing Luxury Landing Website
- **Hero Section**: High-impact luxury hospitality branding, dynamic booking bar, live room rates in Indian Rupees (`₹`).
- **Accommodations Showcase**: Deluxe Cottages, Luxury Suites, and Private Pool Villas.
- **Resort Amenities & Experiences**: Infinity pools, Ayurvedic coastal spa, beachfront dining, private yacht charters.
- **Guest Testimonials & Reviews**: Verified guest feedback and ratings.
- **Newsletter Subscription**: Responsive subscription form with instant feedback.
- **Dedicated Authentication**: Custom luxury themed Guest & Staff Login / Sign-Up portals.

### 🏢 Enterprise Resort Management Dashboard
- **Role-Based Access Control (RBAC)**: Pre-configured portals for:
  - 👑 **Super Admin**: Executive command center, resort-wide revenue analytics, P&L exports.
  - 🏨 **Resort Manager**: Operational KPIs, occupancy oversight, villa rate management.
  - 🛎️ **Front Desk Receptionist**: Check-In terminal, guest arrival queue, key assignments.
  - 🧹 **Housekeeping**: Live room cleaning status, inspection workflows, maintenance requests.
  - 🍽️ **Restaurant / F&B**: Kitchen Display System (KDS), KOT order ticketing, table floorplans.
  - 💰 **Accountant**: GST tax invoices (12% & 18% HSN 996311), UPI/card payment reconciliations, refunds.
  - 👤 **Guest Portal**: Personal reservation itinerary, billing receipts, and resort service orders.

### 📊 Pure HTML & State-Driven Data Tables
- **Zero Heavy External Table Libraries**: 100% lightweight plain HTML `<table>` + `useState`.
- **Desktop LG-Grade Multi-Column Tables on Mobile**: Fully scrollable with horizontal touch momentum (`overflow-x-auto`), `min-w-[840px]`, and `whitespace-nowrap` to prevent any data shrinking or awkward wrapping.
- **Column Visibility Toggles**: Customize visible columns on the fly without UI clipping.
- **Instant Search & Sort**: Real-time filtering, multi-field search, and pagination.

---

## 🎨 Theme & Design System

- **Background**: Deep Luxury Dark (`#0B0B0F`)
- **Card Background**: `#14141A`
- **Elevated Surfaces**: `#1C1C24`
- **Borders & Dividers**: Subtle Charcoal (`#2A2A35`)
- **Brand Primary Accent**: Vibrant Orange (`#FF6B00`, Hover: `#FF8A33`)
- **Typography**: Inter / Clean Modern Sans-Serif
- **Currency Format**: Indian Rupee (`₹`, `en-IN`, no decimal clutter)
- **GST Compliance**: 12% (< ₹7,500/night) & 18% (≥ ₹7,500/night) room accommodation rates.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/indra720/Resort.git

# Navigate to project directory
cd Resort

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The application will be available at `http://localhost:3000/`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI component library (Buttons, Modals, DataTable, etc.)
│   ├── layout/          # Navbar, Sidebar, Page Shells
│   └── ui/              # Buttons, Cards, Inputs, Selects, Status Badges
├── data/                # Mock datasets for rooms, staff, bookings, and menus
├── lib/                 # Utility functions, formatINR, GST calculation, permissions
├── pages/
│   ├── auth/            # LoginPage, SignUpPage
│   ├── billing/         # BillingPage, InvoiceDetailModal
│   ├── bookings/        # BookingsPage, NewBookingModal
│   ├── dashboards/      # 6 Specialized Role-based Dashboards
│   ├── guests/          # GuestListPage, KYC Verification
│   ├── inventory/       # Stock tracking, Purchase Requisitions
│   ├── landing/         # Public Luxury Resort Landing Website
│   ├── restaurant/      # Kitchen Display System (KDS), Menu, Floorplan
│   ├── rooms/           # Room Catalog, Availability Timeline Grid
│   ├── settings/        # Resort Configuration, RBAC Matrix
│   └── staff/           # Employee Directory, Shift Rosters
├── store/               # Zustand stores (useAuthStore, useToastStore, useThemeStore)
└── types/               # TypeScript interfaces & domain types
```

---

## 📄 License

This project is licensed under the MIT License.
