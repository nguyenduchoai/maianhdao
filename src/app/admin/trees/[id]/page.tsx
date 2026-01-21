'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { formatCurrency } from '@/lib/utils';

const DraggableMap = dynamic(() => import('@/components/admin/DraggableMap'), { ssr: false });

interface DonorInfo {
    id: string;
    name: string;
    logo_url: string | null;
    amount: number;
    tier: string;
    message: string | null;
}

interface Donation {
    id: string;
    name: string;
    amount: number;
    tier: string;
    status: string;
    tree_ids?: string[];
}

interface Tree {
    id: string;
    code: string;
    zone: string;
    lat: number;
    lng: number;
    status: string;
    images: string[];
    donorId?: string;
    donorName?: string;
    donorAmount?: number;
    donors?: DonorInfo[]; // Multiple donors!
}

export default function TreeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [tree, setTree] = useState<Tree | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        lat: '',
        lng: '',
        zone: '',
        code: '',
        images: [] as string[],
    });

    // NEW: For assigning donors to tree
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [allDonations, setAllDonations] = useState<Donation[]>([]);
    const [selectedDonationIds, setSelectedDonationIds] = useState<string[]>([]);
    const [donationSearch, setDonationSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchTree();
        fetchAllDonations();
    }, [params.id]);

    const fetchTree = async () => {
        try {
            const res = await fetch('/api/trees');
            const data = await res.json();
            const foundTree = data.data?.find((t: Tree) => t.id === params.id);
            if (foundTree) {
                setTree(foundTree);
                setFormData({
                    lat: foundTree.lat.toString(),
                    lng: foundTree.lng.toString(),
                    zone: foundTree.zone,
                    code: foundTree.code,
                    images: foundTree.images || [],
                });
            }
        } catch (error) {
            console.error('Error fetching tree:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllDonations = async () => {
        try {
            const res = await fetch('/api/admin/donations?status=approved');
            const data = await res.json();
            setAllDonations(data.data || []);
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    const handleSave = async () => {
        if (!tree) return;
        try {
            const res = await fetch('/api/admin/trees', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: tree.id,
                    code: formData.code,
                    zone: formData.zone,
                    lat: parseFloat(formData.lat),
                    lng: parseFloat(formData.lng),
                    images: formData.images,
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Đã lưu thành công!');
                fetchTree();
                setIsEditing(false);
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error saving tree:', error);
            alert('Lỗi kết nối server');
        }
    };

    // NEW: Assign donors to this tree
    const handleAssignDonors = async () => {
        if (!tree) return;
        setIsSaving(true);

        try {
            // For each selected donation, add this tree to its tree_ids
            for (const donationId of selectedDonationIds) {
                const donation = allDonations.find(d => d.id === donationId);
                if (donation) {
                    const currentTreeIds = donation.tree_ids || [];
                    if (!currentTreeIds.includes(tree.id)) {
                        const newTreeIds = [...currentTreeIds, tree.id];
                        await fetch('/api/admin/donations', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: donationId, tree_ids: newTreeIds }),
                        });
                    }
                }
            }

            alert('Đã gán người sở hữu thành công!');
            setShowAssignModal(false);
            setSelectedDonationIds([]);
            fetchTree();
            fetchAllDonations();
        } catch (error) {
            console.error('Error assigning donors:', error);
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
    };

    // Remove a donor from this tree
    const handleRemoveDonor = async (donorId: string) => {
        if (!tree || !confirm('Xóa người sở hữu này khỏi cây?')) return;

        setIsSaving(true);
        try {
            const donation = allDonations.find(d => d.id === donorId);
            if (donation) {
                const newTreeIds = (donation.tree_ids || []).filter(tid => tid !== tree.id);
                await fetch('/api/admin/donations', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: donorId, tree_ids: newTreeIds }),
                });
            }
            alert('Đã xóa người sở hữu!');
            fetchTree();
            fetchAllDonations();
        } catch (error) {
            alert('Lỗi kết nối server');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleDonationSelection = (donationId: string) => {
        setSelectedDonationIds(prev =>
            prev.includes(donationId)
                ? prev.filter(id => id !== donationId)
                : [...prev, donationId]
        );
    };

    const getTierLabel = (tier: string) => {
        switch (tier) {
            case 'kientao': return '🏆 KIẾN TẠO';
            case 'dauun': return '🌸 DẤU ẤN';
            case 'guitrao': return '💝 GỬI TRAO';
            case 'gieomam': return '🌱 GIEO MẦM';
            default: return tier;
        }
    };

    // Get current donor IDs for this tree
    const currentDonorIds = tree?.donors?.map(d => d.id) || [];

    // Filter donations: show approved donations NOT already assigned to this tree
    const availableDonations = allDonations.filter(d =>
        d.status === 'approved' && !currentDonorIds.includes(d.id)
    );

    const filteredDonations = availableDonations.filter(d =>
        donationSearch === '' ||
        d.name.toLowerCase().includes(donationSearch.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4" />
                <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (!tree) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
                <p className="text-gray-600">Không tìm thấy cây!</p>
                <Link href="/admin/trees" className="text-pink-600 hover:underline mt-4 inline-block">
                    ← Quay lại danh sách
                </Link>
            </div>
        );
    }

    // Get all donors for this tree
    const donors = tree.donors || [];

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-4 sm:mb-6">
                <Link href="/admin/trees" className="text-pink-600 hover:underline text-sm sm:text-base">
                    ← Quay lại danh sách cây
                </Link>
            </div>

            {/* Header - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">🌸 Cây {tree.code}</h2>
                <div className="flex flex-wrap gap-2">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-primary py-2 px-3 sm:px-4 text-sm"
                        >
                            ✏️ Sửa thông tin
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="btn-primary py-2 px-3 sm:px-4 text-sm"
                            >
                                💾 Lưu
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="py-2 px-3 sm:px-4 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
                            >
                                Hủy
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {/* Tree Info */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Thông tin cây</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mã cây</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
                                />
                            ) : (
                                <p className="text-lg font-bold text-pink-600">{tree.code}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.zone}
                                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm sm:text-base"
                                />
                            ) : (
                                <p className="text-gray-800">Khu {tree.zone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <span className={`
                                px-3 py-1 rounded-full text-sm font-medium
                                ${tree.status === 'sponsored'
                                    ? 'bg-pink-100 text-pink-700'
                                    : 'bg-green-100 text-green-700'}`}>
                                {tree.status === 'sponsored' ? '🌸 Đã có chủ' : '🌱 Còn trống'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">📍 Vị trí trên bản đồ</h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (Lat)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={formData.lat}
                                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-mono text-sm">{tree.lat.toFixed(6)}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (Lng)</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.000001"
                                        value={formData.lng}
                                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-mono text-sm">{tree.lng.toFixed(6)}</p>
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            <DraggableMap
                                lat={parseFloat(formData.lat) || tree.lat}
                                lng={parseFloat(formData.lng) || tree.lng}
                                onLocationChange={(newLat, newLng) => {
                                    setFormData({
                                        ...formData,
                                        lat: newLat.toFixed(6),
                                        lng: newLng.toFixed(6),
                                    });
                                }}
                            />
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    href={`/map/${tree.id}`}
                                    className="block w-full text-center py-2.5 sm:py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm sm:text-base"
                                >
                                    🗺️ Xem trên Bản đồ
                                </Link>

                                <a
                                    href={`https://www.google.com/maps?q=${tree.lat},${tree.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                                >
                                    📍 Xem trên Google Maps
                                </a>

                                {/* Mini Map Preview - Hidden on small screens */}
                                <div className="h-36 sm:h-48 bg-gray-100 rounded-lg overflow-hidden hidden sm:block">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${tree.lat},${tree.lng}&zoom=18`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MULTIPLE DONORS - ENHANCED WITH ASSIGN FUNCTIONALITY */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h3 className="font-semibold text-gray-800">
                            👥 Người sở hữu ({donors.length})
                        </h3>
                        <button
                            onClick={() => setShowAssignModal(true)}
                            className="py-2 px-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm"
                        >
                            ➕ Thêm người sở hữu
                        </button>
                    </div>

                    {donors.length > 0 ? (
                        <div className="space-y-3">
                            {donors.map((donor, index) => (
                                <div
                                    key={donor.id}
                                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg ${index === 0 ? 'bg-pink-50 border-2 border-pink-200' : 'bg-gray-50'
                                        }`}
                                >
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {donor.logo_url ? (
                                            <img
                                                src={donor.logo_url}
                                                alt={donor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg sm:text-2xl">🌸</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-bold text-gray-800 text-sm sm:text-base truncate">{donor.name}</p>
                                            {index === 0 && (
                                                <span className="px-1.5 sm:px-2 py-0.5 bg-pink-500 text-white text-xs rounded">
                                                    Chính
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                                            {donor.amount > 0 && (
                                                <span className="text-pink-600 font-medium text-xs sm:text-sm">
                                                    {formatCurrency(donor.amount)}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500">
                                                {getTierLabel(donor.tier)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                        <Link
                                            href={`/admin/donations/${donor.id}`}
                                            className="text-pink-600 hover:underline text-xs sm:text-sm hidden sm:inline"
                                        >
                                            Chi tiết
                                        </Link>
                                        <button
                                            onClick={() => handleRemoveDonor(donor.id)}
                                            className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 text-xs sm:text-sm"
                                            title="Xóa"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                            <p className="text-2xl sm:text-3xl mb-2">🌱</p>
                            <p className="text-gray-500 text-sm sm:text-base">Cây chưa có người sở hữu</p>
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="text-pink-600 hover:underline text-sm mt-2"
                            >
                                ➕ Thêm người sở hữu đầu tiên
                            </button>
                        </div>
                    )}
                </div>

                {/* Images */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">🖼️ Hình ảnh</h3>

                    {(formData.images && formData.images.length > 0) ? (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {formData.images.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={img}
                                        alt={`Cây ${tree.code}`}
                                        className="w-full h-24 sm:h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => {
                                            const newImages = formData.images.filter((_, idx) => idx !== i);
                                            setFormData({ ...formData, images: newImages });
                                        }}
                                        className="absolute top-1 right-1 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-lg mb-4">
                            <p className="text-gray-500 text-sm">Chưa có hình ảnh</p>
                        </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            id="tree-image-upload"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploading(true);
                                const formDataUpload = new FormData();
                                formDataUpload.append('file', file);
                                formDataUpload.append('type', 'trees');
                                try {
                                    const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload });
                                    const data = await res.json();
                                    if (data.success) {
                                        setFormData({ ...formData, images: [...formData.images, data.url] });
                                        alert('Đã thêm ảnh! Nhớ nhấn "Lưu" để lưu thay đổi.');
                                    } else {
                                        alert(data.error || 'Lỗi upload');
                                    }
                                } catch (err) {
                                    alert('Lỗi upload file');
                                } finally {
                                    setIsUploading(false);
                                }
                            }}
                        />
                        <label
                            htmlFor="tree-image-upload"
                            className={`px-3 sm:px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm
                                ${isUploading ? 'bg-gray-300 text-gray-500' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
                        >
                            {isUploading ? 'Đang tải lên...' : '📷 Thêm ảnh'}
                        </label>
                        <span className="text-xs text-gray-500">Tối đa 5MB</span>
                    </div>
                </div>
            </div>

            {/* ASSIGN DONORS MODAL */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg sm:text-xl font-bold">➕ Thêm người sở hữu</h3>
                            <button
                                onClick={() => { setShowAssignModal(false); setDonationSearch(''); setSelectedDonationIds([]); }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 flex-1 overflow-auto">
                            <p className="mb-4 text-gray-600 text-sm sm:text-base">
                                Chọn các đóng góp để gán cho cây <strong>{tree.code}</strong>:
                            </p>

                            {/* Selected count */}
                            {selectedDonationIds.length > 0 && (
                                <div className="mb-3 p-3 bg-pink-50 rounded-lg">
                                    <span className="font-medium text-pink-700 text-sm">
                                        Đã chọn: {selectedDonationIds.length} người
                                    </span>
                                    <button
                                        onClick={() => setSelectedDonationIds([])}
                                        className="ml-3 text-sm text-pink-600 hover:underline"
                                    >
                                        Bỏ chọn
                                    </button>
                                </div>
                            )}

                            {/* Search input */}
                            <input
                                type="text"
                                value={donationSearch}
                                onChange={(e) => setDonationSearch(e.target.value)}
                                placeholder="🔍 Tìm kiếm theo tên..."
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 mb-3 text-sm sm:text-base"
                            />

                            {/* Donation list with checkboxes */}
                            <div className="max-h-48 sm:max-h-64 overflow-y-auto border rounded-lg">
                                {filteredDonations.length > 0 ? (
                                    filteredDonations.map(donation => (
                                        <label
                                            key={donation.id}
                                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0
                                                ${selectedDonationIds.includes(donation.id) ? 'bg-pink-50' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedDonationIds.includes(donation.id)}
                                                onChange={() => toggleDonationSelection(donation.id)}
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 rounded focus:ring-pink-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <span className="font-medium text-sm sm:text-base block truncate">{donation.name}</span>
                                                <span className="text-gray-500 text-xs sm:text-sm">
                                                    {formatCurrency(donation.amount)} • {getTierLabel(donation.tier)}
                                                </span>
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <p className="p-4 text-gray-500 text-center text-sm">
                                        {availableDonations.length === 0
                                            ? 'Tất cả đóng góp đã được gán'
                                            : 'Không tìm thấy đóng góp phù hợp'}
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                Hiển thị {filteredDonations.length} / {availableDonations.length} đóng góp có thể gán
                            </p>
                        </div>
                        <div className="px-4 sm:px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                            <button
                                onClick={() => { setShowAssignModal(false); setDonationSearch(''); setSelectedDonationIds([]); }}
                                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAssignDonors}
                                disabled={isSaving || selectedDonationIds.length === 0}
                                className="py-2 px-4 sm:px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 text-sm"
                            >
                                {isSaving ? 'Đang lưu...' : `✅ Gán ${selectedDonationIds.length} người`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
