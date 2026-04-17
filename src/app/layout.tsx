import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Price-on — онлайн-каталог для оптовых компаний",
  description: "Создайте SEO-каталог товаров и Telegram Mini App для вашего оптового бизнеса",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-manrope)]">
        {children}
      </body>
    </html>
  );
}
