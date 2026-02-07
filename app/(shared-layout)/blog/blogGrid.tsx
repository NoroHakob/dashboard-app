"use client"

import { Doc } from "@/convex/_generated/dataModel";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type PostWithImage = Doc<"posts"> & {
  imageUrl: string | null
};

export const dynamic = "force-dynamic";
export const revalidate = 30;

export default function BlogGrid({ posts }: { posts: PostWithImage[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground col-span-full">No posts found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card className="pt-0 text-center" key={post._id}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.imageUrl ?? "https://images.unsplash.com/photo-1524504388940-b1c1722653e1"}
              alt={post.title}
              fill
              className="rounded-t-lg object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">{post.title}</h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>

          <CardFooter>
            <Link className={buttonVariants({ className: "w-full" })} href={`/blog/${post._id}`}>
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
