// import { z } from "zod";

// export const signUpSchema = z.object({
//     name: z.string().min(2).max(30),
//     email: z.email,
//     password: z.string().min(8).max(30)
// })

// export const loginSchema = z.object({
//     email: z.email,
//     password: z.string().min(8).max(30)
// })


import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name too short").max(30, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password too long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password too long"),
});
