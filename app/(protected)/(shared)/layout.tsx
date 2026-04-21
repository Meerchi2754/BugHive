"use client";
import Navbar from "@/component/common/Navbar";
import { ContributorSidebar } from "@/component/contributor/ContributorSidebar";
import MaintainerNavbar from "@/component/maintainer/MaintainerNavbar";
import MaintainerSideBar from "@/component/maintainer/MaintainerSidebar";
import { VerifierSidebar } from "@/component/verifier/VerifierSidebar";
import { useAuth } from "@/context/authContext";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  return (
    <div className="w-full h-screen flex flex-col">
      {user?.role === "MAINTAINER" ? <MaintainerNavbar /> : <Navbar />}

      <div className="flex flex-1 items-stretch overflow-hidden">
        {user?.role === "MAINTAINER" ? (
          <MaintainerSideBar />
        ) : user?.role === "VERIFIER" ? (
          <VerifierSidebar />
        ) : (
          <ContributorSidebar />
        )}
        <div
          className={`flex-1 overflow-y-auto ${user?.role === "MAINTAINER" ? "bg-white" : "bg-zinc-950"}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
