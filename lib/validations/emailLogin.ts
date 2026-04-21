import { z } from "zod";

export const EmailSchema = z.object({
  email: z.email({ message: "Please enter your email." }).trim(),
  password: z
    .string()
    .min(6, {
      message: "Password should contain Minimum 6 Length",
    })
    .max(12, { message: "Maximun 12 length." })
    .regex(/[a-z]/, { message: "Contain atleast one lowercase letter." })
    .regex(/[A-Z]/, { message: "Contain at least one Uppercase letter." })
    .regex(/[0-9]/, { message: "Password should contain atleast one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "The password should contain atleast one Special character.",
    })
    .trim(),
});

export type EmailSchemaType = z.infer<typeof EmailSchema>;
