"use client"
import { useRouter } from "next/navigation";
export default function ForbiddenPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Access Forbidden 🚫
        </h2>
        <p className="mt-2 text-gray-600">
          You don't have permission to access this page on{" "}
          <span className="font-semibold">BugHive</span>.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Go to Landing Page
          </button>

        </div>
      </div>
    </div>
  );
}
