export interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string
    content: string
    coverImage: string
    date: string
    author: {
        name: string
        avatar: string
        role: string
    }
    category: string
    readTime: string
}
