"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Transfer() {
  const router = useRouter();
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      router.push("/login"); 
    } else {
      setUserId(storedUserId);
    }
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    
    if (!userId) {
      setMessage("User not logged in");
      return;
    }
    if (!receiverId || !amount || Number(amount) <= 0) {
      setMessage("Please enter valid Receiver Account No. and Amount.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: Number(userId),
          receiverId: Number(receiverId),
          amount: Number(amount),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Success! Transferred $${amount} to Account No: ${receiverId}`);
        setReceiverId("");
        setAmount("");
      } else {
        setMessage(` ${data.message || "Transfer failed"}`);
      }
    } catch (error) {
      setMessage("Error processing transfer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Send Money</h1>
      <form onSubmit={handleTransfer} className="w-80 p-6 bg-white shadow-md rounded-lg">
        
        <label className="block text-gray-700">Receiver Account No.:</label>
        <input
          type="number"
          className="input input-bordered w-full mb-4"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
          placeholder="Enter Receiver Account No."
        />
        
        <label className="block text-gray-700">Amount ($):</label>
        <input
          type="number"
          className="input input-bordered w-full mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          placeholder="Enter Amount"
        />

        {message && (
          <p className={`text-sm ${message.includes("Success") ? "text-green-600" : "text-red-600"} mt-2`}>
            {message}
          </p>
        )}
        
        <button 
          type="submit" 
          className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all w-full mt-4"
          disabled={loading}
        >
          {loading ? "Processing..." : "Send Money"}
        </button>

       
       
      </form>
    </div>
  );
}
