export type Image = {
    id: number;
    url: string;
    width: number;
    height: number;
}

export type Author = {
    id: number;
    name: string;
    avatar: Image;
}

export type Post = {
    id: number;
    author: Author;
    title: string,
    description: string,
    images: [Image],
    status: string,
    likesCount: number,
    commentsCount: number,
    likedByMe: boolean,
    bookmarkedByMe: boolean,
    createdAt: Date,
    updatedAt: Date,
    type: string
};