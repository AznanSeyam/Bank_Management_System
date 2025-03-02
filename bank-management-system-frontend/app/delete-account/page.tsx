"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccount() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const handleDelete = async () => {
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account.");
      }

      localStorage.removeItem("userId");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Delete Account</h1>
      <p className="mb-4">Enter your password to confirm account deletion.</p>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="password"
        placeholder="Enter your password"
        className="input input-bordered w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleDelete}
        className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all w-full"
        disabled={loading}
      >
        {loading ? "Deleting..." : "Confirm Delete"}
      </button>

      <button
        onClick={() => router.push("/dashboard")}
        className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all w-full mt-4"
      >
        Cancel
      </button>
    </div>
  );
}
