"use client";
import { ButtonComp } from "@/component/ui/button";
import { useAuth } from "@/context/authContext";
import { motion, useSpring } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { IoIosNotifications } from "react-icons/io";

export default function Navbar() {
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const { user, role } = useAuth();
  const [impactScore, setImpactScore] = useState<number>(0);
  return (
    <motion.div className="bg-mist-950 z-19 h-16 flex flex-row justify-between items-center border-b border-white">
      <div>
        <h1 className="text-white text-4xl px-5 font-bitcount">
          Bug
          <span className="text-green-500 font-bitcount">Hive</span>
        </h1>
      </div>

      <div className="px-2 flex flex-row gap-10">
        <h2 className="font-bold text-lg">
          Welcome{" "}
          <span className="text-emerald-500">
            {user?.github_username ?? user?.username ?? "User"}
          </span>
        </h2>
        <div className="h-5 w-px bg-gray-600" />
        <h2 className="font-poppins">Impact Score:{impactScore}</h2>
      </div>

      <div className="flex flex-row px-4 gap-4 font-poppins text-sm">
        <div className="relative ">
          <ButtonComp
            type="button"
            className="bg-mist-850 rounded border border-gray-600 cursor-pointer hover:ring-2 hover:ring-gray-700"
            icon={<IoIosNotifications color="gray" size={25} />}
          />
          {hasNotification && (
            <span className="bg-red-500 absolute top-0 right-0  border border-red-400 w-2 h-2 rounded-full hover:ring-2 hover:ring-white transition-all" />
          )}
        </div>
        <Image
          src={user?.github_avatar_url ?? "/profile.png"}
          width={35}
          height={35}
          alt="Profile photo"
          className="border rounded-full cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
        />
      </div>
    </motion.div>
  );
}
