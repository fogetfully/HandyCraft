import type { Post } from "../api/types"
import PostCard from "./PostCard"

type PostColumnProps = {
    column: Post[]
};

export default function PostColumn({ column }: PostColumnProps) {
    return (
        <div className="post-column">
            {column.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                />
            ))}
        </div>
    )
}