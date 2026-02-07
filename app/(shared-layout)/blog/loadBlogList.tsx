import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import BlogGrid from "./blogGrid"
import { connection } from "next/server"

export default async function LoadBlogList() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  const data = await fetchQuery(api.posts.getPosts)
  
  return <BlogGrid posts={data} />
}

