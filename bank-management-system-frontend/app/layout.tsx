"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const restrictedPages = ["/", "/login", "/register"];

    if (userId) {
      setIsLoggedIn(true);
      if (restrictedPages.includes(window.location.pathname)) {
        localStorage.removeItem("userId"); 
        setIsLoggedIn(false);
        router.replace("/login"); 
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <html lang="en">
      <body className="antialiased">
        
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-bold">
            TrustOne Bank
          </Link>

          {isLoggedIn && (
            <button 
              onClick={handleLogout} 
              className="px-6 py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
            >
              Logout
            </button>
          )}
        </nav>

        <main className="p-4">{children}</main>

      </body>
    </html>
  );
}

