import { Link } from "react-router";

type HeaderProps = {};

export default function Header({ }: HeaderProps) {
    return (
        <header className="header">
            <Link to={"/"}>
                <h1 className="logo">HandyCraft</h1>
            </Link >
            <input placeholder="Search..." className="search-bar" />
            <Link to={"/add-post"}>
                <button>Add Post</button>
            </Link >
            <Link to={"/chats"}>
                <button>Chats</button>
            </Link >
            <Link to={"/profile"}>
                <img src="../images/banner.png" alt="Profile" />
            </Link >
        </header>
    )
}