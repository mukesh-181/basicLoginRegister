import { email, z } from "zod";

export const userRegisterValidationSchema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(15, "Username must be at most 15 characters long"),
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const userLoginValidationSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
