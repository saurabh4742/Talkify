import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";
import { MyContextProvider } from "@/ContextProvider";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { SocketProvider } from "@/components/SocketProvider";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Talkify",
  description: "Content Monitored Video Confrencing Web App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={cn(
          "h-full bg-background font-sans  antialiased",
          fontSans.variable
        )}
      >
        <SessionProvider session={session}>
          <MyContextProvider>
            <SocketProvider>
            <ReactQueryProvider>
              <Toaster />
              <div className="flex justify-center h-full items-center flex-col w-full">
                <Navbar />
                <div className="h-full w-full">{children}</div>
              </div>
            </ReactQueryProvider>
            </SocketProvider>
          </MyContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
