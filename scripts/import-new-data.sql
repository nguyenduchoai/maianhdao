-- ===========================================
-- IMPORT DATA MỚI CHO NGÀN CÂY ANH ĐÀO
-- Ngày: 2026-01-16
-- ===========================================

-- Xóa dữ liệu cũ
DELETE FROM donations;
DELETE FROM trees;

-- Tạo vị trí cây (chỉ vị trí có người đóng góp)
-- Khu A: A1-A17
-- Khu B: B1-B16

-- Insert trees với vị trí
INSERT INTO trees (id, code, zone, lat, lng, status, images) VALUES
-- Khu A
('tree-a1', 'A1', 'A', 11.948657, 108.449988, 'sponsored', '[]'),
('tree-a2', 'A2', 'A', 11.948700, 108.450050, 'sponsored', '[]'),
('tree-a3', 'A3', 'A', 11.948743, 108.450112, 'sponsored', '[]'),
('tree-a4', 'A4', 'A', 11.948786, 108.450174, 'sponsored', '[]'),
('tree-a5', 'A5', 'A', 11.948829, 108.450236, 'sponsored', '[]'),
('tree-a6', 'A6', 'A', 11.948872, 108.450298, 'sponsored', '[]'),
('tree-a7', 'A7', 'A', 11.948915, 108.450360, 'sponsored', '[]'),
('tree-a8', 'A8', 'A', 11.948958, 108.450422, 'sponsored', '[]'),
('tree-a9', 'A9', 'A', 11.949001, 108.450484, 'sponsored', '[]'),
('tree-a10', 'A10', 'A', 11.949044, 108.450546, 'sponsored', '[]'),
('tree-a11', 'A11', 'A', 11.949087, 108.450608, 'sponsored', '[]'),
('tree-a12', 'A12', 'A', 11.949130, 108.450670, 'sponsored', '[]'),
('tree-a13', 'A13', 'A', 11.949173, 108.450732, 'sponsored', '[]'),
('tree-a14', 'A14', 'A', 11.949216, 108.450794, 'sponsored', '[]'),
('tree-a15', 'A15', 'A', 11.949259, 108.450856, 'sponsored', '[]'),
('tree-a16', 'A16', 'A', 11.949302, 108.450918, 'sponsored', '[]'),
('tree-a17', 'A17', 'A', 11.949345, 108.450980, 'sponsored', '[]'),
-- Khu B
('tree-b1', 'B1', 'B', 11.948507, 108.449888, 'sponsored', '[]'),
('tree-b2', 'B2', 'B', 11.948550, 108.449950, 'sponsored', '[]'),
('tree-b3', 'B3', 'B', 11.948593, 108.450012, 'sponsored', '[]'),
('tree-b4', 'B4', 'B', 11.948636, 108.450074, 'sponsored', '[]'),
('tree-b5', 'B5', 'B', 11.948679, 108.450136, 'sponsored', '[]'),
('tree-b6', 'B6', 'B', 11.948722, 108.450198, 'sponsored', '[]'),
('tree-b7', 'B7', 'B', 11.948765, 108.450260, 'sponsored', '[]'),
('tree-b8', 'B8', 'B', 11.948808, 108.450322, 'sponsored', '[]'),
('tree-b9', 'B9', 'B', 11.948851, 108.450384, 'sponsored', '[]'),
('tree-b10', 'B10', 'B', 11.948894, 108.450446, 'sponsored', '[]'),
('tree-b11', 'B11', 'B', 11.948937, 108.450508, 'sponsored', '[]'),
('tree-b12', 'B12', 'B', 11.948980, 108.450570, 'sponsored', '[]'),
('tree-b13', 'B13', 'B', 11.949023, 108.450632, 'sponsored', '[]'),
('tree-b14', 'B14', 'B', 11.949066, 108.450694, 'sponsored', '[]'),
('tree-b15', 'B15', 'B', 11.949109, 108.450756, 'sponsored', '[]'),
('tree-b16', 'B16', 'B', 11.949152, 108.450818, 'sponsored', '[]');

