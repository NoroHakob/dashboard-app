"use client"

import { Card } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

export default function BlogPage() {
    const data = useQuery(api.posts.getPosts)

    return(
        <div className="py-12">
            <div className="text-center pb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Our Blog
                </h1>
                <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">Insights, thoughts and trends from our team.</p>
            </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((post) => (
                <Card className="h-19" key={post._id}>
                    {post.title}
                </Card>

            ))}
        </div>
        </div>
    )
}