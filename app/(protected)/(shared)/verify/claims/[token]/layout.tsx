"use client";
import Navbar from "@/component/common/Navbar";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

export default function VerifierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuth();
  return (
    <div className="w-full min-h-screen flex flex-col bg-mist-950">
      <Navbar />
      <div className="flex flex-1 items-stretch ">
        <Link
          className="absolute top-22 left-10  flex items-center h-fit gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-mist-700 rounded-md px-2.5 py-1 transition-colors"
          href={
            user.role === "CONTRIBUTOR"
              ? "/dashboard/verifier"
              : "/verify/claims"
          }
        >
          ← Back to Claims
        </Link>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
