import { claimVisibilityType } from "@/lib/validations/claims";
import { CombinedFormType } from "@/lib/validations/onboarding";
import { User } from "@supabase/supabase-js";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { ZodType } from "zod";

export type githubUserData = {
  github_username: string;
  github_token: string;
  github_connected: boolean;
  github_email: string;
  github_avatar_url: string;
};

export type UserDB = {
  id: string;
  username: string;
  isRemote:boolean;
  email: string;
  account_mode: claimVisibilityType;
  headline: string;
  bio: string;
  github_username: string;
  token: string;
  github_connected: boolean;
  onboarding_complete: boolean;
  github_avatar_url: string;
  role: string;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
  ivkey: string;
  github_access_token: string;
};

export type Role = "ADMIN" | "CONTRIBUTOR" | "VERIFIER" | "MAINTAINER" | null;

export type AuthContextType = {
  role: Role;
  user: UserDB | null;
  setUser: React.Dispatch<React.SetStateAction<UserDB | null>>;
  setRole: React.Dispatch<React.SetStateAction<Role | null>>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

export type OAuthProvider = "github" | "google";

// ONBOARDING TYPES:
export type FormStep = {
  title: string;
  position: number;
  validationSchema: ZodType<unknown>;
};

export type MultipleStepForm = {
  currentPosition: number;
  isLast: boolean;
  nextStep: () => void;
  form: UseFormReturn<CombinedFormType>;
};

export type FormDataResponse = {
  username: string;
  headline: string;
  bio: string;
  language: string[];
  availability: boolean;
  remote: boolean;
  gitConnected: boolean;
  location?: string | undefined;
};

export type encrypted = {
  encrytToken: string;
  iv: string;
};
export type ProxyCookie = {
  role: string;
  onboarding_complete: boolean;
};
