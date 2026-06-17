import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PEA Build",
  description: "ระบบบริหารจัดการโครงการก่อสร้างระบบไฟฟ้า",
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
