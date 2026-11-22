// @ts-expect-error The JavaScript mock module has no TypeScript declarations.
import { feedPage } from "../mocks";
import type { Post } from "./types";

type FeedPage = {
    items: Post[];
    nextCursor: string | null;
};

export const getPosts = async (): Promise<FeedPage> => {
    await new Promise((r) => setTimeout(r, 800));
    return feedPage as FeedPage;
};