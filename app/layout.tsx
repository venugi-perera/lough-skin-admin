import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Salon Admin Panel",
//   description: "Complete salon management system",
//   generator: "v0.dev",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: { fontSize: "14px" },
          }}
        />
      </body>
    </html>
  );
}
