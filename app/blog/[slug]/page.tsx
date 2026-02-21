import { blogPosts } from "@/lib/blog-data"
import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)
    if (!post) {
        return { title: "Post Not Found" }
    }
    return {
        title: `${post.title} - Yazzil Blog`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)

    if (!post) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <article className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to blog
                </Link>

                <div className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                        <span className="flex items-center text-sm text-muted-foreground"><Clock className="w-4 h-4 mr-1" />{post.readTime}</span>
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 text-balance text-foreground">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <Image src={post.author.avatar} alt={post.author.name} width={48} height={48} className="rounded-full ring-2 ring-border" />
                        <div className="text-left">
                            <p className="font-semibold">{post.author.name}</p>
                            <p className="text-sm text-muted-foreground">{post.author.role}</p>
                        </div>
                    </div>
                </div>

                <div className="aspect-video relative overflow-hidden rounded-3xl mb-12 bg-muted border border-border shadow-lg">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
            <Footer />
        </main>
    )
}
