import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import AppNavbar from "@/components/Navbar";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Legal Ease",
  description: "Find & Hire Lawyer",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AppNavbar></AppNavbar>
          {children}
          <Footer></Footer>
          <Toaster />
        </QueryProvider>
        </body>
    </html>
  );
}
