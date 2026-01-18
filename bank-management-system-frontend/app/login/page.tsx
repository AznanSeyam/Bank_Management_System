"use client";

import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      router.replace("/dashboard"); 
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("userId", data.userId); 
      router.replace("/dashboard");
    } else {
      setError(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="w-80 p-6 bg-white shadow-md rounded-lg">
        <label>Email:</label>
        <input 
          type="email" 
          className="input input-bordered w-full mb-4" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <label>Password:</label>
        <input 
          type="password" 
          className="input input-bordered w-full mb-4" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <button 
          type="submit" 
          className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}
