"use client";
import { useMultiStepForm } from "@/context/formContext";
import { useState } from "react";
import { Controller } from "react-hook-form";

export function Step3Form() {
  const { form } = useMultiStepForm();
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-5 py-5">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Account Settings:{" "}
          {isPublic ? <span className="">Public</span> : <span>Private</span>}
        </label>
        <Controller
          name="availability"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => {
                field.onChange(!field.value);
                setIsPublic(!isPublic);
              }}
              className={`w-10 h-6 rounded-full transition-colors relative ${
                field.value ? "bg-black" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  field.value ? "left-5" : "left-1"
                }`}
              />
            </button>
          )}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Location <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Bangalore, India"
          className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-xs text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Open to remote</p>
          <p className="text-xs text-gray-400">
            Available for remote positions
          </p>
        </div>
        <input
          type="checkbox"
          className="accent-black w-4 h-4"
          {...register("remote")}
        />
        {errors.remote && (
          <p className="text-xs text-red-500">{errors.remote.message}</p>
        )}
      </div>
    </div>
  );
}
