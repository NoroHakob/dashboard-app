"use client"

import { CreateBlogAction } from "@/app/actions";
import { postSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function CreateRoute() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const mutation = useMutation(api.posts.createPost)
    const form = useForm<z.infer<typeof postSchema>>({
        resolver: zodResolver(postSchema),
        defaultValues: {
          content: "",
          title: ""
        },
      });

      function onSubmit(values: z.infer<typeof postSchema>) {
        startTransition(async() => {
            // mutation({
            //     body: values.content,
            //     title: values.title
            // })

            console.log("Hey this runs on the client side")

            // await CreateBlogAction()

            await fetch ("api/create-blog", {
                method: "POST"
            })

            toast.success("Everything was fine")

            router.push("/")
        })
      } 

    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create Post</h1>
                <p className="text-xl text-muted-foreground pt-4">Create your own blog article...</p>
            </div>

            <Card className="w-full max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Create Blog Article</CardTitle>
                    <CardDescription>Create a new blog article</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-y-4">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                    <FieldLabel className="capitalize">Title</FieldLabel>
                                    <Input
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="super cool title"
                                        {...field} 
                                    />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                    <FieldLabel className="capitalize">Content</FieldLabel>
                                    <Textarea
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Super cool blog content"
                                        {...field} 
                                    />
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
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
                                    <span>Create Post</span>
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}