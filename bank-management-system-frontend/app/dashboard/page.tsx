"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setIsLoggedIn(false);
      router.push("/login");
      return;
    }

    setIsLoggedIn(true);

    if (window.location.pathname === "/") {
      router.push("/dashboard");
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) throw new Error("Failed to fetch user details.");
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load user data.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Account Overview</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : user ? (
        <div className="card bg-base-100 shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold">Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          <p>Balance: <strong>${user.balance}</strong></p>
        </div>
      ) : (
        <p className="text-red-500">User not logged in. Please log in first.</p>
      )}

      <div className="flex flex-wrap gap-4 mt-6">
        <button 
          onClick={() => router.push("/transfer")} 
          className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
          disabled={buttonLoading}
        >
          Send Money
        </button>

        <button 
          onClick={() => router.push("/update-info")} 
          className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
          disabled={buttonLoading}
        >
          Update Info
        </button>

        <button 
          onClick={() => router.push("/transactions")} 
          className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
          disabled={buttonLoading}
        >
          Show Transactions
        </button>

        <button 
          onClick={() => router.push("/delete-account")} 
          className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
        >
          Delete Profile
        </button>

        <button 
          onClick={handleLogout} 
          className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
