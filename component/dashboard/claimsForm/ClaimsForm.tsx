"use client";
import { ButtonComp } from "@/component/ui/button";
import { motion } from "motion/react";
import { IoMdClose } from "react-icons/io";
import { ClaimFormProp } from "@/types/dashboard/contributor/claimform.types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClaimFormSchema, ClaimFormType } from "@/lib/validations/claims";
import { useAuth } from "@/context/authContext";
import { toast } from "react-toastify";
import { findAllPR } from "@/utils/dashboard/contributors/findAllPR";
import { submitClaimForm } from "@/utils/dashboard/contributors/submitClaim";

export function ClaimsForm({ onClose }: ClaimFormProp) {
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ClaimFormSchema),
    defaultValues: {
      visibility: "PRIVATE",
    },
  });

  const toogleVisibility = () => {
    const newValue = !isPublic;
    setIsPublic(newValue);
    const visibility = newValue ? "PUBLIC" : "PRIVATE";
    console.log("Visibility:", visibility);
    setValue("visibility", visibility);
  };

  const onSubmit = async (Formdata: ClaimFormType) => {
    try {
      const prList = await findAllPR();
      if (prList.includes(Formdata.prLink)) {
        toast.error("PR URL is already taken");
        return;
      }

      const res = await submitClaimForm(Formdata, user!);

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Something Fail.");
        return;
      }
      toast.success("CLAIM SUBMITTED");
      onClose();
    } catch (error) {
      toast.error(`${error}:"Unexpected error."`);
    }
  };

  return (
    <motion.div className="z-50 absolute w-90 top-1 right-1 h-170 mt-2 rounded border border-white bg-transparent backdrop-blur-sm ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row justify-between p-2">
          <h1 className="m-2">Enter Your Claim Details:</h1>
          <ButtonComp
            onClick={onClose}
            icon={<IoMdClose />}
            className="font-bold text-3xl hover:bg-gray-700 cursor-pointer"
          />
        </div>

        <div className="p-2">
          {/* GITHUB PR URL */}
          <div className="flex flex-col gap-3">
            <label htmlFor="PR-URL">Github PR URL:</label>
            <input
              type="text"
              {...register("prLink")}
              className="bg-gray-800 rounded p-1 border border-gray-700"
              placeholder="Enter Your PR Link"
            />
            <p className="text-red-700">{errors.prLink?.message}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="claimtype">Claim Type:</label>
            <select
              {...register("claimType")}
              defaultValue=""
              className=" bg-gray-800 rounded p-2 border border-gray-700"
            >
              <option value="" disabled>
                Select Your Claim Type
              </option>
              <option value="BUG FIX">Bug Fix</option>
              <option value="FEATURE">Feature</option>
              <option value="PERFORMANCE">Performance</option>
              <option value="REFACTOR">Refactor</option>
              <option value="DOCUMENTATION">Documentation</option>
              <option value="MENTORING">Mentoring</option>
            </select>
            <p className="text-red-700">{errors.claimType?.message}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description:</label>
            <textarea
              {...register("description")}
              name="description"
              className="bg-gray-800 rounded p-2 border border-gray-700 h-40 resize-none"
              placeholder="Enter Your text...."
            />
            <p className="text-red-700">{errors.description?.message}</p>
          </div>

          <div className="flex flex-col gap-4">
            <label>
              Visibility:{" "}
              <span className="ml-2">
                {isPublic ? "PUBLIC" : "PRIVATE"}
              </span>{" "}
            </label>
            <ButtonComp
              type="button"
              onClick={toogleVisibility}
              className={`w-10 h-6 cursor-pointer rounded-full transition-colors  ${
                isPublic ? "bg-green-800" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  isPublic ? "left-5" : "left-1"
                }`}
              />
            </ButtonComp>
            <p className="text-red-700">{errors.visibility?.message}</p>
          </div>

          {/* Submit */}
          <div className="p-2">
            <ButtonComp
              type="submit"
              text={isSubmitting ? "Submitting..." : "Submit"}
              disabled={isSubmitting}
              className=" text-white bg-green-800 rounded p-2 w-full border border-green-500 hover:bg-green-950 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </form>
    </motion.div>
  );
}
