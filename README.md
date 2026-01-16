# 🌸 NGÀN CÂY ANH ĐÀO - Quanh Hồ Xuân Hương & Khu Vực Đà Lạt

Chiến dịch gây quỹ cộng đồng để trồng hoa Anh Đào quanh Hồ Xuân Hương và khu vực Đà Lạt.

**Website**: https://maianhdao.lamdong.vn

## 📋 Thông Tin Chiến Dịch

- **Đơn vị thực hiện**: Chi hội DNT Phường Xuân Hương - Đà Lạt
- **Liên hệ**: Anh Nghĩa - 0935.956.421
- **Tài khoản**: MSB 991977 - Hội DNT tỉnh Lâm Đồng
- **Thời gian**: 05/01/2026 - 15/01/2026

## 🚀 Quick Start

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
npm run start
```

## 🌐 URLs

- **Landing Page**: https://maianhdao.lamdong.vn
- **Admin Panel**: https://maianhdao.lamdong.vn/admin

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
