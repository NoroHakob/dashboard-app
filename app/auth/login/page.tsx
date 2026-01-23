"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { loginSchema } from "@/app/schemas/auth";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type LoginFormValues = z.infer<typeof loginSchema>;
const fields: Array<keyof LoginFormValues> = ["email", "password"];

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to get started right away</CardDescription>
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
                    <FieldLabel className="capitalize">
                      {fieldName}
                    </FieldLabel>

                    <Input
                      {...field} 
                      type={fieldName === "password" ? "password" : "email"}
                      placeholder={
                        fieldName === "email"
                          ? "you@example.com"
                          : "Your password"
                      }
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}

            <Button
              type="submit"
              className="bg-blue-600 text-white w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
