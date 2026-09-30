"use client";
import { AnimatePresence, motion } from "motion/react";
import { IoMdClose } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { ClaimFormProp } from "@/types/dashboard/contributor/claimform.types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClaimFormSchema, ClaimFormType } from "@/lib/validations/claims";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { toast } from "react-toastify";
import { findAllPR } from "@/utils/dashboard/contributors/findAllPR";
import { submitClaimForm } from "@/utils/dashboard/contributors/submitClaim";

const CLAIM_TYPES = [
  { value: "BUG FIX",       label: "Bug Fix" },
  { value: "FEATURE",       label: "Feature" },
  { value: "PERFORMANCE",   label: "Performance" },
  { value: "REFACTOR",      label: "Refactor" },
  { value: "DOCUMENTATION", label: "Documentation" },
  { value: "MENTORING",     label: "Mentoring" },
] as const;

export function ClaimsForm({ onClose }: ClaimFormProp) {
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClaimFormType>({
    resolver: zodResolver(ClaimFormSchema),
    defaultValues: { visibility: "PRIVATE" },
  });

  const descriptionValue = watch("description") ?? "";

  const toggleVisibility = () => {
    const next = !isPublic;
    setIsPublic(next);
    setValue("visibility", next ? "PUBLIC" : "PRIVATE");
  };

  const onSubmit = async (formData: ClaimFormType) => {
    try {
      const prList = await findAllPR();
      if (prList.includes(formData.prLink)) {
        toast.error("This PR URL has already been claimed.");
        return;
      }
      const res = await submitClaimForm(formData, user!);
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Submission failed. Please try again.");
        return;
      }
      toast.success("Claim submitted successfully.");
      onClose();
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    // Backdrop
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
        style={{ backgroundColor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.35)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Dialog panel */}
        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="w-full max-w-lg rounded-[12px] overflow-hidden shadow-2xl transition-colors duration-150"
          style={{
            backgroundColor: isDark ? "#0D1013" : "#ffffff",
            border: `1px solid ${isDark ? "#24282D" : "#e5e7eb"}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dialog header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${isDark ? "#24282D" : "#e5e7eb"}` }}
          >
            <div>
              <h2 className={`text-sm font-semibold ${isDark ? "text-[#F3F4F6]" : "text-gray-900"}`}>
                Submit Contribution Claim
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? "text-[#8B949E]" : "text-gray-500"}`}>
                Link a merged GitHub pull request to your BugHive profile.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`transition-colors duration-150 cursor-pointer p-1 rounded-[6px] ${
                isDark
                  ? "text-[#8B949E] hover:text-[#F3F4F6] hover:bg-[#24282D]"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <IoMdClose className="w-4 h-4" />
            </button>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="px-5 py-5 space-y-5">

              {/* GitHub PR URL */}
              <div className="space-y-1.5">
                <label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? "text-[#8B949E]" : "text-gray-700"}`}>
                  <FaGithub className="w-3.5 h-3.5" />
                  GitHub Pull Request URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("prLink")}
                    placeholder="https://github.com/owner/repo/pull/123"
                    className={`w-full text-sm rounded-[8px] px-3 py-2 outline-none transition-all duration-150 font-mono placeholder:font-sans placeholder:text-sm
                      ${isDark
                        ? "bg-[#111519] text-[#F3F4F6] placeholder:text-[#8B949E]/60 border-[#24282D] focus:border-[#00D084]/50 focus:ring-1 focus:ring-[#00D084]/20"
                        : "bg-[#f9fafb] text-gray-900 placeholder:text-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                      }
                      border
                      ${errors.prLink
                        ? isDark
                          ? "border-red-500/60 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/20"
                          : "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                        : ""
                      }`}
                  />
                </div>
                {errors.prLink && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <FiAlertCircle className="w-3 h-3 shrink-0" />
                    {errors.prLink.message}
                  </p>
                )}
              </div>

              {/* Claim Type */}
              <div className="space-y-1.5">
                <label className={`text-xs font-medium ${isDark ? "text-[#8B949E]" : "text-gray-700"}`}>
                  Claim Type
                </label>
                <select
                  {...register("claimType")}
                  defaultValue=""
                  className={`w-full text-sm rounded-[8px] px-3 py-2 outline-none transition-all duration-150 cursor-pointer border
                    ${isDark
                      ? "bg-[#111519] text-[#F3F4F6] border-[#24282D] focus:border-[#00D084]/50 focus:ring-1 focus:ring-[#00D084]/20"
                      : "bg-[#f9fafb] text-gray-900 border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                    }
                    ${errors.claimType
                      ? isDark
                        ? "border-red-500/60 focus:border-red-500/80"
                        : "border-red-400 focus:border-red-500"
                      : ""
                    }`}
                >
                  <option value="" disabled className={isDark ? "text-[#8B949E]" : "text-gray-400"}>
                    Select a claim type…
                  </option>
                  {CLAIM_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className={isDark ? "bg-[#111519]" : "bg-white"}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {errors.claimType && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <FiAlertCircle className="w-3 h-3 shrink-0" />
                    {errors.claimType.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-medium ${isDark ? "text-[#8B949E]" : "text-gray-700"}`}>
                    Description
                  </label>
                  <span
                    className={`text-xs font-mono tabular-nums ${
                      descriptionValue.length >= 150
                        ? "text-emerald-500 font-semibold"
                        : isDark
                        ? "text-[#8B949E]"
                        : "text-gray-400"
                    }`}
                  >
                    {descriptionValue.length} / 150 min
                  </span>
                </div>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Describe what this pull request contributes — the problem it solved, the approach taken, and its impact."
                  className={`w-full text-sm rounded-[8px] px-3 py-2 outline-none transition-all duration-150 resize-none border
                    ${isDark
                      ? "bg-[#111519] text-[#F3F4F6] placeholder:text-[#8B949E]/60 border-[#24282D] focus:border-[#00D084]/50 focus:ring-1 focus:ring-[#00D084]/20"
                      : "bg-[#f9fafb] text-gray-900 placeholder:text-gray-400 border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                    }
                    ${errors.description
                      ? isDark
                        ? "border-red-500/60 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/20"
                        : "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                      : ""
                    }`}
                />
                {errors.description && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <FiAlertCircle className="w-3 h-3 shrink-0" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Visibility toggle */}
              <div
                className="flex items-center justify-between rounded-[8px] px-3 py-3 transition-colors"
                style={{
                  backgroundColor: isDark ? "#111519" : "#f9fafb",
                  border: `1px solid ${isDark ? "#24282D" : "#e5e7eb"}`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  {isPublic ? (
                    <FiEye className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <FiEyeOff className={`w-4 h-4 ${isDark ? "text-[#8B949E]" : "text-gray-400"}`} />
                  )}
                  <div>
                    <p className={`text-xs font-medium ${isDark ? "text-[#F3F4F6]" : "text-gray-900"}`}>
                      {isPublic ? "Public" : "Private"}
                    </p>
                    <p className={`text-xs ${isDark ? "text-[#8B949E]" : "text-gray-500"}`}>
                      {isPublic
                        ? "Visible on your public profile"
                        : "Only visible to you and verifiers"}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={toggleVisibility}
                  role="switch"
                  aria-checked={isPublic}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    isPublic
                      ? "bg-emerald-500 focus:ring-emerald-500/40"
                      : isDark
                      ? "bg-[#24282D] focus:ring-[#8B949E]/30"
                      : "bg-gray-300 focus:ring-gray-400/30"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                      isPublic ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Dialog footer */}
            <div
              className="flex items-center justify-end gap-2 px-5 py-4"
              style={{ borderTop: `1px solid ${isDark ? "#24282D" : "#e5e7eb"}` }}
            >
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-[8px] text-sm transition-colors duration-150 cursor-pointer ${
                  isDark
                    ? "text-[#8B949E] hover:text-[#F3F4F6] hover:bg-[#24282D]/60"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-medium
                  border transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                  ${isDark
                    ? "bg-[#00D084]/10 text-[#00D084] border-[#00D084]/30 hover:bg-[#00D084]/20"
                    : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm"
                  }`}
              >
                {isSubmitting && (
                  <svg
                    className="w-3.5 h-3.5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                )}
                {isSubmitting ? "Submitting…" : "Submit Claim"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
