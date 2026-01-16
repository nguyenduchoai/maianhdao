import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://maianhdao.lamdong.vn'),
  title: "Đảo Mai Anh Đào - Để Lại Dấu Ấn Tại Trái Tim Đà Lạt",
  description: "Xã hội hóa cảnh quan & Gây quỹ cộng đồng để trồng 200 cây Mai Anh Đào trưởng thành tại Hồ Xuân Hương - trái tim thành phố Đà Lạt",
  keywords: ["Mai Anh Đào", "Đà Lạt", "Hồ Xuân Hương", "Gây quỹ", "Cây xanh", "Festival hoa"],
  authors: [{ name: "Bizino", url: "https://bizino.vn" }],
  openGraph: {
    title: "Đảo Mai Anh Đào - Để Lại Dấu Ấn Tại Trái Tim Đà Lạt",
    description: "Đóng góp để trồng 200 cây Mai Anh Đào và được ghi danh trên bản đồ",
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
