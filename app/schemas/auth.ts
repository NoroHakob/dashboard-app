import z, { email } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(2).max(30),
    email: z.email,
    password: z.string().min(8).max(30)
})