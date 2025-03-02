"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setIsSuccess(false);
      setMessage("Password must be at least 6 characters long. Try again.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        setMessage("Registration confirmed. Confirmation message sent to email.");
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Sorry! Try again.");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Error occurred! Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form onSubmit={handleRegister} className="w-80 p-6 bg-white shadow-md rounded-lg">
        <label>Name:</label>
        <input 
          type="text" 
          className="input input-bordered w-full mb-4" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        
        <label>Email:</label>
        <input 
          type="email" 
          className="input input-bordered w-full mb-4" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <label>Password:</label>
        <input 
          type="password" 
          className="input input-bordered w-full mb-4" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        {message && <div className={`alert ${isSuccess ? "alert-success" : "alert-error"} mt-4`}>{message}</div>}
        
        <button 
          type="submit" 
          className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all w-full mt-4"
        >
          Register
        </button>
      </form>
    </div>
  );
}
