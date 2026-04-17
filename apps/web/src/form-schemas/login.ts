import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Enter your email.").email("Enter a valid email."),
  password: z
    .string()
    .min(1, "Enter your password.")
    .min(6, "Password must be at least 6 characters."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
