"use client";
import Navbar from "@/component/common/Navbar";

import { VerifierSidebar } from "@/component/verifier/VerifierSidebar";

export default function VerifierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-l from-gray-900 to-gray-950">
      <Navbar />
      <div className="flex flex-1 items-stretch">
        <VerifierSidebar />
        <div className="flex-1 ">{children}</div>
      </div>
    </div>
  );
}
