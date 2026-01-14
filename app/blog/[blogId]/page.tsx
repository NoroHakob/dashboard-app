interface BlogIdPageProps {
    params: Promise<{ blogId: string }>  
}

export default async function BlogIdPage({ params }: BlogIdPageProps) {
    const {blogId} = await params 
    return (
        <div>
            <h1>Hello from the blog id page</h1>
            <p>blogId: {blogId}</p>
        </div>
    )
}