-- Insert donations với thông tin đầy đủ
-- Tier: kientao (5tr+), dauun (2-5tr), guitrao (500k-2tr), gieomam (<500k)
-- Mỗi cây có thể có nhiều người đóng góp

-- ===== TIER: KIẾN TẠO (Nhà tài trợ lớn) =====

-- A1: Cao Nguyên Hoa Đà Lạt
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a1-1', 'Cao Nguyên Hoa Đà Lạt', 'Cao Nguyên Hoa Đà Lạt', 10000000, 'kientao', 'approved', 'tree-a1', 1, datetime('now'));

-- B1: Cao Nguyên Hoa Đà Lạt
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b1-1', 'Cao Nguyên Hoa Đà Lạt', 'Cao Nguyên Hoa Đà Lạt', 10000000, 'kientao', 'approved', 'tree-b1', 1, datetime('now'));

-- A2: Công ty Xổ số Kiến thiết Lâm Đồng
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a2-1', 'Công ty Xổ số Kiến thiết Lâm Đồng', 'Công ty Xổ số Kiến thiết Lâm Đồng', 10000000, 'kientao', 'approved', 'tree-a2', 1, datetime('now'));

-- B2: Công ty Xổ số Kiến thiết Lâm Đồng
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b2-1', 'Công ty Xổ số Kiến thiết Lâm Đồng', 'Công ty Xổ số Kiến thiết Lâm Đồng', 10000000, 'kientao', 'approved', 'tree-b2', 1, datetime('now'));

-- A3: Công ty CP Dược Phẩm OPC
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a3-1', 'Công ty CP Dược Phẩm OPC', 'Công ty CP Dược Phẩm OPC', 10000000, 'kientao', 'approved', 'tree-a3', 1, datetime('now'));

-- B3: Công ty CP Dược Phẩm OPC
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b3-1', 'Công ty CP Dược Phẩm OPC', 'Công ty CP Dược Phẩm OPC', 10000000, 'kientao', 'approved', 'tree-b3', 1, datetime('now'));

-- A4: Vietravel Lâm Đồng
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a4-1', 'Vietravel Lâm Đồng', 'Vietravel Lâm Đồng', 10000000, 'kientao', 'approved', 'tree-a4', 1, datetime('now'));

-- A5: Công ty CP Đầu tư & TV GD Thiên Tôn
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a5-1', 'Công ty CP Đầu tư & TV GD Thiên Tôn', 'Trường TH & THCS Athena Đà Lạt', 10000000, 'kientao', 'approved', 'tree-a5', 1, datetime('now'));

-- A6: Cty Xe Tự Lái Ninh Dân
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a6-1', 'Cty Xe Tự Lái Ninh Dân', 'Cty Xe Tự Lái Ninh Dân', 10000000, 'kientao', 'approved', 'tree-a6', 1, datetime('now'));

-- A7: Hội Doanh Nhân Trẻ Lâm Đồng
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a7-1', 'Hội Doanh Nhân Trẻ Lâm Đồng', 'Hội Doanh Nhân Trẻ Lâm Đồng', 10000000, 'kientao', 'approved', 'tree-a7', 1, datetime('now'));

-- A8: Quang Nhật
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a8-1', 'Quang Nhật', 'Công ty Quang Nhật', 10000000, 'kientao', 'approved', 'tree-a8', 1, datetime('now'));

-- A9: Khách sạn Cherry
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a9-1', 'Khách sạn Cherry', 'Khách sạn Cherry', 10000000, 'kientao', 'approved', 'tree-a9', 1, datetime('now'));

-- A10: Lê Tấn Hoàng (Tấn Hoàng)
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a10-1', 'Lê Tấn Hoàng', 'Nhà hàng ChiVo Cá Tầm', 10000000, 'kientao', 'approved', 'tree-a10', 1, datetime('now'));

