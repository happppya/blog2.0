import PostCard, { Post } from "@components/home/PostCard";

interface ArticleGridProps {
  posts: Post[];
}

/**
 * Grid layout for mapping over Post data.
 * @param posts - Array of Post objects
 */
export default function ArticleGrid({ posts }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}