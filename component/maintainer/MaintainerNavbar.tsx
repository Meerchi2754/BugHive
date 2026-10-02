"use client";
import { ButtonComp } from "@/component/ui/button";
import { useAuth } from "@/context/authContext";
import { motion, useSpring } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { IoIosNotifications } from "react-icons/io";

import ProfileDropdown from "@/component/common/ProfileDropdown";

export default function MaintainerNavbar() {
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const { user, role } = useAuth();
  const [impactScore, setImpactScore] = useState<number>(0);
  return (
    <motion.div className="bg-white relative z-50 h-16 flex flex-row justify-between items-center border-b border-gray-200">
      <div>
        <h1 className="text-blue-500 text-4xl px-5 font-bitcount">
          Bug
          <span className="text-blue-700 font-bitcount">Hive</span>
        </h1>
      </div>

      <div className="px-2">
        <h2 className="font-bold text-xl text-blue-950">
          Welcome{" "}
          <span className="text-cyan-600">
            {user?.github_username ?? user?.username ?? "User"}
          </span>
        </h2>
      </div>

      <div className="flex flex-row items-center px-4 gap-4 font-poppins text-sm">
        <ProfileDropdown avatarSize={36} />
      </div>
    </motion.div>
  );
}
