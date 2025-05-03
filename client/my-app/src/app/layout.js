import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from './components/sidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Task Manager",
  description: "Verwalten Sie Ihre Aufgaben effizient",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="md:pl-64 min-h-screen transition-[padding] duration-200 ease-in-out">
          <Sidebar />
          <main className="p-4 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
