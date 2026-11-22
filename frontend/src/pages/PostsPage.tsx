


import { useEffect, useState } from "react";
import TaskList from "../components/PostList";
import { getPosts } from "../api/posts.ts";


export default function PostsPage() {
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [posts, setPosts] = useState<Awaited<ReturnType<typeof getPosts>>["items"]>([]);

    async function load() {
        getPosts()
            .then((page) => {
                setPosts(page.items);   // берём items, а не весь объект
                setStatus("success");
            })
            .catch(() => setStatus("error"));
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <h1>Posts Page</h1>
            <div className="main">
                {status === "success" && <TaskList posts={posts} />}
                {status === "loading" && <h2>...</h2>}
            </div>
        </div>
    )
}