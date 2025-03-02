"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateInfo() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser({ name: data.name, email: data.email, password: "" });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const userId = localStorage.getItem("userId");

    if (user.password.length > 0 && user.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      const updateData: any = { name: user.name };
      if (user.password) {
        updateData.password = user.password;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        setMessage("Information updated successfully!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setMessage("Failed to update. Try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Update Info</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleUpdate} className="w-80 p-6 bg-white shadow-md rounded-lg">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            className="input input-bordered w-full mb-4"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />

          <label className="block text-gray-700">New Password:</label>
          <input
            type="password"
            className="input input-bordered w-full mb-4"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Leave blank to keep the current password"
          />

          {message && (
            <div className={`text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"} mt-2`}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all w-full mt-4"
          >
            Confirm Update
          </button>

        </form>
      )}
    </div>
  );
}
