"use client";
import { ButtonComp } from "@/component/ui/button";
import { useAuth } from "@/context/authContext";
import { motion, useSpring } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { IoIosNotifications } from "react-icons/io";

export default function MaintainerNavbar() {
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const { user, role } = useAuth();
  const [impactScore, setImpactScore] = useState<number>(0);
  return (
    <motion.div className="bg-white z-19 h-16 flex flex-row justify-between items-center border-b border-black">
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

      <div className="flex flex-row px-4 gap-4 font-poppins text-sm">
        <Image
          src={user?.github_avatar_url ?? "/profile.png"}
          width={40}
          height={40}
          alt="Profile photo"
          className="border-2 border-cyan-950 rounded-full cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
        />
      </div>
    </motion.div>
  );
}
