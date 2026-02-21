import { BlogPost } from "./blog-types"
import { blogPostsPart1 } from "./blog-data-part1"
import { blogPostsPart2 } from "./blog-data-part2"
import { blogPostsPart3 } from "./blog-data-part3"

// Re-export interface for backward compatibility if any components rely on it heavily
export type { BlogPost }

// Combine all three parts into the main array
export const blogPosts: BlogPost[] = [
  ...blogPostsPart1,
  ...blogPostsPart2,
  ...blogPostsPart3
]
