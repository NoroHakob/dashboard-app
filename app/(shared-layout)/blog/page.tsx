import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import BlogGrid from "./blogGrid";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

export const metadata: Metadata = {
  title: "Blog | Next.js 16 Tutorial",
  description: "Read our latest articles and insights.",
  category: "Web development",
  authors: [{ name: "Norayr Hakobyan" }]
};

export default async function BlogPage() {
  // "use cache"
  // cacheLife("hours")
  // cacheTag("blog")
  await connection()
  const postsData = await fetchQuery(api.posts.getPosts, {});

  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-blue-500">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts and trends from our team.
        </p>
      </div>

      <BlogGrid posts={postsData} />
    </div>
  );
}
