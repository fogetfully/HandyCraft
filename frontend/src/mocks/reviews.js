import { annaBrief, marinaBrief, igorBrief } from './users.js';

// GET /users/2/reviews — отзывы о мастере Марине
export const marinaReviewsPage = {
  items: [
    {
      id: 301,
      author: igorBrief,
      subjectId: 2,
      postId: 101,
      postTitle: 'Амигуруми: заяц в свитере',
      content: 'Купил племяннице, зайка пришёл за 3 дня, упакован аккуратно. Племянница не расстаётся.',
      createdAt: '2026-11-12T10:15:00Z',
      updatedAt: null,
    },
    {
      id: 302,
      author: annaBrief,
      subjectId: 2,
      postId: 104,
      postTitle: 'Свитер для таксы, горчичный цвет',
      content:
        'Марина связала свитер быстрее срока, учла все мерки, прислала промежуточные фото. Сидит идеально. Рекомендую!',
      createdAt: '2026-11-21T09:10:00Z',
      updatedAt: '2026-11-21T09:30:00Z', // отредактирован
    },
    {
      // Пост могли удалить: postId = null, но postTitle остаётся
      id: 303,
      author: igorBrief,
      subjectId: 2,
      postId: null,
      postTitle: 'Шарф из шерсти',
      content: 'Всё отлично.',
      createdAt: '2026-09-02T17:00:00Z',
      updatedAt: null,
    },
  ],
  nextCursor: null,
};

// GET /users/1/reviews — отзывы об Анне (пример от мастера)
export const annaReviewsPage = {
  items: [
    {
      id: 304,
      author: marinaBrief,
      subjectId: 1,
      postId: 104,
      postTitle: 'Свитер для таксы, горчичный цвет',
      content: 'Приятная заказчица: чёткое ТЗ, быстрая оплата, вежливое общение.',
      createdAt: '2026-11-21T09:40:00Z',
      updatedAt: null,
    },
  ],
  nextCursor: null,
};

// Пустая страница (состояние «отзывов пока нет»)
export const emptyReviewsPage = { items: [], nextCursor: null };
