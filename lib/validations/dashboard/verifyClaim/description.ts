import { z } from "zod";
export const descriptionSchema = z.object({
  description: z
    .string({ message: "Please enter a string" })
    .max(50, { message: "Max Length is 50" })
    .min(5, { message: "Min Length is 5" }),
});
