"use client";
import Navbar from "@/component/common/Navbar";
import SideBar from "@/component/common/Sidebar";
import { usePathname } from "next/navigation";
import { PiCardsThree } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiBadgeCheck } from "react-icons/bi";
import { ContributorSidebar } from "@/component/contributor/ContributorSidebar";

export default function ClaimCard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);
  const items = [
    {
      icons: (
        <BiBadgeCheck
          size={20}
          color={isActive("/dashboard/verifier") ? "#2563eb" : "white"}
        />
      ),
      link: "/dashboard/verifier",
      name: "Verify Claim",
    },
    {
      icons: (
        <PiCardsThree
          size={20}
          color={isActive("/dashboard/claims") ? "#2563eb" : "white"}
        />
      ),
      link: "/dashboard/claims",
      name: "My Claims",
    },
    {
      icons: <FaUser color={isActive("/profile") ? "#2563eb" : "white"} />,
      link: "/profile",
      name: "Profile",
    },
    {
      icons: (
        <IoSettingsOutline
          color={isActive("/settings") ? "#2563eb" : "white"}
        />
      ),
      link: "/settings",
      name: "Settings",
    },
  ];
  return (
    <div className="w-full min-h-screen flex flex-col bg-black bg-[radial-gradient(#444_1px,transparent_1px)] bg-size-[16px_16px]">
      <Navbar />
      <div className="flex flex-1 items-stretch">
        {/* <SideBar items={items} /> */}
        <ContributorSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
