import type { Post } from "../api/types"

type PostCardProps = {
    post: Post
};

export default function PostCard({ post }: PostCardProps) {
    return (
        <div className="post-card">
            <p>{post.type}</p>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <div className="line">
                <p>Likes: {post.likesCount}</p>
                <p>Comments: {post.commentsCount}</p>
            </div>
        </div>
    )
}