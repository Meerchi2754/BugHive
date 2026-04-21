import z from "zod";

export const ClaimTypeSchma = z.enum(
  [
    "BUG FIX",
    "FEATURE",
    "PERFORMANCE",
    "REFACTOR",
    "DOCUMENTATION",
    "MENTORING",
  ],
  {
    error: () => ({ message: "Invalid Claim Type" }),
  },
);

export const claimVisibility = z.enum(["PUBLIC", "PRIVATE"]);

export type claimVisibilityType = z.infer<typeof claimVisibility>;

export const ClaimFormSchema = z.object({
  prLink: z
    .string()
    .url()
    .regex(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+$/, {
      message: "Enter valid Github PR Link.",
    }),
  description: z
    .string({ message: "Please enter the String." })
    .min(150, { message: "Description must be more than 150 Length." }),
  claimType: ClaimTypeSchma,
  visibility: claimVisibility,
});

export type ClaimFormType = z.infer<typeof ClaimFormSchema>;

export type ClaimType = z.infer<typeof ClaimTypeSchma>;
