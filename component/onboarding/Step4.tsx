"use client";

import { useAuth } from "@/context/authContext";
import { motion } from "motion/react";
import { oAuth } from "@/app/actions/action";
import { FaGithub } from "react-icons/fa";

export function Step4Form() {
  const { user } = useAuth();
  const isConnected = user?.github_connected;
  return (
    <div>
      <div className="flex items-center justify-center flex-col p-4">
        <h2 className="text-black font-bold text-lg">Connect Your Github</h2>
        <p>Link your Github Account to your Profile.</p>
      </div>
      {isConnected ? (
        <div className="flex items-center justify-center flex-col text-gray-700 gap-2">
          <FaGithub size={16} />
          <span>{user.github_username}</span>
          <span className="text-xs text-green-600">Connected</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <motion.button
            className="flex items-center  gap-2 bg-white p-3 text-black rounded-4xl cursor-pointer border  hover:bg-gray-200"
            whileHover={{ scale: 1.0}}
            onClick={() => oAuth("github", user?.role!, "connect_github")}
          >
            <FaGithub size={30} />
            Sign in with Github
          </motion.button>
        </div>
      )}
    </div>
  );
}
