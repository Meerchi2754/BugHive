"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiBadgeCheck } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { PiCardsThree } from "react-icons/pi";

export default function MaintainerSideBar({}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className="flex flex-col w-48 bg-white px-4 py-6 gap-4 text-center justify-center border-r border-black">
      <div className="flex flex-row gap-2 items-center">
        <PiCardsThree
          size={20}
          color={isActive("/maintainer/shortlist") ? "#2563eb" : "black"}
        />
        <Link
          href="/maintainer/shortlist"
          className={` hover:text-gray-500 ${isActive("/maintainer/shortlist") ? "text-blue-600 font-medium" : "text-black"}`}
        >
          Shortlist Section
        </Link>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <FaUser color={isActive("/profile") ? "#2563eb" : "black"} />
        <Link
          href="/profile"
          className={` hover:text-gray-500 ${isActive("/profile") ? "text-blue-600 font-bold" : "text-black"}`}
        >
          Profile
        </Link>
      </div>
    </div>
  );
}
