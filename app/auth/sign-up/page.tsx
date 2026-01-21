"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const signUpSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFields = "name" | "email" | "password";
const fields: SignUpFields[] = ["name", "email", "password"];

export default function SignUpPage() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // const onSubmit = (values: z.infer<typeof signUpSchema>) => {
  //   console.log("Form submitted:", values);
  // };

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    await authClient.signUp.email({
      email: data.email,
      name: data.name,
      password: data.password
    })
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
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
                      <FieldLabel>{fieldName[0].toUpperCase() + fieldName.slice(1)}</FieldLabel>
                      <Input
                        {...field}
                        type={fieldName === "password" ? "password" : "text"}
                        value={field.value as string}
                        placeholder={
                          fieldName === "name"
                            ? "Norayr Hakobyan"
                            : fieldName === "email"
                            ? "norohakobyan469@gmail.com"
                            : "Your password"
                        }
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              ))}

              <Button type="submit" className="bg-blue-600 text-white w-full">
                Sign Up
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
