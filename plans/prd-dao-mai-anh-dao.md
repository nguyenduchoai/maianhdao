# 🌸 PRD: Đảo Mai Anh Đào - Hệ Thống Gây Quỹ & Bản Đồ Tương Tác

> **Version**: 1.0.0  
> **Created**: 2026-01-16  
> **Domain**: maianhdao.lamdong.vn  
> **Status**: Planning

---

## 📋 Executive Summary

### Tổng Quan Dự Án
Xây dựng **Landing Page + Admin Backend** cho chiến dịch gây quỹ cộng đồng "Đảo Mai Anh Đào" tại Hồ Xuân Hương, Đà Lạt. Hệ thống cho phép cá nhân/đơn vị đóng góp qua **QR Payment** và được ghi danh trên **bản đồ tương tác** với từng cây Mai Anh Đào.

### Mục Tiêu Chiến Dịch
- **Tổng ngân sách**: 500.000.000 VND (500 triệu đồng)
- **Thời gian**: 05/01/2026 - 15/01/2026
- **Mục tiêu**: Trồng/chăm sóc **200 cây Mai Anh Đào trưởng thành**
- **Tiêu chuẩn**: Cao >3m, đường kính gốc >10cm

### Reference Design
- **Bản đồ tương tác**: Lấy ý tưởng từ [dalatmap.com/festivalhoamaianhdao](https://dalatmap.com/festivalhoamaianhdao)
- **UI Sponsor**: Layout logos đơn vị đồng hành + danh sách cá nhân

---

## 🎯 Core Features

### 1. 🖼️ Landing Page (Public)

#### 1.1 Hero Section
- Banner full-width với ảnh Mai Anh Đào nở rộ
- Title: "Để Lại Dấu Ấn Tại Trái Tim Đà Lạt"
- Subtitle: Chủ đề chiến dịch
- **CTA Button**: "Đóng Góp Ngay" → Scroll to QR section
- **Progress Bar**: Hiển thị % đã đạt được (ví dụ: 150M/500M = 30%)

#### 1.2 Thông Tin Chiến Dịch
- Giới thiệu đề án
- 3 cards: Tài chính, Hiện vật, Lan tỏa
- Cam kết: 100% ngân sách dư vào "Quỹ Bảo Dưỡng Xanh"

#### 1.3 🗺️ Bản Đồ Tương Tác (Core Feature)
**Tham khảo dalatmap.com:**
- Map view toàn bộ đảo với markers từng cây (A1, A2, B1, B2...)
- **Click vào cây** → Popup hiển thị:
  - 🌸 Mã cây (A1, B5...)
  - 🖼️ Logo người/đơn vị đóng góp
  - 📝 Tên người/đơn vị
  - 💰 Số tiền đóng góp (optional: ẩn/hiện)
  - 📅 Ngày đóng góp
  - 📷 Hình ảnh cây (gallery)
  - 🔗 Nút "Chỉ đường" (link Google Maps)
- **Filter**: Lọc theo khu vực (A, B, C...)
- **Search**: Tìm theo tên người đóng góp
- Cây chưa có người đóng góp → Icon khác màu + "Đang chờ đóng góp"

#### 1.4 💳 QR Payment Section
- **VietQR** generated từ thông tin ngân hàng
- Form nhập:
  - Tên cá nhân/đơn vị
  - Số điện thoại
  - Email
  - Số tiền đóng góp
  - Upload Logo (optional)
- Sau khi thanh toán → Confirmation + Ghi danh vào danh sách chờ duyệt

#### 1.5 📊 Danh Sách Nhà Tài Trợ
**Layout giống hình tham khảo:**
- **Đơn vị đồng hành** (sponsors lớn): Grid logos với tên
- **Cá nhân đóng góp**: Danh sách text hoặc card nhỏ
- Phân cấp theo mức đóng góp:
  - 🥇 Kim Cương: >50 triệu
  - 🥈 Vàng: 20-50 triệu  
  - 🥉 Bạc: 5-20 triệu
  - 💚 Xanh: <5 triệu

#### 1.6 Footer
- Thông tin liên hệ
- Đơn vị tổ chức: Đảng ủy - UBND Phường Xuân Hương
- Social links
- Copyright

---

### 2. 🔐 Admin Backend

#### 2.1 Dashboard
- **Stats Overview**:
  - Tổng số tiền đã nhận
  - Số người đóng góp
  - Số cây đã ghi danh
  - % hoàn thành mục tiêu
- Biểu đồ đóng góp theo ngày

#### 2.2 Quản Lý Cây (Trees)
- CRUD cây: Mã, vị trí (lat/lng), khu vực, hình ảnh
- Trạng thái: Available / Sponsored
- Assign cây cho người đóng góp

#### 2.3 Quản Lý Đóng Góp (Donations)
- Danh sách đóng góp với filter/search
- Duyệt/Từ chối đóng góp
- Link donation → Tree
- Upload logo, sửa thông tin

#### 2.4 Quản Lý Nhà Tài Trợ (Sponsors)
- Thêm/sửa đơn vị đồng hành
- Upload logo, website
- Sắp xếp thứ tự hiển thị
- Tier (Kim cương, Vàng, Bạc...)

#### 2.5 Cấu Hình Hệ Thống
- Thông tin ngân hàng (cho QR)
- Mục tiêu tài chính
- Thời gian chiến dịch
- Text nội dung trang

#### 2.6 Reports
- Export danh sách đóng góp (Excel/PDF)
- Báo cáo tài chính

---

## 🏗️ Technical Architecture

### Tech Stack

#### Frontend (Landing Page)
```
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS + shadcn/ui
- Map: React-Leaflet hoặc Mapbox GL
- Animation: Framer Motion
- QR: react-qr-code + VietQR API
```

#### Admin Panel
```
- Framework: Next.js 15 (App Router) - cùng codebase
- UI: shadcn/ui components
- Auth: NextAuth.js + credentials
```

#### Backend/API
```
- API: Next.js API Routes
- Database: PostgreSQL (Supabase) hoặc MongoDB
- File Storage: Cloudflare R2 hoặc Supabase Storage
- Payment: SePay Webhook integration
```

### Database Schema

```sql
-- Trees (Cây Mai Anh Đào)
CREATE TABLE trees (
  id UUID PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL, -- A1, B5, etc.
  zone VARCHAR(5), -- A, B, C...
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  status ENUM('available', 'sponsored', 'pending'),
  images JSONB, -- Array of image URLs
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Donations (Đóng góp)
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  amount DECIMAL(15, 2),
  logo_url VARCHAR(500),
  message TEXT,
  is_organization BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'approved', 'rejected'),
  payment_ref VARCHAR(100), -- Reference from SePay
  tree_id UUID REFERENCES trees(id),
  tier ENUM('diamond', 'gold', 'silver', 'green'),
  display_order INT,
  created_at TIMESTAMP,
  approved_at TIMESTAMP
);

-- Sponsors (Đơn vị đồng hành - top tier)
CREATE TABLE sponsors (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  website VARCHAR(300),
  tier ENUM('organizer', 'diamond', 'gold', 'silver'),
  display_order INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP
);

-- Settings (Cấu hình)
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP
);
```

### API Endpoints

```
# Public APIs
GET  /api/trees           - List all trees with donor info
GET  /api/trees/:code     - Get single tree detail
GET  /api/sponsors        - List sponsors by tier
GET  /api/donations/wall  - Donation wall (approved only)
GET  /api/stats           - Campaign stats (total raised, etc.)
POST /api/donations       - Submit new donation
POST /api/webhook/sepay   - SePay payment webhook

# Admin APIs (Protected)
GET    /api/admin/trees
POST   /api/admin/trees
PUT    /api/admin/trees/:id
DELETE /api/admin/trees/:id

GET    /api/admin/donations
PUT    /api/admin/donations/:id/approve
PUT    /api/admin/donations/:id/reject
PUT    /api/admin/donations/:id/assign-tree

GET    /api/admin/sponsors
POST   /api/admin/sponsors
PUT    /api/admin/sponsors/:id
DELETE /api/admin/sponsors/:id

GET    /api/admin/settings
PUT    /api/admin/settings

GET    /api/admin/export/donations
```

---

## 🎨 UI/UX Design Guidelines

### Color Palette
```css
--color-primary: #EC4899;     /* Pink - Mai Anh Đào */
--color-secondary: #F472B6;   /* Light Pink */
--color-accent: #22C55E;      /* Green - Nature */
--color-gold: #F59E0B;        /* Gold tier */
--color-silver: #9CA3AF;      /* Silver tier */
--color-diamond: #3B82F6;     /* Diamond tier */
--color-bg: #FFF1F2;          /* Soft pink background */
--color-text: #1F2937;        /* Dark text */
```

### Typography
```css
--font-heading: 'Playfair Display', serif;
--font-body: 'Inter', sans-serif;
--font-accent: 'Dancing Script', cursive; /* For decorative text */
```

### Key Design Elements
- 🌸 Cherry blossom petals animations (floating)
- Soft pink gradients
- Glassmorphism cards
- Rounded, organic shapes
- High-quality photos of Mai Anh Đào

---

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Mobile (<640px) | Single column, stacked sections, full-width map |
| Tablet (640-1024px) | 2-column grids, side panel for map popup |
| Desktop (>1024px) | Multi-column, large map, sponsor grid |

---

## 🔒 Security Considerations

1. **Admin Auth**: JWT + bcrypt password hashing
2. **Payment Webhook**: Verify SePay signature
3. **File Upload**: Validate image types, size limits
4. **Rate Limiting**: Donation form submissions
5. **Input Validation**: All form fields

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| Page Load Time | < 2s |
| Fundraising Goal | 500M VND |
| Trees Sponsored | 200 trees |
| Mobile Usability | Score > 90 |
| SEO Score | > 90 |

---

## 🚀 Deployment Plan

1. **Phase 1** (Day 1-2): Setup project, database, basic UI
2. **Phase 2** (Day 3-4): Map integration, donation form, QR
3. **Phase 3** (Day 5-6): Admin panel, CRUD operations
4. **Phase 4** (Day 7): Testing, polish, deploy

### Infrastructure
- **Hosting**: Vercel (Next.js) hoặc Cloudflare Pages
- **Domain**: maianhdao.lamdong.vn
- **SSL**: Auto via hosting provider
- **Database**: Supabase (free tier đủ dùng)
- **Storage**: Supabase Storage hoặc Cloudflare R2

---

## 📝 Notes

### Data Import từ Google Maps
- Hiện có **130+ trees** đã đánh dấu trên Google My Maps
- Cần script để import lat/lng và code (A1, A2, B1...)
- Link: https://www.google.com/maps/d/u/0/edit?mid=110lqJ5ZwRMem_RMBwGUtCXVWMIRnVss

### Tích Hợp SePay
- Cần cấu hình webhook URL
- Xác nhận thanh toán tự động
- Gửi email xác nhận sau khi thanh toán

---

**Document Owner**: Bizino AI DEV  
**Last Updated**: 2026-01-16
