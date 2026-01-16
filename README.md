# Đảo Mai Anh Đào - Landing Page & Admin

🌸 Hệ thống gây quỹ cộng đồng cho chiến dịch trồng Mai Anh Đào tại Hồ Xuân Hương, Đà Lạt.

## 🚀 Quick Start

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Seed sample data (chạy 1 lần)
curl -X POST http://localhost:3000/api/admin/seed

# Build production
npm run build
npm run start
```

## 🌐 URLs

- **Landing Page**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── admin/page.tsx        # Admin panel
│   ├── api/                   # API routes
│   │   ├── trees/            # Trees CRUD
│   │   ├── donations/        # Donations CRUD
│   │   ├── sponsors/         # Sponsors CRUD
│   │   ├── stats/            # Campaign statistics
│   │   └── admin/            # Admin APIs
│   └── globals.css           # Global styles
├── components/
│   ├── landing/              # Landing page components
│   │   ├── HeroSection.tsx
│   │   ├── SponsorsSection.tsx
│   │   ├── DonationForm.tsx
│   │   └── DonationWall.tsx
│   ├── map/
│   │   └── InteractiveMap.tsx # Leaflet map
│   └── admin/                # Admin components
├── lib/
│   ├── db.ts                 # SQLite database
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript types
└── data/
    └── seed.ts               # Sample data
```

## ✨ Features

### Landing Page
- 🎨 Beautiful hero section with cherry blossom animations
- 🗺️ Interactive map (React-Leaflet) showing all trees
- 💳 QR Code payment integration (VietQR)
- 📊 Real-time campaign statistics
- 🏆 Sponsor showcase by tier
- 📝 Donation wall with tier displays

### Admin Panel
- 📊 Dashboard with stats overview
- 🌸 Tree management (CRUD)
- 💰 Donation management
- 🏢 Sponsor management
- ⚙️ System settings

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Map**: React-Leaflet
- **QR Code**: react-qr-code + VietQR

## 📊 Database

SQLite database is automatically created at `data/maianhdao.db`

Tables:
- `trees` - Cherry blossom trees
- `donations` - Donor contributions
- `sponsors` - Company sponsors
- `settings` - System configuration
- `admin_users` - Admin accounts

## 🔐 Default Admin

- Username: `admin`
- Password: `admin123`

## 📝 API Endpoints

### Public
- `GET /api/trees` - Get all trees
- `GET /api/sponsors` - Get sponsors
- `GET /api/donations` - Get approved donations
- `GET /api/stats` - Get campaign statistics
- `POST /api/donations` - Submit new donation

### Admin
- `POST /api/admin/seed` - Seed sample data

---

**Developed by [Bizino](https://bizino.vn)** 🌸
