import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ServiceWorker } from "@/pwa/service-worker";
import "./globals.css";

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "InJessusName — Conhecer a Palavra. Viver com propósito.",
  description: "Uma jornada cristã de estudo bíblico, teologia e vivência da fé. Da criação aos dias atuais, com contexto, acolhimento e respeito às tradições.",
  applicationName: "InJessusName",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "InJessusName" },
  icons: { icon: "/icon.svg", apple: "/icons/apple-touch-icon.png" },
  formatDetection: { telephone: false }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#203b31"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
