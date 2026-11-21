import type { Post } from "../api/types"

type PostCardProps = {
    post: Post
};

export default function PostCard({ post }: PostCardProps) {
    return (
        <div className="post-card">
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <p>Likes: {post.likesCount}</p>
            <p>Comments: {post.commentsCount}</p>
        </div>
    )
}