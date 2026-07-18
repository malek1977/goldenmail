import "./globals.css";

export const metadata = {
  title: "الميل الذهبي | للمقاولات والديكورات",
  description: "مؤسسة الميل الذهبي - نحول أحلامك إلى واقع بتصاميم فاخرة",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-ink-900 text-slate-100 antialiased">{children}</body>
    </html>
  );
}