-- A11: Công ty We Team
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a11-1', 'Công ty We Team', 'Công ty We Team', 10000000, 'kientao', 'approved', 'tree-a11', 1, datetime('now'));

-- B4: Lâm Sản Đà Lạt
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b4-1', 'Lâm Sản Đà Lạt', 'Lâm Sản Đà Lạt', 10000000, 'kientao', 'approved', 'tree-b4', 1, datetime('now'));

-- B5: The An House
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b5-1', 'The An House', 'The An House', 10000000, 'kientao', 'approved', 'tree-b5', 1, datetime('now'));

-- B6: Atispho
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b6-1', 'Atispho (Trần Thị Hoài Kha)', 'ATISPHO PHỞ ATISO ĐÀ LẠT', 10000000, 'kientao', 'approved', 'tree-b6', 1, datetime('now'));

-- B7: Chi Hội DNT Trẻ Phường Xuân Hương
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b7-1', 'Chi Hội DNT Trẻ Phường Xuân Hương', 'Chi Hội DNT Trẻ Phường Xuân Hương', 10000000, 'kientao', 'approved', 'tree-b7', 1, datetime('now'));

-- B8: Công ty TNHH Hải Phúc Hân
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b8-1', 'Công ty TNHH Hải Phúc Hân', 'Công ty TNHH Hải Phúc Hân', 10000000, 'kientao', 'approved', 'tree-b8', 1, datetime('now'));

-- B9: Nguyễn Duy Linh (Bánh cuốn Ông Sĩ)
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b9-1', 'Nguyễn Duy Linh', 'Bánh cuốn Ông Sĩ', 10000000, 'kientao', 'approved', 'tree-b9', 1, datetime('now'));

-- B10: Phạm Quý Hùng (GBi Ecoz)
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b10-1', 'Phạm Quý Hùng', 'HỆ SINH THÁI DOANH NGHIỆP GBi', 10000000, 'kientao', 'approved', 'tree-b10', 1, datetime('now'));

-- B11: Công ty cổ phần Bizino
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b11-1', 'Công ty cổ phần Bizino', 'Công ty cổ phần Bizino', 10000000, 'kientao', 'approved', 'tree-b11', 1, datetime('now'));

-- ===== TIER: DẤU ẤN (Nhiều người trên cùng 1 cây) =====

-- A12: 2 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a12-1', 'Trần Thanh Xuân', 'Gia đình Xuân - Phương Lê (Quận 1 - Sài Gòn)', 3000000, 'dauun', 'approved', 'tree-a12', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a12-2', 'Trần Thanh Xuân', 'Gia Đình Lê Anh - B. Trâm & Xuân Bách - N. Quỳnh (Q.1 - Sài Gòn)', 3000000, 'dauun', 'approved', 'tree-a12', 0, datetime('now'));

-- B12: 2 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b12-1', 'Nguyễn Văn Lâm', 'Gia đình Nguyễn Văn Lâm', 3000000, 'dauun', 'approved', 'tree-b12', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b12-2', 'Nguyễn Văn Lâm', 'Latas Đà Lạt', 3000000, 'dauun', 'approved', 'tree-b12', 1, datetime('now'));

-- A13: 3 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a13-1', 'Hoàng Kim Sơn Châu', 'Hoàng Kim Farm', 2000000, 'dauun', 'approved', 'tree-a13', 1, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a13-2', 'Nguyễn Thị Thanh Hiền', 'Nguyễn Thị Thanh Hiền', 2000000, 'dauun', 'approved', 'tree-a13', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a13-3', 'Lê Diễn Trung Hậu', 'Lê Diễn Trung Hậu', 2000000, 'dauun', 'approved', 'tree-a13', 0, datetime('now'));

