"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Transactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/history/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data); 
        if (!Array.isArray(data)) throw new Error("Invalid transaction data");
        setTransactions(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load transactions.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Receiver Email</th>
                <th className="px-4 py-2">Receiver Account Number</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{tx.receiverEmail || "N/A"}</td>
                  <td className="px-4 py-2">{tx.receiverId || tx.receiver_id ? tx.receiverId || tx.receiver_id : "N/A"}</td>
                  <td className="px-4 py-2">${Number(tx.senderAmountSent || 0).toFixed(2)}</td>
                  <td className="px-4 py-2">{tx.transactionDate ? new Date(tx.transactionDate).toLocaleString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No transactions found.</p>
      )}

      
    </div>
  );
}
