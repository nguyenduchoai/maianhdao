import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://maianhdao.lamdong.vn'),
  title: "NGÀN CÂY ANH ĐÀO - Quanh Hồ Xuân Hương & Khu Vực Đà Lạt",
  description: "Chiến dịch NGÀN CÂY ANH ĐÀO - Gây quỹ cộng đồng để trồng hoa Anh Đào quanh Hồ Xuân Hương và khu vực Đà Lạt. Hãy cùng để lại dấu ấn tại trái tim thành phố!",
  keywords: ["Mai Anh Đào", "Anh Đào", "Đà Lạt", "Hồ Xuân Hương", "Gây quỹ", "Cây xanh", "Festival hoa", "Ngàn cây"],
  authors: [{ name: "Hội DNT Lâm Đồng", url: "https://maianhdao.lamdong.vn" }],
  openGraph: {
    title: "NGÀN CÂY ANH ĐÀO - Quanh Hồ Xuân Hương & Khu Vực Đà Lạt",
    description: "Đóng góp để trồng hoa Anh Đào và được ghi danh trên bản đồ - Chiến dịch xã hội hóa cảnh quan Đà Lạt",
    url: "https://maianhdao.lamdong.vn",
    siteName: "Đảo Mai Anh Đào",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Đảo Mai Anh Đào - Hồ Xuân Hương",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đảo Mai Anh Đào - Để Lại Dấu Ấn Tại Trái Tim Đà Lạt",
    description: "Đóng góp để trồng 200 cây Mai Anh Đào và được ghi danh trên bản đồ",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