-- B13: 3 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b13-1', 'Phạm Thị Bích Ngọc', 'Phạm Thị Bích Ngọc', 2000000, 'dauun', 'approved', 'tree-b13', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b13-2', 'Nguyễn Thị Thu Trang', 'Phòng Trà Cung Đàn Xưa', 2000000, 'dauun', 'approved', 'tree-b13', 1, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b13-3', 'Phạm Hà Thụy Anh', 'Phạm Hà Thụy Anh', 2000000, 'dauun', 'approved', 'tree-b13', 0, datetime('now'));

-- A14: 3 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a14-1', 'Nguyễn Tiến Thoại', 'Nguyễn Tiến Thoại', 2000000, 'dauun', 'approved', 'tree-a14', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a14-2', 'Hậu Kim Cương', 'Hậu Kim Cương', 2000000, 'dauun', 'approved', 'tree-a14', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a14-3', 'Vũ Thị Diễm Quỳnh', 'Vũ Thị Diễm Quỳnh', 2000000, 'dauun', 'approved', 'tree-a14', 0, datetime('now'));

-- B14: 3 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b14-1', 'Vũ Quang Đoàn', 'Á Hậu Ngọc Bảo cùng Ba Mẹ Đoàn - Thủy', 2000000, 'dauun', 'approved', 'tree-b14', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b14-2', 'Dương Thanh Nga', 'Dương Thanh Nga', 2000000, 'dauun', 'approved', 'tree-b14', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b14-3', 'Nguyễn Văn Hiếu', 'Fujiya Sushi Dalat', 2000000, 'dauun', 'approved', 'tree-b14', 1, datetime('now'));

-- A15: 4 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a15-1', 'Nguyễn Xuân Hải', 'Gia Đình Nguyễn Xuân Hải', 1500000, 'guitrao', 'approved', 'tree-a15', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a15-2', 'Nguyễn Đỗ Lâm Đồng', 'Gia Đình Nguyễn Đỗ Lâm Đồng', 1500000, 'guitrao', 'approved', 'tree-a15', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a15-3', 'Mai Thị Phương', 'Mai Thị Phượng', 1500000, 'guitrao', 'approved', 'tree-a15', 0, datetime('now'));

-- B15: 3 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b15-1', 'Nhà báo Diễm Thương', 'Nhà báo Diễm Thương', 2000000, 'dauun', 'approved', 'tree-b15', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b15-2', 'Lê Thị Kiều Nga', 'Enny Dalat', 2000000, 'dauun', 'approved', 'tree-b15', 1, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b15-3', 'Trần Thị Kim Linh', 'Gia đình Bảo Long Bình Thuận', 2000000, 'dauun', 'approved', 'tree-b15', 0, datetime('now'));

-- A16: 3 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a16-1', 'Cao Gia Chi Bảo Villa', 'Cao Gia Chi Bảo Villa', 2000000, 'dauun', 'approved', 'tree-a16', 1, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a16-2', 'Nước mắm Hồng Huy', 'Nước mắm Hồng Huy', 2000000, 'dauun', 'approved', 'tree-a16', 1, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a16-3', 'Gđ An Cúc Giang Diệp', 'Gđ An Cúc Giang Diệp', 2000000, 'dauun', 'approved', 'tree-a16', 0, datetime('now'));

-- B16: 3 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b16-1', 'Đỗ Thị Như Mai', 'Của nhà Đông Mai', 2000000, 'dauun', 'approved', 'tree-b16', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b16-2', 'Phạm Thị Việt Nhân', 'Gia đình bé Bọp', 2000000, 'dauun', 'approved', 'tree-b16', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-b16-3', 'Dương Văn Hiếu', 'Nguyễn Diễm, Dương Hiếu duyên khởi - Lam Yên trà quán', 2000000, 'dauun', 'approved', 'tree-b16', 1, datetime('now'));

