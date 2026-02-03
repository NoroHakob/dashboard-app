"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";           
import { useRouter } from "next/navigation"; 
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

const signUpSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFields = keyof z.infer<typeof signUpSchema>;
const fields: SignUpFields[] = ["name", "email", "password"];

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    startTransition(async() => {
      try {
        await authClient.signUp.email({
          email: data.email,
          name: data.name,
          password: data.password,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Signed up successfully"); 
              router.push("/auth/login");             
            },
            onError: (error) => {
              toast.error(error.error.message);
            },
          },
        });
      } catch (error) {
        console.error("Sign up failed:", error);
      }
    })
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              {fields.map((fieldName) => (
                <Controller
                  key={fieldName}
                  name={fieldName}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className="capitalize">{fieldName}</FieldLabel>
                      <Input
                        {...field} 
                        type={fieldName === "password" ? "password" : "text"}
                        placeholder={
                          fieldName === "name"
                            ? "Norayr Hakobyan"
                            : fieldName === "email"
                            ? "norohakobyan469@gmail.com"
                            : "Your password"
                        }
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              ))}

              <Button
                type="submit"
                className="bg-blue-600 text-white w-full"
                disabled={isPending}
              >
                  {isPending ? (
                      <>
                          <Loader2 className="size-4 animate-spin"/>
                          <span>Loading...</span>
                      </>
                  ) : (
                      <span>Sign up</span>
                  )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
