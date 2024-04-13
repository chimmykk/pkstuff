import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Chat from "@/components/chat";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Class-Stats",
  description: "Our Next.js-based class management system offers a streamlined solution for educational institutions, simplifying administrative tasks and fostering better communication channels. Through our platform, teachers can effortlessly record daily attendance, with automatic email notifications sent to guardians in case of student absence. Additionally, users have access to a dedicated page for viewing attendance records and exam results, facilitating transparency and accountability. Administrators benefit from a comprehensive dashboard to manage student information and exam records efficiently. Guest access provides read-only functionality, ensuring information accessibility without compromising data integrity. Integrated with an intuitive assistant bot, our system ensures smooth navigation and user support throughout the platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextTopLoader   color="#4BDE80"   showSpinner={false}/>
       <Navbar />
        {children}
        <div 
          className="text-lg fixed bottom-6 right-6">
          <Chat />
        </div>
      </body>
    </html>
  );
}
