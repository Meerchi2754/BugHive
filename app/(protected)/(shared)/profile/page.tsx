"use client";

import { ButtonComp } from "@/component/ui/button";
import { InfoField } from "@/component/ui/InfoField";
import { useAuth } from "@/context/authContext";
import { claimVisibilityType } from "@/lib/validations/claims";
import { updateUser } from "@/services/profile/updateUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiUser, FiFileText, FiTag, FiMail } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const headlineRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [accountMode, setAccountMode] = useState<claimVisibilityType>(
    user?.account_mode!,
  );

  const updatedUser = async () => {
    setIsSubmitting(true);
    const headline = headlineRef.current!.value;
    const bio = bioRef.current!.value;
    const res = await updateUser(user?.id!, headline, bio, accountMode);
    if (!res) {
      toast.error("Update Failed");
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    setIsEdit(false);
    router.refresh();
    refreshUser();
    toast.success("Update SuccessFull");
  };
  const isMaintainer = user?.role === "MAINTAINER";
  const toggleUserVisibility = () => {
    setAccountMode((prev) => (prev === "PUBLIC" ? "PRIVATE" : "PUBLIC"));
  };

  return (
    <div
      className={`min-h-full p-5 ${isMaintainer ? "bg-white" : "bg-zinc-950"}`}
    >
      <h2
        className={`text-2xl font-bold ${isMaintainer ? "text-black" : "text-white"}`}
      >
        My Profile
      </h2>
      <p
        className={` text-sm ${isMaintainer ? "text-black" : "text-zinc-400"}`}
      >
        View your public profile information
      </p>

      <div className=" p-2">
        <div className="relative">
          <div
            className={`p-1 rounded bg-linear-to-tr ${isMaintainer ? "from-blue-600 to-blue-300 border border-blue-950" : "from-green-900 to-green-600 shadow-lg shadow-emerald-900/40"}  flex flex-row`}
          >
            <Image
              src={user?.github_avatar_url ?? "/profile.png"}
              width={150}
              height={150}
              alt="Profile photo"
              className="rounded-full border-2 border-zinc-900 object-cover hover:ring hover:ring-emerald-400 cursor-pointer"
            />
            <div className="absolute text-center right-1 ">
              <p
                className={`text-6xl font-bold ${isMaintainer ? "" : "text-green-100"} `}
              >
                BUG
              </p>
              <p
                className={`text-6xl font-bold ${isMaintainer ? "text-blue-950" : "text-green-950 "} `}
              >
                HIVE
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-10">
            <InfoField
              icon={<FiUser size={15} />}
              label={"Username"}
              value={user?.username}
            />
            <InfoField
              icon={<FiMail size={15} />}
              label={"Email"}
              value={user?.email}
            />
          </div>

          {isEdit ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-6">
              <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-2">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium uppercase">
                  <FiTag size={15} />
                  <p>Headline</p>
                </div>
                <input
                  type="text"
                  ref={headlineRef}
                  defaultValue={user?.headline}
                  placeholder={user?.headline}
                  className="w-full border border-gray-500 rounded mt-2 p-1"
                />
              </div>

              <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-2">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium uppercase">
                  <FiFileText size={15} />
                  <p>Bio</p>
                </div>
                <input
                  type="text"
                  ref={bioRef}
                  defaultValue={user?.bio}
                  placeholder={user?.bio}
                  className="w-full border border-gray-500 rounded mt-2 p-1"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-6">
              <InfoField
                icon={<FiTag size={15} />}
                label={"Headline"}
                value={user?.headline}
              />
              <InfoField
                icon={<FiFileText size={15} />}
                label={"Bio"}
                value={user?.bio}
              />
            </div>
          )}

          {user?.role === "CONTRIBUTOR" ? (
            <div className="flex flex-col  gap-3 p-2 bg-zinc-900 rounded-2xl mt-5 border border-zinc-700 hover:border hover:border-zinc-500">
              <div className="flex flex-row gap-2 items-center">
                <VscAccount size={15} />
                <label className="text-sm text-zinc-400">
                  Account Settings:
                </label>
              </div>
              <div className="flex items-center gap-3">
                <label>{accountMode ?? user.account_mode}</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsEdit((prev) => !prev);
                    toggleUserVisibility();
                  }}
                  className={`w-10 h-6 rounded-full transition-colors relative ${accountMode === "PUBLIC" ? "bg-black" : "bg-gray-200"} cursor-pointer`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white border border-gray-400 rounded-full transition-colors  ${accountMode === "PUBLIC" ? " right-1" : " left-1"}`}
                  />
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="flex flex-row gap-2 justify-center mt-5">
            {isEdit && (
              <ButtonComp
                text={!isSubmitting ? "Update" : "Updating"}
                onClick={() => updatedUser()}
                className="bg-blue-600 p-2 rounded hover:bg-blue-500 cursor-pointer"
              />
            )}
            <ButtonComp
              text={!isEdit ? "Edit" : "Cancel"}
              onClick={() => setIsEdit((prev) => !prev)}
              className={`p-2  rounded  cursor-pointer  ${!isEdit ? "bg-blue-600 hover:bg-blue-500 " : "bg-gray-600 hover:bg-gray-700"} `}
            />
          </div>

          {user?.role !== "MAINTAINER" && (
            <>
              {user?.github_connected ? (
                <div className="flex items-center gap-4 rounded border-2 border-emerald-800 p-2 mt-10">
                  <div>
                    <FaGithub size={42} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {user.github_username}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Github account Linked
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded border-2 border-amber-50 p-2 mt-10">
                  <div>
                    <FaGithub size={42} />
                  </div>
                  <div className="flex-1">
                    <p>Git Not Connected</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Link your GitHub account to enable contributions
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
