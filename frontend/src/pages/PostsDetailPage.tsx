import { useEffect, useState } from "react";
import TaskList from "../components/PostList";
import { feedPage, me, dialog, messagesPage } from "../mocks";
import { getPosts } from "../api/posts";

const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
>("idle");


export default function PostsDetailPage() {
    const [posts, setPosts] = useState([]);

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
            <h1>Posts Detail Page</h1>
            <div className="main">
                {status === "success" && <TaskList posts={posts} />}
                {status === "loading" && <h2>...</h2>}
            </div>
        </div>
    )
}