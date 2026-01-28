"use client"

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

export default function BlogPage() {
    const data = useQuery(api.posts.getPosts)

    return(
        <div>
            <h1>Hello world</h1>
            <p>{data?.[3].title}</p>
        </div>
    )
}