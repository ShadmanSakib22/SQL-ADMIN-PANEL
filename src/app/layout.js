import { Poppins } from "next/font/google";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import "./globals.css";
// import { Analytics } from "@vercel/analytics/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "SQL Admin-Panel",
  description: "Task 4 - Next.js | Tailwind CSS | SQLite | Turso | Vercel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased box-border`}>
        <div className="min-h-screen">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
