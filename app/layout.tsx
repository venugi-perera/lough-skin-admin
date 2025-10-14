// "use client";

// import { useEffect, useState } from "react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import Sidebar from "@/components/sidebar";
// import "./globals.css";

// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

// interface RootLayoutProps {
//   children: React.ReactNode;
// }

// export default function RootLayout({ children }: RootLayoutProps) {
//   const [activeTab, setActiveTab] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const token = localStorage.getItem("token");
//   console.log("Token from localStorage:", token);

//   useEffect(() => {
//     // Check if user is logged in
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, []);

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <div className="flex h-screen bg-gray-50">
//           {/* Sidebar only shows if logged in */}
//           {isLoggedIn && (
//             <Sidebar
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               sidebarOpen={true} // always open
//               setSidebarOpen={() => {}} // noop
//               // setIsLoggedIn={setIsLoggedIn
//             />
//           )}

//           <div className="flex-1 flex flex-col overflow-hidden">
//             {/* Header */}
//             {/* <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
//               {isLoggedIn && (
//                 <div className="flex items-center space-x-4">
//                   <span className="text-sm text-muted-foreground">
//                     Welcome back, Admin
//                   </span>
//                   <Avatar>
//                     <AvatarFallback>AD</AvatarFallback>
//                   </Avatar>
//                 </div>
//               )}
//             </header> */}

//             {/* Page Content */}
//             <div className="flex-1 overflow-y-auto">{children}</div>
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }

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
