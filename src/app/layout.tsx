import type { Metadata, Viewport } from "next";
import { ServiceWorker } from "@/pwa/service-worker";
import "./globals.css";

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
    <html lang="pt-BR">
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
