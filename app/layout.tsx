import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HeroWrapper, ApolloWrapper, AccountProvider } from "@/providers";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wordpress + Woo",
  description: "Aplicación headless para WordPress + WooCommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >

        <AccountProvider>
          <HeroWrapper>
            <ApolloWrapper>
              <Navbar />
              {children}
            </ApolloWrapper>
          </HeroWrapper>
        </AccountProvider>
        <Footer />
      </body>
    </html>
  );
}
