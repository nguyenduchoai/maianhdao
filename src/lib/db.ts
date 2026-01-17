import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Get database path
const getDbPath = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'maianhdao.db');
};

// Lazy initialization to avoid build-time issues
let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  const dbPath = getDbPath();
  _db = new Database(dbPath);
  _db.pragma('journal_mode = WAL');

  // Initialize database schema
  _db.exec(`
    -- Trees (Cây Mai Anh Đào)
    CREATE TABLE IF NOT EXISTS trees (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      zone TEXT,
      lat REAL,
      lng REAL,
      status TEXT DEFAULT 'available',
      images TEXT DEFAULT '[]',
      donor_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Donations (Đóng góp)
    CREATE TABLE IF NOT EXISTS donations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      amount REAL,
      logo_url TEXT,
      message TEXT,
      is_organization INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      payment_ref TEXT,
      tree_id TEXT,
      tier TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      approved_at TEXT,
      FOREIGN KEY (tree_id) REFERENCES trees(id)
    );

    -- Sponsors (Đơn vị đồng hành)
    CREATE TABLE IF NOT EXISTS sponsors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo_url TEXT,
      website TEXT,
      tier TEXT DEFAULT 'silver',
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Settings (Cấu hình)
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Admin Users
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'editor',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_trees_code ON trees(code);
    CREATE INDEX IF NOT EXISTS idx_trees_status ON trees(status);
    CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
    CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
  `);

  // Insert default settings if not exists
  const defaultSettings = [
    // Bank & Campaign
    ['bankName', 'Vietcombank'],
    ['accountNumber', '0123456789'],
    ['accountHolder', 'Quỹ Mai Anh Đào Đà Lạt'],
    ['targetAmount', '500000000'],
    ['campaignStart', '2026-01-05'],
    ['campaignEnd', '2026-01-15'],
    // Hero
    ['heroTitle', 'NGÀN CÂY ANH ĐÀO'],
    ['heroSubtitle', 'Quanh Hồ Xuân Hương & Khu Vực Đà Lạt'],
    ['heroTagline', 'Để Lại Dấu Ấn Tại Trái Tim Thành Phố Ngàn Hoa'],
    ['heroDescription', 'Chiến dịch gây quỹ cộng đồng để trồng hoa Anh Đào tại Hồ Xuân Hương và các khu vực trọng điểm của Đà Lạt'],
    ['heroButtonText', 'Đóng Góp Ngay'],
    ['heroButtonText2', 'Xem Bản Đồ Cây'],
    ['statTarget', '500 triệu'],
    ['statTargetLabel', 'Mục tiêu'],
    ['statTrees', '200'],
    ['statTreesLabel', 'Cây Mai Anh Đào'],
    ['statDays', '10'],
    ['statDaysLabel', 'Ngày cao điểm'],
    ['statWaitingLabel', 'Cây chờ đóng góp'],
    // About
    ['aboutTitle', 'Về Chiến Dịch'],
    ['aboutSubtitle', 'Xã hội hóa cảnh quan & Gây quỹ cộng đồng – Ngàn Cây Anh Đào quanh Hồ Xuân Hương'],
    ['aboutBoxTitle', 'Căn Cứ & Tính Cấp Thiết'],
    ['aboutContent1Title', 'Vị thế địa lý'],
    ['aboutContent1', 'Hồ Xuân Hương là "trái tim" của Đà Lạt. Cảnh quan quanh hồ quyết định trực tiếp đến ấn tượng của du khách và niềm tự hào của người dân địa phương.'],
    ['aboutContent2Title', 'Thực trạng'],
    ['aboutContent2', 'Mật độ Mai Anh Đào quanh hồ hiện nay chưa đồng bộ, một số cây già cỗi hoặc bị sâu bệnh. Việc bổ sung những cây Mai Anh Đào trưởng thành, tán đẹp là nhu cầu cấp thiết để chỉnh trang đô thị đón Tết.'],
    ['aboutContent3Title', 'Cơ hội'],
    ['aboutContent3', 'Với tâm lý hướng về nguồn cội dịp Tết, người dân và doanh nghiệp rất sẵn lòng đóng góp nếu họ được "ghi danh" tại địa điểm danh giá nhất thành phố. Đây là cơ sở để thực hiện chiến dịch xã hội hóa 100%.'],
    // Goals
    ['goalsTitle', 'Mục Tiêu Đề Án (10 Ngày Cao Điểm)'],
    ['goalFinanceTitle', 'Mục Tiêu Tài Chính'],
    ['goalFinanceAmount', '500.000.000 VNĐ'],
    ['goalFinanceNote', '(Năm trăm triệu đồng)'],
    ['goalFinanceTime', 'Thời gian: 05/01 - 15/01/2026'],
    ['goalTreeTitle', 'Mục Tiêu Hiện Vật'],
    ['goalTreeAmount', '200 Cây'],
    ['goalTreeNote', 'Mai Anh Đào'],
    ['goalTreeLabel', 'Tiêu chuẩn "Cây Di sản":'],
    ['goalTreeSpec1', 'Cao >3m'],
    ['goalTreeSpec2', 'Đường kính gốc >10cm'],
    ['goalTreeSpec3', 'Dáng đẹp, tán đều'],
    ['goalCommitTitle', 'Cam Kết Đặc Biệt'],
    ['goalCommitContent', '100% ngân sách dư được đưa vào "Quỹ Bảo Dưỡng Xanh"'],
    ['goalCommitNote', 'Thuê nhân sự chuyên nghiệp chăm sóc trong 24 tháng'],
    ['goalCommitHighlight', 'Đảm bảo cây sống và ra hoa!'],
    ['spreadTitle', 'Mục Tiêu Lan Tỏa'],
    ['spreadContent1', '100% Tổ dân phố, Trường học, Doanh nghiệp trên địa bàn Phường nhận được thông tin vận động'],
    ['spreadContent2', 'Tạo làn sóng "Check-in với cây của mình" ngay trong dịp Tết Nguyên Đán'],
    // Tiers
    ['tiersTitle', 'Chiến Lược Gây Quỹ: "Để Lại Di Sản"'],
    ['tiersSubtitle', 'Vì địa điểm là Hồ Xuân Hương, giá trị các gói đóng góp được định vị ở mức cao cấp và trang trọng'],
    ['tierLevelLabel', 'Mức'],
    ['tierBenefitsLabel', 'Quyền lợi'],
    ['tierCTAButton', 'Đóng Góp Ngay'],
    ['tier1Name', 'GIEO MẦM'],
    ['tier1Range', '50.000đ - 100.000đ'],
    ['tierGieomamDesc', 'Mọi người dân'],
    ['tier1Benefit1', 'Ghi danh trên "Bức tường Hoa Anh Đào Digital" (Website/Fanpage)'],
    ['tier1Benefit2', 'Nhận Thiệp cảm ơn điện tử (E-Card)'],
    ['tier2Name', 'GỬI TRAO'],
    ['tier2Range', '200.000đ - 500.000đ'],
    ['tierGuitraoDesc', 'Nhân viên văn phòng, Du khách yêu Đà Lạt'],
    ['tier2Benefit1', 'Bộ Postcard độc quyền "Hồ Xuân Hương Mùa Xuân"'],
    ['tier2Benefit2', 'Huy hiệu Lễ hội (Limited Edition)'],
    ['tier2Benefit3', 'Giấy chứng nhận đóng góp điện tử (E-Certificate)'],
    ['tier3Name', 'DẤU ẤN'],
    ['tier3Range', '1.000.000đ - 2.000.000đ'],
    ['tierDauunDesc', 'Hộ gia đình, Nhóm bạn bè'],
    ['tier3Benefit1', '🏷️ Treo biển gỗ khắc tên (Tagname) lên cây trồng'],
    ['tier3Benefit2', 'Thông điệp tùy chọn: "Cây của Gia đình...", "Kỷ niệm ngày cưới..."'],
    ['tier3Benefit3', '🎁 Sở hữu một "kỷ vật sống" ngay tại Hồ Xuân Hương'],
    ['tier4Name', 'KIẾN TẠO'],
    ['tier4Range', '5.000.000đ - 10.000.000đ'],
    ['tierKientaoDesc', 'Doanh nghiệp, Khách sạn, Nhà hàng'],
    ['tier4Benefit1', '🏢 Biển tên Doanh nghiệp (kích thước quy chuẩn, thẩm mỹ) gắn tại cây'],
    ['tier4Benefit2', '📺 Vinh danh Logo trang trọng trên Backdrop Lễ phát động (Ngày 15/1)'],
    ['tier4Benefit3', '📜 UBND Phường trao tặng Giấy khen/Thư cảm ơn'],
    ['tier4Benefit4', '✅ Có giá trị làm hồ sơ năng lực/thương hiệu'],
    // Event
    ['eventTitle', 'Lễ Phát Động & Ra Quân'],
    ['eventTimeLabel', 'Thời gian'],
    ['eventTime', '07:30 Sáng, Thứ Năm'],
    ['eventDate', 'Ngày 18 Tháng 01, 2026'],
    ['eventLocationLabel', 'Địa điểm'],
    ['eventLocation', 'Khu vực bãi cỏ/công viên ven Hồ Xuân Hương thuộc địa bàn Phường'],
    ['eventParticipantsLabel', 'Thành phần'],
    ['eventParticipants', 'Lãnh đạo Tỉnh, Lãnh đạo Phường, Doanh nghiệp, Đại diện nhân dân'],
    ['eventProgramLabel', 'Nội dung chương trình'],
    ['eventProgram1', 'Báo cáo nhanh kết quả 10 ngày thần tốc'],
    ['eventProgram2', 'Trao Giấy khen/Thư cảm ơn cho Doanh nghiệp "Kiến Tạo"'],
    ['eventProgram3', 'Nghi thức trồng cây: Đại diện vun đất và treo biển tên'],
    ['eventProgram4', 'Check-in quảng bá cùng cây của mình'],
    // Finance
    ['financeTitle', 'Cơ Cấu Tài Chính'],
    ['financeSubtitle', 'MINH BẠCH TUYỆT ĐỐI'],
    ['financeTotalLabel', 'Tổng thu dự kiến'],
    ['financeTotalAmount', '500.000.000 VNĐ'],
    ['financeTreePercent', '60%'],
    ['financeTreeTitle', 'Chi Phí Cây Giống'],
    ['financeTreeAmount', '300 Triệu'],
    ['financeTreeDesc', 'Mua 200 cây Mai Anh Đào trưởng thành đạt tiêu chuẩn "Cây Di sản"'],
    ['financeCarePercent', '30%'],
    ['financeCareTitle', 'Quỹ Chăm Sóc Cây'],
    ['financeCareAmount', '150 Triệu'],
    ['financeCareDesc', 'Thuê Công ty Công trình Đô thị hoặc Đội cây xanh chuyên nghiệp chăm sóc trong 24 tháng'],
    ['financeOrgPercent', '10%'],
    ['financeOrgTitle', 'Tổ Chức & Truyền Thông'],
    ['financeOrgAmount', '50 Triệu'],
    ['financeOrgDesc', 'Sản xuất biển tên, in huy hiệu, giấy khen, âm thanh, backdrop Lễ phát động'],
    // Footer
    ['siteName', 'NGÀN CÂY ANH ĐÀO'],
    ['footerAbout', 'Chiến dịch gây quỹ cộng đồng để trồng hoa Anh Đào quanh Hồ Xuân Hương và các khu vực trọng điểm của Đà Lạt - Thành phố ngàn hoa.'],
    ['footerContactTitle', 'Liên Hệ'],
    ['footerAddress', 'Chi hội DNT Phường Xuân Hương - Đà Lạt'],
    ['footerPhone', '0935.956.421 (Anh Nghĩa)'],
    ['footerEmail', 'maianhdao@lamdong.vn'],
    ['footerLinksTitle', 'Liên Kết'],
    ['footerLinkMap', 'Bản đồ cây'],
    ['footerLinkDonate', 'Đóng góp'],
    ['footerLinkSponsors', 'Nhà tài trợ'],
    ['footerLinkDonors', 'Danh sách ghi danh'],
    ['footerCampaignTime', '05/01/2026 - 15/01/2026 (10 ngày cao điểm)'],
    ['footerCampaignGoal', '500.000.000 VNĐ | Ngàn cây hoa Anh Đào cho Đà Lạt'],
    ['footerCopyright', '© 2026 Chiến dịch NGÀN CÂY ANH ĐÀO - Hội DNT tỉnh Lâm Đồng.'],
    // Navbar
    ['navLogoText', 'Ngàn Cây Anh Đào'],
    ['navLinkMap', 'Bản Đồ'],
    ['navLinkDonate', 'Đóng Góp'],
    ['navLinkSponsors', 'Ban Tổ Chức'],
    ['navLinkDonors', 'Bảng Vinh Danh'],
    ['navLinkTransparency', '📊 Minh Bạch'],
    // Sponsors Section
    ['sponsorsTitle', '🏛️ Ban Tổ Chức'],
    ['sponsorsSubtitle', 'Chiến dịch được tổ chức bởi các đơn vị uy tín tại Lâm Đồng'],
    // Donation Wall
    ['donorsTitle', '🌸 Bảng Vinh Danh'],
    ['donorsSubtitle', 'Cảm ơn tất cả các cá nhân và đơn vị đã đóng góp cho chiến dịch'],
    // Map Section
    ['mapTitle', '🗺️ Bản Đồ Cây Anh Đào'],
    ['mapSubtitle', 'Khám phá vị trí các cây Mai Anh Đào quanh Hồ Xuân Hương'],
    // Donation Form
    ['donationFormTitle', '💝 Đóng Góp'],
    ['donationFormSubtitle', 'Để lại dấu ấn của bạn tại trái tim Đà Lạt'],
  ];

  const insertSetting = _db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [key, value] of defaultSettings) {
    insertSetting.run(key, value);
  }

  // Check if admin exists, if not create default
  const adminExists = _db.prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number };
  if (adminExists.count === 0) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    _db.prepare('INSERT INTO admin_users (id, username, password) VALUES (?, ?, ?)').run(
      `admin-${Date.now()}`,
      'admin',
      hashedPassword
    );
  }

  return _db;
}

// Export the database getter
const db = new Proxy({} as Database.Database, {
  get: (_, prop) => {
    const database = getDb();
    const value = (database as unknown as Record<string, unknown>)[prop as string];
    if (typeof value === 'function') {
      return value.bind(database);
    }
    return value;
  },
});

export default db;

// Helper functions
export function getAllSettings(): Record<string, string> {
  const database = getDb();
  const rows = database.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export function getSetting(key: string): string | null {
  const database = getDb();
  const row = database.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value || null;
}

export function setSetting(key: string, value: string): void {
  const database = getDb();
  database.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)').run(key, value);
}
