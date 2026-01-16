// Sample tree data extracted from Google Maps
// Location: Đảo Mai Anh Đào, Hồ Xuân Hương, Đà Lạt
// Coordinates approximate: 11.948307, 108.450188

export interface TreeSeedData {
    code: string;
    zone: string;
    lat: number;
    lng: number;
}

// Generate tree positions based on the island layout
const centerLat = 11.948307;
const centerLng = 108.450188;

function generateTreePosition(zone: string, index: number): { lat: number; lng: number } {
    const offset = 0.0001; // ~10 meters

    // Zone A: Northern part of island
    if (zone === 'A') {
        return {
            lat: centerLat + 0.0003 + (index % 5) * offset * 0.5,
            lng: centerLng - 0.0002 + Math.floor(index / 5) * offset,
        };
    }

    // Zone B: Southern part of island
    if (zone === 'B') {
        return {
            lat: centerLat - 0.0002 + (index % 5) * offset * 0.5,
            lng: centerLng + 0.0001 + Math.floor(index / 5) * offset,
        };
    }

    // Zone C: Eastern shore
    return {
        lat: centerLat + (index % 4) * offset * 0.4,
        lng: centerLng + 0.0004 + Math.floor(index / 4) * offset * 0.5,
    };
}

export const sampleTrees: TreeSeedData[] = [];

// Generate Zone A trees (A1 - A20)
for (let i = 1; i <= 20; i++) {
    const pos = generateTreePosition('A', i);
    sampleTrees.push({
        code: `A${i}`,
        zone: 'A',
        ...pos,
    });
}

// Generate Zone B trees (B1 - B20)  
for (let i = 1; i <= 20; i++) {
    const pos = generateTreePosition('B', i);
    sampleTrees.push({
        code: `B${i}`,
        zone: 'B',
        ...pos,
    });
}

// Generate Zone C trees (C1 - C10)
for (let i = 1; i <= 10; i++) {
    const pos = generateTreePosition('C', i);
    sampleTrees.push({
        code: `C${i}`,
        zone: 'C',
        ...pos,
    });
}

// Sample sponsors data
export const sampleSponsors = [
    {
        id: 'sponsor-1',
        name: 'Vietravel Chi Nhánh Lâm Đồng',
        logoUrl: '/logos/vietravel.png',
        website: 'https://vietravel.com',
        tier: 'organizer',
        displayOrder: 1,
    },
    {
        id: 'sponsor-2',
        name: 'Cao Nguyên Hoa Đà Lạt',
        logoUrl: '/logos/caonguyen.png',
        website: '',
        tier: 'organizer',
        displayOrder: 2,
    },
    {
        id: 'sponsor-3',
        name: 'Cherry Hotel',
        logoUrl: '/logos/cherry.png',
        website: 'https://cherryhotel.vn',
        tier: 'diamond',
        displayOrder: 3,
    },
    {
        id: 'sponsor-4',
        name: 'Quang Nhật Đà Lạt',
        logoUrl: '/logos/quangnhat.png',
        website: '',
        tier: 'diamond',
        displayOrder: 4,
    },
    {
        id: 'sponsor-5',
        name: 'Như Ngọc',
        logoUrl: '/logos/nhungoc.png',
        website: '',
        tier: 'gold',
        displayOrder: 5,
    },
    {
        id: 'sponsor-6',
        name: 'The An House',
        logoUrl: '/logos/theanhouse.png',
        website: '',
        tier: 'gold',
        displayOrder: 6,
    },
    {
        id: 'sponsor-7',
        name: 'Bizino',
        logoUrl: '/logos/bizino.png',
        website: 'https://bizino.vn',
        tier: 'gold',
        displayOrder: 7,
    },
    {
        id: 'sponsor-8',
        name: 'Atispho',
        logoUrl: '/logos/atispho.png',
        website: '',
        tier: 'silver',
        displayOrder: 8,
    },
    {
        id: 'sponsor-9',
        name: 'WeTeam',
        logoUrl: '/logos/weteam.png',
        website: '',
        tier: 'silver',
        displayOrder: 9,
    },
];

// Sample donations data
export const sampleDonations = [
    {
        id: 'donation-1',
        name: 'Hoàng Kim Farm',
        phone: '0912345678',
        email: 'hoangkimfarm@gmail.com',
        amount: 50000000,
        isOrganization: true,
        status: 'approved',
        tier: 'diamond',
        treeCode: 'A1',
    },
    {
        id: 'donation-2',
        name: 'Nguyễn Thị Thanh Hiền',
        phone: '0987654321',
        email: 'thanhhien@gmail.com',
        amount: 20000000,
        isOrganization: false,
        status: 'approved',
        tier: 'gold',
        treeCode: 'A2',
    },
    {
        id: 'donation-3',
        name: 'Lê Diễn Trung Hậu',
        phone: '0901234567',
        email: 'trunghau@gmail.com',
        amount: 10000000,
        isOrganization: false,
        status: 'approved',
        tier: 'silver',
        treeCode: 'A3',
    },
    {
        id: 'donation-4',
        name: 'Phạm Thị Bích Ngọc',
        phone: '0909876543',
        email: '',
        amount: 5000000,
        isOrganization: false,
        status: 'approved',
        tier: 'silver',
        treeCode: 'A4',
    },
    {
        id: 'donation-5',
        name: 'Gia đình Nguyễn Đỗ Lâm Đồng',
        phone: '0918765432',
        email: '',
        amount: 3000000,
        isOrganization: false,
        status: 'approved',
        tier: 'green',
        treeCode: 'B1',
    },
];

export default { sampleTrees, sampleSponsors, sampleDonations };
