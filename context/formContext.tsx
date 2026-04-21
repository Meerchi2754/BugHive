"use client";
import { createContext, useContext, useState } from "react";
import { MultipleStepForm, FormStep } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/authContext";
import {
  CombinedFormSchema,
  type CombinedFormType,
} from "@/lib/validations/onboarding";
import { step1Action } from "@/app/actions/onboarding/step1.action";
import { step2Action } from "@/app/actions/onboarding/step2.action";
import { step3Action } from "@/app/actions/onboarding/step3.action";

const MutliStepFormContext = createContext<MultipleStepForm | null>(null);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth();
  const [currentPosition, setCurrentPosition] = useState(
    user?.onboarding_step! | 0,
  );
  const form = useForm<CombinedFormType>({
    resolver: zodResolver(CombinedFormSchema),
    mode: "onChange",
    defaultValues: {
      availability: false,
      remote: false,
      gitConnected: false,
      language: [],
    },
  });

  const StepField: (keyof CombinedFormType)[][] = [
    ["username"],
    ["headline", "bio", "language"],
    ["availability", "location", "remote"],
    ["gitConnected"],
  ];

  const nextStep = async () => {
    const currentSchema = StepField[currentPosition];

    const isValid = await form.trigger(currentSchema);
    if (!isValid) return;
    
    const current_data = form.getValues();

    if (current_data && currentPosition === 0) {
      if (!user?.email) return;
      await step1Action(current_data, user?.email!);
      refreshUser();
    } else if (current_data && currentPosition === 1) {
      if (!user?.email) return;
      await step2Action(current_data, user?.email!);
      refreshUser();
    } else if (current_data && currentPosition === 2) {
      if (!user?.email) return;
      await step3Action(current_data, user?.email!);
      refreshUser();
    }
    setCurrentPosition((prev) => prev + 1);
  };

  const isLast = currentPosition === 3;

  return (
    <MutliStepFormContext.Provider
      value={{
        currentPosition,
        isLast,
        nextStep,
        form,
      }}
    >
      {children}
    </MutliStepFormContext.Provider>
  );
}

export function useMultiStepForm() {
  const context = useContext(MutliStepFormContext);
  if (!context) {
    throw new Error(`MultiStepForm must be inside FormProvider.`);
  }
  return context;
}
