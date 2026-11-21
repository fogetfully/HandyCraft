import { annaBrief, marinaBrief, igorBrief } from './users.js';

// Дерево комментариев к посту 104 («Свитер для таксы»), всего 6 — совпадает с commentsCount.
//
//  5003 Игорь                      (верхний уровень, без ответов)
//  5002 [удалён]                   (заглушка: у него остался ответ)
//    └─ 5006 Игорь
//  5001 Марина
//    └─ 5004 Анна
//         └─ 5005 Марина          (третий уровень вложенности)

const POST_ID = 104;

// GET /posts/104/comments           → верхний уровень, от новых к старым
export const commentsPage = {
  items: [
    {
      id: 5003,
      postId: POST_ID,
      parentId: null,
      author: igorBrief,
      content: 'Отличная идея! А для крупных собак вяжете?',
      isDeleted: false,
      repliesCount: 0,
      createdAt: '2026-11-09T18:30:00Z',
      updatedAt: null,
    },
    {
      // Заглушка удалённого комментария: author = null, content = null
      id: 5002,
      postId: POST_ID,
      parentId: null,
      author: null,
      content: null,
      isDeleted: true,
      repliesCount: 1,
      createdAt: '2026-11-08T15:00:00Z',
      updatedAt: null,
    },
    {
      id: 5001,
      postId: POST_ID,
      parentId: null,
      author: marinaBrief,
      content: 'Здравствуйте! Могу связать из мериноса, пришлю примеры работ в личные сообщения.',
      isDeleted: false,
      repliesCount: 1,
      createdAt: '2026-11-08T12:20:00Z',
      updatedAt: '2026-11-08T12:25:00Z', // был отредактирован
    },
  ],
  nextCursor: null,
};

// GET /posts/104/comments?parentId=...  → ответы, от старых к новым
// Ключ — id родителя.
export const repliesByParentId = {
  5001: {
    items: [
      {
        id: 5004,
        postId: POST_ID,
        parentId: 5001,
        author: annaBrief,
        content: 'Спасибо, Марина, ответила вам в личку!',
        isDeleted: false,
        repliesCount: 1,
        createdAt: '2026-11-08T12:45:00Z',
        updatedAt: null,
      },
    ],
    nextCursor: null,
  },
  5002: {
    items: [
      {
        id: 5006,
        postId: POST_ID,
        parentId: 5002,
        author: igorBrief,
        content: 'Не понял, на что вы отвечали, но вопрос тот же 🙂',
        isDeleted: false,
        repliesCount: 0,
        createdAt: '2026-11-09T09:00:00Z',
        updatedAt: null,
      },
    ],
    nextCursor: null,
  },
  5004: {
    items: [
      {
        id: 5005,
        postId: POST_ID,
        parentId: 5004,
        author: marinaBrief,
        content: 'Получила, начинаю подбирать пряжу 🧶',
        isDeleted: false,
        repliesCount: 0,
        createdAt: '2026-11-08T13:20:00Z',
        updatedAt: null,
      },
    ],
    nextCursor: null,
  },
};

// Ответ на POST /posts/104/comments (новый комментарий верхнего уровня)
export const newComment = {
  id: 5007,
  postId: POST_ID,
  parentId: null,
  author: annaBrief,
  content: 'Спасибо всем за отклики!',
  isDeleted: false,
  repliesCount: 0,
  createdAt: '2026-11-21T09:00:00Z',
  updatedAt: null,
};
