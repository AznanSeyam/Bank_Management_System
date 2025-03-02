import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to TrustOne Bank</h1>
      <div className="flex space-x-4">
        <Link href="/login" className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all">
          Login
        </Link>
        <Link href="/register" className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md transition-all">
          Register
        </Link>
      </div>
    </div>
  );
}
