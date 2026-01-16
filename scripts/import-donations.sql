-- Import donations data
-- Run: sqlite3 data/maianhdao.db < scripts/import-donations.sql

-- Clear existing
DELETE FROM donations;

-- KIẾN TẠO (>= 5,000,000)
INSERT INTO donations (id, name, amount, tier, status, is_organization, created_at) VALUES 
('d-1', 'Công ty Xổ số Kiến thiết Lâm Đồng', 10000000, 'kientao', 'approved', 1, datetime('now')),
('d-2', 'Phạm Quý Hùng (GBi Ecoz)', 5000000, 'kientao', 'approved', 0, datetime('now')),
('d-3', 'Lê Tấn Hoàng (Tấn Hoàng)', 5000000, 'kientao', 'approved', 0, datetime('now')),
('d-4', 'Nguyễn Duy Linh (Bánh cuốn Ông Sĩ)', 5000000, 'kientao', 'approved', 0, datetime('now')),
('d-5', 'Khách sạn Cherry', 5000000, 'kientao', 'approved', 1, datetime('now')),
('d-6', 'Công ty TNHH Hải Phúc Hân', 5000000, 'kientao', 'approved', 1, datetime('now')),
('d-7', 'Quang Nhật', 5000000, 'kientao', 'approved', 0, datetime('now')),
('d-8', 'The An House', 5000000, 'kientao', 'approved', 1, datetime('now')),
('d-9', 'Công ty CP Đầu tư & TV GD Thiên Tôn', 5000000, 'kientao', 'approved', 1, datetime('now')),
('d-10', 'Cty Xe Tự Lái Ninh Dân', 5000000, 'kientao', 'approved', 1, datetime('now')),
('d-11', 'Atispho (Trần Thị Hoài Kha)', 5000000, 'kientao', 'approved', 0, datetime('now'));

-- DẤU ẤN (1,000,000 - 4,999,999)
INSERT INTO donations (id, name, amount, tier, status, is_organization, created_at) VALUES 
('d-20', 'Nguyễn Văn Lãm', 3000000, 'dauun', 'approved', 0, datetime('now')),
('d-21', 'Trần Thanh Xuân', 3000000, 'dauun', 'approved', 0, datetime('now')),
('d-22', 'Nguyễn Thị Thanh Hiền', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-23', 'Phạm Thị Bích Ngọc', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-24', 'Nguyễn Thị Thu Trang', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-25', 'Phạm Hà Thụy Anh', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-26', 'Nguyễn Tiến Thoại', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-27', 'Hậu Kim Cương', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-28', 'Dương Thanh Nga', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-29', '(Người gửi ẩn danh)', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-30', 'Nguyễn Xuân Hải', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-31', 'Gđ An Cúc Giang Diệp', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-32', 'Dương Văn Hiếu', 2000000, 'dauun', 'approved', 0, datetime('now')),
('d-33', 'Lê Diễn Trung Hậu', 1500000, 'dauun', 'approved', 0, datetime('now')),
('d-34', 'Hoàng Kim Sơn Châu', 1000000, 'dauun', 'approved', 0, datetime('now')),
('d-35', 'Vũ Thị Diễm Quỳnh', 1000000, 'dauun', 'approved', 0, datetime('now')),
('d-36', 'Vũ Quang Đoàn', 1000000, 'dauun', 'approved', 0, datetime('now')),
('d-37', 'Nguyễn Văn Hiếu', 1000000, 'dauun', 'approved', 0, datetime('now')),
('d-38', 'Nguyễn Đỗ Lâm Đồng', 1000000, 'dauun', 'approved', 0, datetime('now')),
('d-39', 'Nhà báo Diễm Thương', 1000000, 'dauun', 'approved', 0, datetime('now')),
('d-40', 'Lê Thị Kiều Nga (Enny Dalat)', 1000000, 'dauun', 'approved', 0, datetime('now')),
('d-41', 'Trần Thị Kim Linh', 1000000, 'dauun', 'approved', 0, datetime('now')),
('d-42', 'Cao Gia Chi Bảo Villa', 1000000, 'dauun', 'approved', 1, datetime('now')),
('d-43', 'Nước mắm Hồng Huy', 1000000, 'dauun', 'approved', 1, datetime('now')),
('d-44', 'Đỗ Thị Như Mai', 1000000, 'dauun', 'approved', 0, datetime('now')),
('d-45', 'Phạm Thị Việt Nhân', 1000000, 'dauun', 'approved', 0, datetime('now'));

-- GỬI TRAO (200,000 - 999,999)
INSERT INTO donations (id, name, amount, tier, status, is_organization, created_at) VALUES 
('d-50', 'Mai Thị Hải', 500000, 'guitrao', 'approved', 0, datetime('now')),
('d-51', 'Mai Thị Hải', 500000, 'guitrao', 'approved', 0, datetime('now')),
('d-52', 'Nguyễn Quốc Khánh', 500000, 'guitrao', 'approved', 0, datetime('now')),
('d-53', 'Kiên Trọng', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-54', 'Trần Minh Hiếu', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-55', 'Lê Thị Thanh Huyền', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-56', 'Huỳnh Thị Đông', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-57', 'Trần Thị Kim Huệ', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-58', 'Yến Sào Fathi', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-59', 'Nguyễn Thị Xuyên', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-60', 'Võ Thị Thanh Thủy', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-61', 'Võ Thị Bích Trâm', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-62', 'Đặng Nguyễn Minh Khánh', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-63', 'Vũ Quang Đoàn', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-64', 'Đặng Vũ Dũng', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-65', 'Phạm Việt Phương', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-66', 'Trần Quỳnh Trâm Trinh', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-67', 'Uyen (Trần Thị Phiên)', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-68', 'Chế Thị Tuyết Mai', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-69', 'Nguyễn Phương Mỹ Ngọc', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-70', 'Mai Thị Phương', 200000, 'guitrao', 'approved', 0, datetime('now')),
('d-71', 'Trần Thị Nguyệt', 200000, 'guitrao', 'approved', 0, datetime('now'));

-- GIEO MẦM (< 200,000)
INSERT INTO donations (id, name, amount, tier, status, is_organization, created_at) VALUES 
('d-80', 'Nguyễn Thị Ngọc Phú', 100000, 'gieomam', 'approved', 0, datetime('now')),
('d-81', 'Lê Thị Ngọc', 100000, 'gieomam', 'approved', 0, datetime('now')),
('d-82', 'Võ Thị Thu Ba', 100000, 'gieomam', 'approved', 0, datetime('now')),
('d-83', 'Lê Thị Thu Hậu', 100000, 'gieomam', 'approved', 0, datetime('now')),
('d-84', 'Lê Thị Thu Hậu', 100000, 'gieomam', 'approved', 0, datetime('now')),
('d-85', 'Lương Thị Đỗ Quyên & Phạm Lê Anh Duy', 100000, 'gieomam', 'approved', 0, datetime('now')),
('d-86', 'Vũ Thị Kim Anh', 100000, 'gieomam', 'approved', 0, datetime('now'));
