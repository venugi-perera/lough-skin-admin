// // "use client";

// // import { useState } from "react";
// // import LoginPage from "./page";
// // import AdminDashboard from "@/components/admin-dashboard";

// // export default function SalonApp() {
// //   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

// //   const handleLogin = (token: string) => {
// //     setIsLoggedIn(true);
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     setIsLoggedIn(false);
// //   };

// //   if (!isLoggedIn) {
// //     return <LoginPage onLogin={handleLogin} />;
// //   }

// //   return <AdminDashboard onLogout={handleLogout} />;
// // }

// "use client";

// import { useState, useEffect } from "react";
// import LoginPage from "./page"; // Your LoginPage
// import AdminDashboard from "@/components/admin-dashboard";

// export default function SalonApp() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check token on mount
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) setIsLoggedIn(true);
//   }, []);

//   const handleLogin = (token: string) => {
//     localStorage.setItem("token", token);
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//   };

//   return isLoggedIn ? (
//     <AdminDashboard onLogout={handleLogout} />
//   ) : (
//     <LoginPage setIsLoggedIn={setIsLoggedIn} />
//   );
// }
