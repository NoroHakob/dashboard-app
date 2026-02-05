import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { CommentSection } from "@/components/web/CommentSection"
import { Metadata } from "next"
import { PostPresence } from "@/components/web/PostPresence"
import { getToken } from "@/lib/auth-server"

interface PostIdRouteProps {
    params: Promise<{
        postId: Id<"posts">
    }>
}

export async function generateMetadata({params}: PostIdRouteProps): Promise<Metadata> {

  const {postId} = await params

  const post = await fetchQuery(api.posts.getPostById, { postId: postId })

    if (!post) {
      return {
        title: "Post not found"
      }
    }

    return {
      title: post.title,
      description: post.body,
    }
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params

  const token = await getToken()

  const [post, preloadedComments, userId] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { postId: postId }),
    await preloadQuery(api.comments.getCommentsByPost, {
        postId: postId
    }),
    await fetchQuery(api.presence.getUserId, {}, { token })
  ])

  

  if (!post) {
    return (
        <div>
            <h1 className="text-6xl font-extrabold text-red-500 py-20">
                No post found
            </h1>
        </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link
        href="/blog"
        className={buttonVariants({ variant: "outline", className: "mb-4"})} 
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <div className="relative w-full h-[400] mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image 
            src={post.imageUrl ?? "https://images.unsplash.com/photo-1524504388940-b1c1722653e1"} 
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"    
        />
      </div>
      
      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {post.title}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
              Posted on: {new Date(post._creationTime).toLocaleDateString("am-AM")}
          </p>
          {userId && <PostPresence roomId={post._id} userId={userId}/>}
        </div>
      </div>

      <Separator className="my-8"/>

        <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {post.body}
        </p>

      <Separator className="my-8"/>
      <CommentSection preloadedComments={preloadedComments}/>
    </div>
  )
}
