'use client';

import { useState, useEffect } from 'react';

interface DonationTierConfig {
    id: string;
    name: string;
    emoji: string;
    minAmount: number;
    maxAmount: number;
    description: string;
    color: string;
}



export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        targetAmount: '',
        campaignStart: '',
        campaignEnd: '',
    });

    const [donationTiers, setDonationTiers] = useState<DonationTierConfig[]>([
        { id: 'kientao', name: 'KIẾN TẠO', emoji: '🏆', minAmount: 5000000, maxAmount: 10000000, description: 'Doanh nghiệp, Khách sạn, Nhà hàng', color: 'amber' },
        { id: 'dauun', name: 'DẤU ẤN', emoji: '🌸', minAmount: 1000000, maxAmount: 2000000, description: 'Hộ gia đình, Nhóm bạn bè', color: 'pink' },
        { id: 'guitrao', name: 'GỬI TRAO', emoji: '💝', minAmount: 200000, maxAmount: 500000, description: 'Nhân viên văn phòng, Du khách', color: 'blue' },
        { id: 'gieomam', name: 'GIEO MẦM', emoji: '🌱', minAmount: 50000, maxAmount: 100000, description: 'Mọi người dân', color: 'green' },
    ]);

    const [editingDonationTier, setEditingDonationTier] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Load settings from API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                const data = await res.json();
                if (data.success && data.data) {
                    setSettings({
                        bankName: data.data.bankName || '',
                        accountNumber: data.data.accountNumber || '',
                        accountHolder: data.data.accountHolder || '',
                        targetAmount: data.data.targetAmount || '',
                        campaignStart: data.data.campaignStart || '',
                        campaignEnd: data.data.campaignEnd || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('✅ Đã lưu cài đặt thành công!');
            } else {
                setMessage('❌ ' + (data.error || 'Có lỗi xảy ra!'));
            }
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Lỗi kết nối server!');
        } finally {
            setIsSaving(false);
        }
    };

    const updateDonationTier = (id: string, field: keyof DonationTierConfig, value: string | number) => {
        setDonationTiers(tiers => tiers.map(t => t.id === id ? { ...t, [field]: value } : t));
    };



    const formatCurrency = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Cài Đặt</h2>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* Bank Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">🏦 Thông tin ngân hàng</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên ngân hàng</label>
                        <input
                            type="text"
                            value={settings.bankName}
                            onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                        <input
                            type="text"
                            value={settings.accountNumber}
                            onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chủ tài khoản</label>
                        <input
                            type="text"
                            value={settings.accountHolder}
                            onChange={(e) => setSettings({ ...settings, accountHolder: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
            </div>

            {/* Campaign */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">📅 Chiến dịch</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu (VNĐ)</label>
                        <input
                            type="number"
                            value={settings.targetAmount}
                            onChange={(e) => setSettings({ ...settings, targetAmount: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                        <input
                            type="date"
                            value={settings.campaignStart}
                            onChange={(e) => setSettings({ ...settings, campaignStart: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                        <input
                            type="date"
                            value={settings.campaignEnd}
                            onChange={(e) => setSettings({ ...settings, campaignEnd: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
            </div>

            {/* Donation Tiers */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">💝 Cấp Độ Vinh Danh (Đóng góp)</h3>
                <p className="text-sm text-gray-500 mb-4">Click vào từng cấp độ để chỉnh sửa mức giá và mô tả</p>

                <div className="space-y-3">
                    {donationTiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer
                                ${editingDonationTier === tier.id
                                    ? `border-${tier.color}-500 bg-${tier.color}-50 ring-2 ring-${tier.color}-300`
                                    : `border-${tier.color}-200 bg-${tier.color}-50 hover:border-${tier.color}-400`
                                }`}
                            onClick={() => setEditingDonationTier(editingDonationTier === tier.id ? null : tier.id)}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{tier.emoji}</span>
                                <div className="flex-1">
                                    <div className="font-bold text-lg">{tier.name}</div>
                                    <div className="text-sm text-gray-600">
                                        {formatCurrency(tier.minAmount)}đ - {formatCurrency(tier.maxAmount)}đ
                                    </div>
                                </div>
                                <span className="text-gray-400">{editingDonationTier === tier.id ? '▲' : '▼'}</span>
                            </div>

                            {editingDonationTier === tier.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3" onClick={(e) => e.stopPropagation()}>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Số tiền tối thiểu</label>
                                            <input
                                                type="number"
                                                value={tier.minAmount}
                                                onChange={(e) => updateDonationTier(tier.id, 'minAmount', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Số tiền tối đa</label>
                                            <input
                                                type="number"
                                                value={tier.maxAmount}
                                                onChange={(e) => updateDonationTier(tier.id, 'maxAmount', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 border rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả đối tượng</label>
                                        <input
                                            type="text"
                                            value={tier.description}
                                            onChange={(e) => updateDonationTier(tier.id, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>



            {/* Webhook Integration */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">🔗 Webhook - Tích Hợp Google Sheets</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={typeof window !== 'undefined' ? `${window.location.origin}/api/webhook/donations` : '/api/webhook/donations'}
                                readOnly
                                className="flex-1 px-3 py-2 bg-gray-100 border rounded-lg font-mono text-sm"
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/api/webhook/donations`);
                                    alert('✅ Đã copy Webhook URL!');
                                }}
                                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                            >
                                📋 Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cấu trúc cột Excel/Sheet</label>
                        <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                            <p><span className="text-pink-600">Người gửi</span> | <span className="text-pink-600">Nội dung ghi chú</span> | <span className="text-pink-600">Số tiền (VND)</span></p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Google Apps Script (Paste vào Sheet)</label>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-64">
                            {`var WEBHOOK_URL = '${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhook/donations';

// 1. SYNC - Bắn toàn bộ dữ liệu hiện có
function syncAll() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var donations = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    if (row['Người gửi']) donations.push(row);
  }
  
  sendRequest({ action: 'sync', data: donations });
  Logger.log('✅ Đã sync ' + donations.length + ' dòng');
}

// 2. UPDATE - Khi edit ô
function onEdit(e) {
  var row = e.range.getRow();
  if (row <= 1) return; // Skip header
  
  var sheet = e.source.getActiveSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var donation = {};
  for (var j = 0; j < headers.length; j++) {
    donation[headers[j]] = rowData[j];
  }
  
  if (donation['Người gửi']) {
    sendRequest({ action: 'update', data: donation });
  }
}

// 3. NEW - Khi thêm dòng mới
function onChange(e) {
  if (e.changeType === 'INSERT_ROW') {
    // Delay để đợi user nhập data
    Utilities.sleep(2000);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var rowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    var donation = {};
    for (var j = 0; j < headers.length; j++) {
      donation[headers[j]] = rowData[j];
    }
    
    if (donation['Người gửi']) {
      sendRequest({ action: 'new', data: donation });
    }
  }
}

// Cài đặt trigger (chạy 1 lần)
function setupTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger('onChange')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onChange()
    .create();
  Logger.log('✅ Đã cài đặt trigger!');
}

function sendRequest(payload) {
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  UrlFetchApp.fetch(WEBHOOK_URL, options);
}`}
                        </pre>
                        <button
                            onClick={() => {
                                const code = `var WEBHOOK_URL = '${window.location.origin}/api/webhook/donations';

// 1. SYNC - Bắn toàn bộ dữ liệu hiện có
function syncAll() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var donations = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    if (row['Người gửi']) donations.push(row);
  }
  
  sendRequest({ action: 'sync', data: donations });
  Logger.log('✅ Đã sync ' + donations.length + ' dòng');
}

// 2. UPDATE - Khi edit ô
function onEdit(e) {
  var row = e.range.getRow();
  if (row <= 1) return;
  
  var sheet = e.source.getActiveSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var donation = {};
  for (var j = 0; j < headers.length; j++) {
    donation[headers[j]] = rowData[j];
  }
  
  if (donation['Người gửi']) {
    sendRequest({ action: 'update', data: donation });
  }
}

// 3. NEW - Khi thêm dòng mới
function onChange(e) {
  if (e.changeType === 'INSERT_ROW') {
    Utilities.sleep(2000);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var rowData = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    var donation = {};
    for (var j = 0; j < headers.length; j++) {
      donation[headers[j]] = rowData[j];
    }
    
    if (donation['Người gửi']) {
      sendRequest({ action: 'new', data: donation });
    }
  }
}

function setupTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger('onChange')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onChange()
    .create();
  Logger.log('✅ Đã cài trigger!');
}

function sendRequest(payload) {
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  UrlFetchApp.fetch(WEBHOOK_URL, options);
}`;
                                navigator.clipboard.writeText(code);
                                alert('✅ Đã copy Apps Script!');
                            }}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                        >
                            📋 Copy Apps Script
                        </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">📖 Hướng dẫn:</h4>
                        <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                            <li>Mở Google Sheet → Extensions → Apps Script</li>
                            <li>Xóa code cũ, paste Apps Script ở trên vào</li>
                            <li>Nhấn Save (Ctrl+S)</li>
                            <li><strong>Chạy hàm setupTriggers()</strong> 1 lần để cài trigger</li>
                            <li><strong>Chạy hàm syncAll()</strong> để bắn toàn bộ dữ liệu hiện có</li>
                            <li>Sau đó: Edit → bắn UPDATE | Thêm dòng → bắn NEW</li>
                        </ol>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary py-3 px-6 disabled:opacity-50"
            >
                {isSaving ? '⏳ Đang lưu...' : '💾 Lưu Tất Cả Cài Đặt'}
            </button>
        </div>
    );
}
