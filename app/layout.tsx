import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "MiniCPM",
  description: "ระบบบริหารจัดการโครงการก่อสร้างระบบไฟฟ้า",
  openGraph: {
    title: "MiniCPM",
    description: "ระบบบริหารจัดการโครงการก่อสร้างระบบไฟฟ้า",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary",
    title: "MiniCPM",
    description: "ระบบบริหารจัดการโครงการก่อสร้างระบบไฟฟ้า",
    images: ["/logo.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" style={{ height: "100%", overflow: "hidden" }}>
      <body style={{ margin: 0, height: "100%", overflow: "hidden" }}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
