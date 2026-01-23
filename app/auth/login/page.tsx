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
import { toast } from "sonner";              
import { useRouter } from "next/navigation"; 
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

type LoginFormValues = z.infer<typeof loginSchema>;
const fields: Array<keyof LoginFormValues> = ["email", "password"];

export default function LoginPage() {
  const [isPending, startTransition] = useTransition() 
  const router = useRouter(); 
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(data: LoginFormValues) {
    startTransition(async() => {
        try {
          await authClient.signIn.email({
            email: data.email,
            password: data.password,
            fetchOptions: {
              onSuccess: () => {
                toast.success("Logged in successfully"); 
                router.push("/");                        
              },
              onError: (error) => {
                toast.error(error.error.message);
              },
            },
          });
        } catch (error) {
          console.error("Login failed:", error);
        }
    })

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
              disabled={isPending}
            >
                {isPending ? (
                    <>
                        <Loader2 className="size-4 animate-spin"/>
                        <span>Loading...</span>
                    </>
                ) : (
                    <span>Login</span>
                )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
