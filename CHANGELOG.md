# Changelog

All notable changes to the NGÀN CÂY ANH ĐÀO campaign website.

## [v9.12] - 2026-01-21

### Added
- 🎯 **Tree Selection for Organizations** - Businesses can now select their preferred tree
  - New `TreePickerModal` component with map + list selection
  - `selected_tree_id` column in donations table
  - Visual indicator in admin (🎯 A1 (yêu cầu)) for pending requests
  - Auto-assignment of selected tree upon approval

### Changed
- 📝 Admin donations table shows requested tree with amber badge
- 🤖 API enriches donation response with `selected_tree_code`
- 📦 Gallery populated with 3 event photos from tree ceremony

---

## [v9.11] - 2026-01-21

### Fixed
- 🔧 **VietQR Payment QR Code** - Critical fix for QR not working
  - Changed from `react-qr-code` component to direct VietQR image
  - Was encoding URL as QR instead of displaying bank payment QR
  - Now uses official VietQR Quick Link API (`img.vietqr.io`)
  - Template: `compact2` with NAPAS + MSB branding

### Changed
- 🖼️ QR display now uses `<img src={vietqrUrl}>` instead of `<QRCode value={url}>`
- 🏦 Added `bankBin` setting to database (970426 for MSB)

---

## [v9.10] - 2026-01-21

### Added
- 🖼️ **Gallery Section on Landing Page** - Shows first 8 images with "View All" button
- 📄 **Unified SubpageHeader Component** - Consistent navigation across all subpages
- 🏅 **In-Kind Sponsorship Support** - "Nhà Tài Trợ" checkbox for goods/services donations
  - `is_sponsor` column added to donations table
  - Amount field hidden when sponsor mode enabled
  - Tier still selectable for equivalent value

### Changed
- 📱 **Mobile UX Optimization** (Phase 2 Complete)
  - DonationForm: Phone/Email stack vertically on mobile
  - DonationForm: Input padding increased for iOS compatibility
  - InteractiveMap: Responsive height (500px mobile → 800px desktop)
  - TreePopup: Responsive width (280px mobile → 420px desktop)
  - TreePopup: Smaller fonts and padding on mobile
  - All buttons: Added `active:scale-95` touch feedback
- 🧭 `/thu-vien-anh` - Now uses SubpageHeader instead of simple header
- 🧭 `/minh-bach-tai-chinh` - Now uses SubpageHeader instead of simple header

### Fixed
- 🐛 404 error on `/thu-vien-anh` page - Fixed port binding (now 3010)
- 🐛 TreePopup overflow on mobile - Fixed with responsive widths

---

## [v9.9] - 2026-01-18

### Added
- 🖼️ Gallery Management System
  - `/admin/gallery` - Admin page for managing images
  - `/api/gallery` - API endpoints (GET, POST, DELETE)
  - `/thu-vien-anh` - Public gallery page
- 📊 Finance Transparency Page optimization for mobile

### Changed
- 📱 Table-to-card pattern for mobile on finance page
- 🔗 Footer links updated with Gallery and Transparency pages
- 🧭 Navbar updated with Thư Viện link

---

## [v9.2-M2M] - 2026-01-17

### Added
- 🔗 Many-to-Many relationship between donations and trees
- 👥 Multi-donor support on tree profiles
- 📍 Enhanced TreePopup with donor list
- 🏷️ Primary donor badge

### Changed
- Admin tree page with donor assignment modal
- Public map popup with multi-donor display

---

## [v8.0] - 2026-01-16

### Added
- 🏆 Dynamic Donation Tiers (KIẾN TẠO, DẤU ẤN, GỬI TRAO, GIEO MẦM)
- 💰 Finance/Expense tracking module
- 📊 Admin Dashboard with statistics
- 🔒 Admin authentication system

### Changed
- Complete dynamic settings system
- Hero section fully configurable via admin

---

## [v1.0] - 2026-01-05

### Added
- 🗺️ Interactive Map with react-leaflet
- 💝 Donation Form with VietQR
- 🌸 Hero Section with campaign stats
- 📱 Responsive design (mobile-first)
- 🏢 Sponsors Section
- 📝 Donation Wall

---

*For detailed session reports, see `/root/.gemini/antigravity/knowledge/dao_mai_anh_dao/artifacts/reports/`*
