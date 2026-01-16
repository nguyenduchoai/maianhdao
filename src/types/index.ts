// Types for Đảo Mai Anh Đào

export type TreeStatus = 'available' | 'sponsored' | 'pending';
export type DonationStatus = 'pending' | 'approved' | 'rejected';
export type DonationTier = 'kientao' | 'dauun' | 'guitrao' | 'gieomam' | 'diamond' | 'gold' | 'silver' | 'green' | 'imprint' | 'entrust';
export type SponsorTier = 'organizer' | 'diamond' | 'gold' | 'silver';

export interface Tree {
    id: string;
    code: string; // A1, A2, B1...
    zone: string; // A, B, C
    lat: number;
    lng: number;
    status: TreeStatus;
    images?: string[];
    donorId?: string;
    donorName?: string;
    donorLogo?: string;
    donorAmount?: number;
    donorMessage?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Donation {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    amount: number;
    logoUrl?: string;
    message?: string;
    isOrganization?: boolean;
    status: DonationStatus;
    paymentRef?: string;
    treeId?: string;
    treeCode?: string;
    tier?: DonationTier;
    displayOrder?: number;
    createdAt?: string;
    approvedAt?: string;
}

export interface Sponsor {
    id: string;
    name: string;
    logoUrl?: string;
    website?: string;
    tier: SponsorTier;
    displayOrder?: number;
    isActive: boolean;
    createdAt?: string;
}

export interface CampaignStats {
    totalRaised: number;
    targetAmount: number;
    totalDonors: number;
    treesSponsored: number;
    treesAvailable: number;
    percentComplete: number;
}

export interface Settings {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    targetAmount: number;
    campaignStart: string;
    campaignEnd: string;
    heroTitle: string;
    heroSubtitle: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
