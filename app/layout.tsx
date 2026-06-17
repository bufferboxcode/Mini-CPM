import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiniCPM",
  description: "ระบบบริหารจัดการโครงการก่อสร้างระบบไฟฟ้า",
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
        {children}
      </body>
    </html>
  );
}
