// "use client";

// import { useEffect, useState } from "react";
// import Sidebar from "@/components/sidebar";

// export default function ClientLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [activeTab, setActiveTab] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   //   const token = localStorage.getItem("token");
//   //   console.log("Token from localStorage:", token);

//   //   useEffect(() => {
//   //     const token = localStorage.getItem("token");
//   //     setIsLoggedIn(!!token);
//   //   }, []);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* {isLoggedIn && (
//         <Sidebar
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           sidebarOpen={true}
//           setSidebarOpen={() => {}}
//         />
//       )} */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <div className="flex-1 overflow-y-auto">{children}</div>
//       </div>
//     </div>
//   );
// }
