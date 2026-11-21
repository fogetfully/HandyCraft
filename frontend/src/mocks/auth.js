import { me } from './users.js';

// POST /auth/login и POST /auth/refresh
export const authResponse = {
  accessToken: 'mock.access.token',
  expiresIn: 900,
  user: me,
};

// Ошибки в формате application/problem+json
export const problems = {
  emailNotVerified: {
    type: 'about:blank',
    title: 'Forbidden',
    status: 403,
    detail: 'Подтвердите email, чтобы войти.',
    code: 'email_not_verified',
  },
  unauthorized: { type: 'about:blank', title: 'Unauthorized', status: 401, detail: 'Неверный email или пароль.' },
  notFound: { type: 'about:blank', title: 'Not Found', status: 404, detail: 'Публикация не найдена.' },
  alreadyExists: {
    type: 'about:blank', title: 'Conflict', status: 409,
    detail: 'Вы уже откликнулись на эту публикацию.', code: 'already_exists',
  },
  outOfStock: {
    type: 'about:blank', title: 'Conflict', status: 409,
    detail: 'Товара нет в наличии.', code: 'out_of_stock',
  },
  validation: {
    type: 'about:blank',
    title: 'Unprocessable Entity',
    status: 422,
    code: 'validation_failed',
    errors: [
      { field: 'title', message: 'Обязательное поле' },
      { field: 'quantity', message: 'Должно быть не меньше 0' },
    ],
  },
};
