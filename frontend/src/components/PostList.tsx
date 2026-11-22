import type { Post } from "../api/types"
import PostColumn from "./PostColumn"

function splitByCount(arr:Post[], partsCount:number): Post[][] {
  if (partsCount <= 0) return [];

  const result = [];
  const size = Math.ceil(arr.length / partsCount);

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

type PostListProps = {
    posts: Post[]
};

export default function PostList({ posts }: PostListProps) {
    // сделать деление на столбцы динамическим в зависмости от ширины экрана
    const columnCount = 3;
    const columns: Post[][] = splitByCount(posts, columnCount);

    return (
        <div className="post-list">
            {columns.map((column) => (
                <PostColumn
                    column ={ column }
                />
            ))}
        </div>
    )
}