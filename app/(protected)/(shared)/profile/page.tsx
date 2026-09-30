"use client";

import { ButtonComp } from "@/component/ui/button";
import { InfoField } from "@/component/ui/InfoField";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { claimVisibilityType } from "@/lib/validations/claims";
import { updateUser } from "@/services/profile/updateUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiUser, FiFileText, FiTag, FiMail, FiEdit2, FiTrash2, FiImage } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const headlineRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [accountMode, setAccountMode] = useState<claimVisibilityType>(
    user?.account_mode!,
  );
  const [bannerUrl, setBannerUrl] = useState<string | null>("/cover.png");

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
    toast.success("Update Successful");
  };

  const handleDeleteBanner = () => {
    setBannerUrl(null);
    toast.success("Banner photo removed");
  };

  const handleRestoreBanner = () => {
    setBannerUrl("/cover.png");
    toast.success("Banner photo restored");
  };

  const toggleUserVisibility = () => {
    setAccountMode((prev) => (prev === "PUBLIC" ? "PRIVATE" : "PUBLIC"));
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 md:p-8 transition-colors duration-150"
      style={{
        backgroundColor: isDark ? "#090B0D" : "#ffffff",
        backgroundImage: isDark
          ? "radial-gradient(#1a1d20 1px, transparent 1px)"
          : "radial-gradient(#e5e7eb 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        color: isDark ? "#F3F4F6" : "#111827",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            My Profile
          </h2>
          <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
            View your public profile information
          </p>
        </div>

        {/* Profile Card Container */}
        <div
          className={`rounded-2xl border shadow-sm transition-colors overflow-hidden ${
            isDark
              ? "bg-[#0D1013] border-[#24282D]"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Banner Container */}
          <div
            className={`relative w-full h-44 sm:h-52 md:h-64 select-none overflow-visible ${
              !bannerUrl
                ? isDark
                  ? "bg-gradient-to-r from-zinc-800 via-zinc-900 to-black"
                  : "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
                : ""
            }`}
          >
            {bannerUrl ? (
              <Image
                src={bannerUrl}
                alt="Profile cover banner"
                fill
                priority
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-400">
                <button
                  type="button"
                  onClick={handleRestoreBanner}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-300 dark:border-zinc-600 transition-all cursor-pointer"
                >
                  <FiImage size={15} />
                  Restore Banner Photo
                </button>
              </div>
            )}

            {/* Top-Right Banner Delete Button */}
            {bannerUrl && (
              <button
                type="button"
                onClick={handleDeleteBanner}
                title="Delete Banner Photo"
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-red-500 shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-105 z-20 border border-gray-200/80"
              >
                <FiTrash2 size={15} />
              </button>
            )}

            {/* Circular Profile Avatar Overlapping Bottom of Banner */}
            <div className="absolute -bottom-12 sm:-bottom-14 left-6 sm:left-10 z-30">
              <div className="relative">
                <Image
                  src={user?.github_avatar_url ?? "/profile.png"}
                  width={140}
                  height={140}
                  alt="Profile photo"
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#0D1013] shadow-xl object-cover bg-white cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Banner Bottom Action Bar */}
          <div className="flex justify-end items-center px-6 sm:px-10 pt-3 pb-3 gap-3">
            {bannerUrl && (
              <button
                type="button"
                onClick={handleDeleteBanner}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1 text-xs font-medium"
                title="Delete Banner"
              >
                <FiTrash2 size={16} />
                <span className="hidden sm:inline">Delete Banner</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsEdit((prev) => !prev)}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center gap-1 text-xs font-medium"
              title="Edit Profile"
            >
              <FiEdit2 size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>

          {/* Profile Content Body */}
          <div className="pt-8 sm:pt-10 px-6 sm:px-10 pb-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`rounded-2xl border p-4 transition-colors ${
                    isDark
                      ? "bg-zinc-900/80 border-zinc-700"
                      : "bg-white border-gray-200 shadow-xs"
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-zinc-400" : "text-gray-500"
                    }`}
                  >
                    <FiTag size={15} />
                    <p>Headline</p>
                  </div>
                  <input
                    type="text"
                    ref={headlineRef}
                    defaultValue={user?.headline}
                    placeholder="Enter headline..."
                    className={`w-full rounded-lg mt-2 px-3 py-2 text-sm outline-none border transition-colors ${
                      isDark
                        ? "bg-[#111519] border-zinc-700 text-white focus:border-emerald-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500"
                    }`}
                  />
                </div>

                <div
                  className={`rounded-2xl border p-4 transition-colors ${
                    isDark
                      ? "bg-zinc-900/80 border-zinc-700"
                      : "bg-white border-gray-200 shadow-xs"
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                      isDark ? "text-zinc-400" : "text-gray-500"
                    }`}
                  >
                    <FiFileText size={15} />
                    <p>Bio</p>
                  </div>
                  <input
                    type="text"
                    ref={bioRef}
                    defaultValue={user?.bio}
                    placeholder="Enter bio..."
                    className={`w-full rounded-lg mt-2 px-3 py-2 text-sm outline-none border transition-colors ${
                      isDark
                        ? "bg-[#111519] border-zinc-700 text-white focus:border-emerald-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500"
                    }`}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Account Settings */}
            {user?.role === "CONTRIBUTOR" && (
              <div
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
                  isDark
                    ? "bg-zinc-900/80 border-zinc-700 hover:border-zinc-500"
                    : "bg-white border-gray-200 hover:border-gray-400 shadow-xs"
                }`}
              >
                <div className="flex flex-row gap-3 items-center">
                  <div className={`p-2 rounded-xl ${isDark ? "bg-zinc-800" : "bg-gray-100"}`}>
                    <VscAccount size={18} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                  </div>
                  <div>
                    <label className={`text-sm font-semibold block ${isDark ? "text-white" : "text-gray-900"}`}>
                      Account Visibility
                    </label>
                    <p className={`text-xs ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                      Control whether your profile is publicly discoverable
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-semibold uppercase">
                    {accountMode ?? user.account_mode}
                  </span>
                  <button
                    type="button"
                    onClick={toggleUserVisibility}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      accountMode === "PUBLIC" ? "bg-emerald-500" : isDark ? "bg-zinc-700" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                        accountMode === "PUBLIC" ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-row gap-3 justify-end pt-2">
              {isEdit && (
                <ButtonComp
                  text={!isSubmitting ? "Save Changes" : "Saving..."}
                  disabled={isSubmitting}
                  onClick={() => updatedUser()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2 rounded-lg cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                />
              )}
              <ButtonComp
                text={!isEdit ? "Edit Profile" : "Cancel"}
                onClick={() => setIsEdit((prev) => !prev)}
                className={`px-5 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                  !isEdit
                    ? isDark
                      ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                      : "bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                    : isDark
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              />
            </div>

            {/* GitHub Status */}
            {user?.role !== "MAINTAINER" && (
              <div className="pt-2">
                {user?.github_connected ? (
                  <div
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                      isDark
                        ? "bg-zinc-900/60 border-emerald-800/80"
                        : "bg-white border-emerald-500/40 shadow-xs"
                    }`}
                  >
                    <FaGithub size={36} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                        {user.github_username}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-emerald-400/80" : "text-emerald-600"}`}>
                        GitHub account connected
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                      isDark
                        ? "bg-zinc-900/60 border-amber-800/80"
                        : "bg-white border-amber-300 shadow-xs"
                    }`}
                  >
                    <FaGithub size={36} className={isDark ? "text-amber-400" : "text-amber-600"} />
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        GitHub Not Connected
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-amber-400/80" : "text-amber-700"}`}>
                        Link your GitHub account to enable contributions
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
