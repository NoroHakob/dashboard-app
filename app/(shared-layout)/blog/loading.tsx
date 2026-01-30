"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingBlog() {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 py-12">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
