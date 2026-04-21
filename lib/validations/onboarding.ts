import z from "zod";

// export const step1Schema = z.object({
//   username: z
//     .string({ message: "Please enter a valid string" })
//     .min(3, { message: "User name must be at least 3 character." }),
// });

// export const step2Schema = z.object({
//   headline: z
//     .string({ message: "Please enter a valid string" })
//     .min(4, { message: "Headline must be more than 4 Length." })
//     .max(80, { message: "Headline must be more than 4 Length." }),
//   bio: z
//     .string()
//     .min(10, { message: "Bio must be more than 10 Length." })
//     .max(300, { message: "Bio must be more than 300 Length." }),
//   language: z
//     .array(z.string().min(1))
//     .min(3, { message: "Please select atleast 3 Language" }),
// });

// export const step3Schema = z.object({
//   availability: z.boolean().default(false),
//   location: z
//     .string()
//     .min(1, { message: "Please enter a location." })
//     .default(""),
//   remote: z.boolean().default(false),
// });

// export const step4Schema = z.object({
//   gitConnected: z.boolean().default(false),
// });

export const CombinedFormSchema = z.object({
  username: z
    .string({ message: "Please enter a valid string" })
    .min(3, { message: "User name must be at least 3 character." }),

  headline: z
    .string({ message: "Please enter a valid string" })
    .min(4, { message: "Headline must be more than 4 Length." })
    .max(80, { message: "Headline must be more than 4 Length." }),
  bio: z
    .string()
    .min(10, { message: "Bio must be more than 10 Length." })
    .max(300, { message: "Bio must be more than 300 Length." }),
  language: z
    .array(z.string().min(1))
    .min(3, { message: "Please select atleast 3 Language" }),

  availability: z.boolean(),
  location: z.string().optional(),
  remote: z.boolean(),

  gitConnected: z.boolean(),
});

export type CombinedFormType = z.infer<typeof CombinedFormSchema>;
