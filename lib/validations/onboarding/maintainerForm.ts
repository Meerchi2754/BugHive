import { z } from "zod";

export const MaintainerFormSchema = z.object({
  project: z
    .string()
    .min(5, { message: "Minimum Length is 5." })
    .max(50, { message: "Maximum Length is 50." }),

  techStack: z
    .array(z.string().min(1))
    .min(3, { message: "Please select atleast 3 TechStack." }),

  ecoSystem: z
    .array(z.string().min(1))
    .min(3, { message: "Please select atleast 3 Ecosystem." }),
});

export type MaintainerFormType = z.infer<typeof MaintainerFormSchema>;
