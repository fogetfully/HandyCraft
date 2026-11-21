// Единая точка входа: import { feedPage, dialogsPage, ... } from './mocks';
import { posts, archivedPost, draftPost, bookmarkedPosts } from './posts.js';

export * from './helpers.js';
export * from './users.js';
export * from './posts.js';
export * from './comments.js';
export * from './dialogs.js';
export * from './reviews.js';
export * from './auth.js';
export * from './events.js';

// ── Готовые ответы-страницы для постов ──
// GET /posts
export const feedPage = { items: posts, nextCursor: null };
// Пример пагинации: первая страница с курсором на следующую
export const feedPageFirst = { items: posts.slice(0, 5), nextCursor: 'mock-cursor-1' };
export const feedPageSecond = { items: posts.slice(5, 10), nextCursor: 'mock-cursor-2' };
export const feedPageLast = { items: posts.slice(10), nextCursor: null };
// Пустая лента
export const emptyPage = { items: [], nextCursor: null };

// GET /users/{id}/posts (профиль Игоря, id = 3, содержит archived)
export const igorPostsPage = {
  items: [...posts.filter((p) => p.author.id === 3), archivedPost],
  nextCursor: null,
};
// GET /users/{id}/posts для своего профиля (Анна, id = 1) — с черновиком
export const myPostsPage = {
  items: [draftPost, ...posts.filter((p) => p.author.id === 1)],
  nextCursor: null,
};
// GET /users/me/bookmarks
export const bookmarksPage = { items: bookmarkedPosts, nextCursor: null };