-- A17: 2 người đóng góp
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a17-1', 'Thái Thị Ngọc Phú', 'Gia Đình Ngọc Phú', 3000000, 'dauun', 'approved', 'tree-a17', 0, datetime('now'));
INSERT INTO donations (id, name, message, amount, tier, status, tree_id, is_organization, created_at)
VALUES ('d-a17-2', 'Nhâm Thị Hồng', 'Nhâm Thị Hồng', 3000000, 'dauun', 'approved', 'tree-a17', 0, datetime('now'));

-- ===== XÓA NHÀ TÀI TRỢ CŨ VÀ THÊM MỚI =====
DELETE FROM sponsors;

-- Nhà tổ chức (tier: organizer)
INSERT INTO sponsors (id, name, logo_url, website, tier, display_order, is_active)
VALUES 
('org-hoidnt', 'Hội Doanh Nhân Trẻ Lâm Đồng', '/logos/hoidnt.svg', 'https://hoidntlamdong.vn', 'organizer', 1, 1);

-- Kim Cương (tier: diamond)
INSERT INTO sponsors (id, name, logo_url, website, tier, display_order, is_active)
VALUES 
('sp-caonguyen', 'Cao Nguyên Hoa Đà Lạt', '/logos/caonguyen.svg', '', 'diamond', 1, 1),
('sp-xoso', 'Công ty Xổ số Kiến thiết Lâm Đồng', '/logos/xoso.svg', '', 'diamond', 2, 1),
('sp-opc', 'Công ty CP Dược Phẩm OPC', '/logos/opc.svg', '', 'diamond', 3, 1),
('sp-vietravel', 'Vietravel Lâm Đồng', '/logos/vietravel.svg', '', 'diamond', 4, 1),
('sp-athena', 'Trường TH & THCS Athena Đà Lạt', '/logos/athena.svg', '', 'diamond', 5, 1);

-- Vàng (tier: gold)
INSERT INTO sponsors (id, name, logo_url, website, tier, display_order, is_active)
VALUES 
('sp-xetulai', 'Cty Xe Tự Lái Ninh Dân', '/logos/xetudilai.svg', '', 'gold', 1, 1),
('sp-quangnhat', 'Công ty Quang Nhật', '/logos/quangnhat.svg', '', 'gold', 2, 1),
('sp-cherry', 'Khách sạn Cherry', '/logos/cherry.svg', '', 'gold', 3, 1),
('sp-chivo', 'Nhà hàng ChiVo Cá Tầm', '/logos/chivo.svg', '', 'gold', 4, 1),
('sp-weteam', 'Công ty We Team', '/logos/weteam.svg', '', 'gold', 5, 1),
('sp-lamsan', 'Lâm Sản Đà Lạt', '/logos/laman.svg', '', 'gold', 6, 1),
('sp-theanhouse', 'The An House', '/logos/theanhouse.svg', '', 'gold', 7, 1),
('sp-atispho', 'ATISPHO PHỞ ATISO ĐÀ LẠT', '/logos/atispho.svg', '', 'gold', 8, 1),
('sp-dntxuanhuong', 'Chi Hội DNT Trẻ Phường Xuân Hương', '/logos/dntxuanhuong.svg', '', 'gold', 9, 1),
('sp-haiphuchan', 'Công ty TNHH Hải Phúc Hân', '/logos/haiphuchan.svg', '', 'gold', 10, 1),
('sp-banhcuon', 'Bánh cuốn Ông Sĩ', '/logos/banhcuon.svg', '', 'gold', 11, 1),
('sp-gbi', 'HỆ SINH THÁI DOANH NGHIỆP GBi', '/logos/cbi.svg', '', 'gold', 12, 1),
('sp-bizino', 'Công ty cổ phần Bizino', '/logos/bizino.svg', 'https://bizino.vn', 'gold', 13, 1);

-- Thống kê
SELECT 'Trees: ' || COUNT(*) FROM trees;
SELECT 'Donations: ' || COUNT(*) FROM donations;
SELECT 'Sponsors: ' || COUNT(*) FROM sponsors;
