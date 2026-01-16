const db = require('./src/lib/db').default;

// Donation data
const donations = [
    { name: "Nguyễn Thị Ngọc Phú", amount: 100000 },
    { name: "Lê Thị Ngọc", amount: 100000 },
    { name: "Võ Thị Thu Ba", amount: 100000 },
    { name: "Lê Thị Thu Hậu", amount: 100000 },
    { name: "Lê Thị Thu Hậu", amount: 100000 },
    { name: "Lương Thị Đỗ Quyên & Phạm Lê Anh Duy", amount: 100000 },
    { name: "Vũ Thị Kim Anh", amount: 100000 },
    { name: "Mai Thị Hải", amount: 500000 },
    { name: "Kiên Trọng", amount: 200000 },
    { name: "Trần Minh Hiếu", amount: 200000 },
    { name: "Mai Thị Hải", amount: 500000 },
    { name: "Lê Thị Thanh Huyền", amount: 200000 },
    { name: "Huỳnh Thị Đông", amount: 200000 },
    { name: "Trần Thị Kim Huệ", amount: 200000 },
    { name: "Yến Sào Fathi", amount: 200000 },
    { name: "Nguyễn Thị Xuyên", amount: 200000 },
    { name: "Võ Thị Thanh Thủy", amount: 200000 },
    { name: "Võ Thị Bích Trâm", amount: 200000 },
    { name: "Đặng Nguyễn Minh Khánh", amount: 200000 },
    { name: "Vũ Quang Đoàn", amount: 200000 },
    { name: "Nguyễn Quốc Khánh", amount: 500000 },
    { name: "Đặng Vũ Dũng", amount: 200000 },
    { name: "Phạm Việt Phương", amount: 200000 },
    { name: "Trần Quỳnh Trâm Trinh", amount: 200000 },
    { name: "Uyen (Trần Thị Phiên)", amount: 200000 },
    { name: "Chế Thị Tuyết Mai", amount: 200000 },
    { name: "Nguyễn Phương Mỹ Ngọc", amount: 200000 },
    { name: "Mai Thị Phương", amount: 200000 },
    { name: "Trần Thị Nguyệt", amount: 200000 },
    { name: "Hoàng Kim Sơn Châu", amount: 1000000 },
    { name: "Nguyễn Thị Thanh Hiền", amount: 2000000 },
    { name: "Lê Diễn Trung Hậu", amount: 1500000 },
    { name: "Phạm Thị Bích Ngọc", amount: 2000000 },
    { name: "Nguyễn Thị Thu Trang", amount: 2000000 },
    { name: "Phạm Hà Thụy Anh", amount: 2000000 },
    { name: "Nguyễn Tiến Thoại", amount: 2000000 },
    { name: "Hậu Kim Cương", amount: 2000000 },
    { name: "Vũ Thị Diễm Quỳnh", amount: 1000000 },
    { name: "Vũ Quang Đoàn", amount: 1000000 },
    { name: "Dương Thanh Nga", amount: 2000000 },
    { name: "Nguyễn Văn Hiếu", amount: 1000000 },
    { name: "(Người gửi ẩn danh)", amount: 2000000 },
    { name: "Nguyễn Xuân Hải", amount: 2000000 },
    { name: "Nguyễn Đỗ Lâm Đồng", amount: 1000000 },
    { name: "Nhà báo Diễm Thương", amount: 1000000 },
    { name: "Lê Thị Kiều Nga (Enny Dalat)", amount: 1000000 },
    { name: "Trần Thị Kim Linh", amount: 1000000 },
    { name: "Cao Gia Chi Bảo Villa", amount: 1000000 },
    { name: "Nước mắm Hồng Huy", amount: 1000000 },
    { name: "Gđ An Cúc Giang Diệp", amount: 2000000 },
    { name: "Đỗ Thị Như Mai", amount: 1000000 },
    { name: "Phạm Thị Việt Nhân", amount: 1000000 },
    { name: "Dương Văn Hiếu", amount: 2000000 },
    { name: "Nguyễn Văn Lãm", amount: 3000000 },
    { name: "Trần Thanh Xuân", amount: 3000000 },
    { name: "Phạm Quý Hùng (GBi Ecoz)", amount: 5000000 },
    { name: "Lê Tấn Hoàng (Tấn Hoàng)", amount: 5000000 },
    { name: "Nguyễn Duy Linh (Bánh cuốn Ông Sĩ)", amount: 5000000 },
    { name: "Khách sạn Cherry", amount: 5000000 },
    { name: "Công ty TNHH Hải Phúc Hân", amount: 5000000 },
    { name: "Quang Nhật", amount: 5000000 },
    { name: "Công ty Xổ số Kiến thiết Lâm Đồng", amount: 10000000 },
    { name: "The An House", amount: 5000000 },
    { name: "Công ty CP Đầu tư & TV GD Thiên Tôn", amount: 5000000 },
    { name: "Cty Xe Tự Lái Ninh Dân", amount: 5000000 },
    { name: "Atispho (Trần Thị Hoài Kha)", amount: 5000000 },
];

// Get tier based on amount
function getTier(amount) {
    if (amount >= 5000000) return 'kientao';
    if (amount >= 1000000) return 'dauun';
    if (amount >= 200000) return 'guitrao';
    return 'gieomam';
}

// Insert donations
const stmt = db.prepare(`
    INSERT INTO donations (id, name, phone, email, amount, message, is_organization, tier, status, created_at)
    VALUES (?, ?, '', '', ?, '', ?, ?, 'approved', datetime('now'))
`);

let count = 0;
for (const d of donations) {
    const id = `donor-${Date.now()}-${count}`;
    const tier = getTier(d.amount);
    const isOrg = d.name.includes('Công ty') || d.name.includes('Cty') || d.name.includes('Khách sạn') || d.name.includes('Villa') ? 1 : 0;
    stmt.run(id, d.name, d.amount, isOrg, tier);
    count++;
    // Small delay to ensure unique IDs
}

console.log(`✅ Imported ${count} donations successfully!`);

// Show summary
const summary = db.prepare(`
    SELECT tier, COUNT(*) as count, SUM(amount) as total 
    FROM donations 
    GROUP BY tier 
    ORDER BY total DESC
`).all();

console.log('\n📊 Summary:');
summary.forEach(s => {
    console.log(`  ${s.tier}: ${s.count} donors, ${s.total.toLocaleString()}đ`);
});

const total = db.prepare('SELECT SUM(amount) as total FROM donations').get();
console.log(`\n💰 Total: ${total.total.toLocaleString()}đ`);
