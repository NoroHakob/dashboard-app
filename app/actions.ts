"use server"

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { revalidatePath, updateTag } from "next/cache";

export async function CreateBlogAction(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);
    if (!parsed.success) throw new Error("Validation failed");

    const token = await getToken();

    // 1. Generate upload URL
    const uploadUrl: string = await fetchMutation(api.posts.generateImageUploadUrl, {}, { token });

    // 2. Upload image
    const uploadResult = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": parsed.data.image.type },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) return { error: "Failed to upload image" };

    // 3. Get storageId from upload
    const { storageId } = await uploadResult.json();

    // 4. Create post with storageId
    await fetchMutation(api.posts.createPost, {
      title: parsed.data.title,
      body: parsed.data.content,
      imageStorageId: storageId,
    }, { token });

  } catch {
    return { error: "Failed to create post" };
  }

  // Fast refresh
  updateTag("blog")
  return redirect("/blog");
}
