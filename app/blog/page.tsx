import { blogPosts } from "@/lib/blog-data"
import { Header } from "@/components/global/landing/landing/header"
import { Footer } from "@/components/global/landing/landing/footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

export const metadata = {
    title: "Blog - Yazzil Instagram Automation",
    description: "Learn how to automate Instagram DMs and scale your e-commerce growth with AI.",
}

export default function BlogIndexPage() {
    const latestPost = blogPosts[0]
    const otherPosts = blogPosts.slice(1)

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">The Yazzil Blog</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Insights, tutorials, and strategies on how to turn your Instagram into an automated revenue-generating engine.
                    </p>
                </div>

                {/* Hero Post */}
                {latestPost && (
                    <Link href={`/blog/${latestPost.slug}`} className="group block mb-16">
                        <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-3xl overflow-hidden border border-border transition-all hover:border-foreground/20 hover:shadow-xl">
                            <div className="aspect-[4/3] md:aspect-auto md:h-full relative overflow-hidden bg-muted">
                                <Image
                                    src={latestPost.coverImage}
                                    alt={latestPost.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            </div>
                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">{latestPost.category}</span>
                                    <span className="flex items-center text-xs text-muted-foreground"><Clock className="w-3 h-3 mr-1" />{latestPost.readTime}</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">{latestPost.title}</h2>
                                <p className="text-muted-foreground text-lg mb-8 line-clamp-3">{latestPost.excerpt}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-3">
                                        <Image src={latestPost.author.avatar} alt={latestPost.author.name} width={40} height={40} className="rounded-full" />
                                        <div>
                                            <p className="font-semibold text-sm">{latestPost.author.name}</p>
                                            <p className="text-xs text-muted-foreground">{latestPost.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm font-semibold text-primary">
                                        Read article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Grid Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherPosts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border transition-all hover:border-foreground/20 hover:shadow-lg">
                            <div className="aspect-video relative overflow-hidden bg-muted">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-primary text-xs font-semibold">{post.category}</span>
                                    <span className="text-muted-foreground/40">•</span>
                                    <span className="flex items-center text-xs text-muted-foreground"><Clock className="w-3 h-3 mr-1" />{post.readTime}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                                <p className="text-muted-foreground mb-6 line-clamp-3 text-sm flex-grow">{post.excerpt}</p>
                                <div className="flex items-center gap-3 mt-auto">
                                    <Image src={post.author.avatar} alt={post.author.name} width={32} height={32} className="rounded-full" />
                                    <div>
                                        <p className="font-semibold text-xs">{post.author.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{post.date}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    )
}
