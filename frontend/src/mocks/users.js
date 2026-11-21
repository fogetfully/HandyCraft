import { img, toBrief } from './helpers.js';

// ── Me: текущий залогиненный пользователь (GET /users/me, поле user в AuthResponse) ──
export const me = {
  id: 1,
  name: 'Анна Соколова',
  avatar: img(1, 'avatar-anna', 200, 200),
  about: 'Вышиваю гладью и крестиком, иногда вяжу. Люблю заказывать вещи для своей таксы Бублика.',
  city: 'Москва',
  sex: 'female',
  role: 'user',
  createdAt: '2026-03-02T10:00:00Z',
  email: 'anna.sokolova@example.com',
};

// ── Публичные профили (GET /users/{id}) — без email ──
export const users = [
  {
    id: 1,
    name: 'Анна Соколова',
    avatar: img(1, 'avatar-anna', 200, 200),
    about: 'Вышиваю гладью и крестиком, иногда вяжу. Люблю заказывать вещи для своей таксы Бублика.',
    city: 'Москва',
    sex: 'female',
    role: 'user',
    createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: 2,
    name: 'Марина Ветрова',
    avatar: img(2, 'avatar-marina', 200, 200),
    about:
      'Вяжу спицами и крючком уже 12 лет: свитера, носки, пледы, игрушки. Работаю с мериносом, альпакой и хлопком. Беру заказы по всей России, отправляю СДЭКом.',
    city: 'Санкт-Петербург',
    sex: 'female',
    role: 'user',
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    // Пограничный случай: нет аватара и текст «о себе» короткий
    id: 3,
    name: 'Игорь Бельский',
    avatar: null,
    about: 'Кожа и дерево. Шью вручную, без станков.',
    city: 'Казань',
    sex: 'male',
    role: 'user',
    createdAt: '2026-02-20T14:10:00Z',
  },
];

// Удобные краткие карточки (то, что приходит как author / peer / sender)
export const [annaBrief, marinaBrief, igorBrief] = users.map(toBrief);
