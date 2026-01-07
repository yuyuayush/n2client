import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "N2 | Modern Commerce",
  description: "Experience the next generation of shopping.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-purple-500/30">
        <Auth0Provider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
        </Auth0Provider>
      </body>
    </html>
  );
}
