import { Poppins } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
      <head />

      <body className={`${poppins.variable} antialiased box-border`}>
        <Providers>
          <Navbar />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
