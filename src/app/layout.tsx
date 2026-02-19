import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IDD Benefits Navigator",
  description: "Helping families navigate IDD benefit programs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${nunito.variable} ${nunitoSans.variable} font-body antialiased`}>
        <LocaleProvider>
          <MainLayout>{children}</MainLayout>
        </LocaleProvider>
      </body>
    </html>
  );
}
