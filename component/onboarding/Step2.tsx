"use client";
import { useMultiStepForm } from "@/context/formContext";
import { useState, useRef } from "react";
import { ButtonComp } from "../ui/button";
import { useAuth } from "@/context/authContext";

export function Step2Form() {
  const [Languages, setLanguages] = useState([
    "Rust",
    "React",
    "Java",
    "Go",
    "Python",
    "Node.js",
  ]);

  const { form } = useMultiStepForm();
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const selectedLanguage = (watch("language") as string[]) ?? [];
  const selectLanguage = (tag: string) => {
    const currentData = form.getValues("language") ?? [];
    const updatedData = currentData.includes(tag)
      ? currentData.filter((t) => t !== tag)
      : [...currentData, tag];
    form.setValue("language", updatedData, { shouldValidate: true });
  };

  const addtoLanguage = (text: string) => {
    if (!Languages.includes(text)) {
      setLanguages((prev) => [...prev, text]);
    }
  };
  const [openModel, setOpenModel] = useState<boolean>(false);
  const newLangRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4 py-5">
      {/* HEADLINE */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Headline</label>
        <input
          type="text"
          placeholder="Enter your Headline..."
          className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black bg-gray-200"
          {...register("headline")}
        />
        {errors.headline && (
          <p className="text-xs text-red-500">{errors.headline.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Bio</label>
        <textarea
          placeholder="Write a short bio..."
          rows={3}
          className="border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black resize-none bg-gray-200"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-xs text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">
          Languages/EcoSystem
        </label>
        <div className="flex flex-wrap gap-2">
          {Languages.map((lang) => (
            <ButtonComp
              key={lang}
              onClick={() => {
                selectLanguage(lang);
              }}
              className={`p-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedLanguage.includes(lang)
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              text={lang}
            />

            // <button
            //   key={lang}
            //   type="button"
            //   onClick={() => {
            //     selectLanguage(lang);
            //   }}
            //   className={`p-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            //     selectedLanguage.includes(lang)
            //       ? "bg-black text-white"
            //       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            //   }`}
            // >
            //   {lang}
            // </button>
          ))}
          <ButtonComp
            className="bg-black text-white rounded-full h-9 w-9"
            onClick={() => setOpenModel(true)}
            text="+"
          />
          {openModel ? (
            <div className="flex flex-row gap-3">
              <input
                type="text"
                className="rounded bg-gray-200 p-2 border border-gray-300"
                ref={newLangRef}
                placeholder="add Language"
              />

              <ButtonComp
                className="bg-gray-200 text-black p-2 rounded cursor-pointer"
                onClick={() => setOpenModel(false)}
                text="Cancel"
              />

              <ButtonComp
                className="bg-black text-white rounded p-1 cursor-pointer"
                onClick={() => {
                  const value = newLangRef.current?.value.trim() ?? ""!;
                  if (!value) return;
                  addtoLanguage(value);
                  setOpenModel(false);
                  selectLanguage(value);
                }}
                text="Submit"
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        {errors.language && (
          <p className="text-xs text-red-500">{errors.language.message}</p>
        )}
      </div>
    </div>
  );
}
