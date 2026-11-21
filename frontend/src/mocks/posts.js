import { img } from './helpers.js';
import { annaBrief, marinaBrief, igorBrief } from './users.js';

// Лента GET /posts: только status = 'active', от новых к старым.
// 14 публикаций: 4 заказа, 6 товаров, 4 идеи; у каждого типа свои поля.
// Покрыты граничные случаи вёрстки: без картинок, без описания, много картинок,
// длинный текст, товар с нулевым остатком, заказ без срока и оплаты, 0 лайков / комментариев.

export const posts = [
  // ───── 114 · товар ─────
  {
    id: 114,
    type: 'product',
    author: marinaBrief,
    title: 'Шерстяные носки из мериноса, размер 36–38',
    description:
      'Тёплые носки ручной вязки, 70% меринос, 30% нейлон (не протираются на пятке). Цвет: молочный с серой полоской. Стирать вручную при 30°.',
    images: [img(114, 'socks-1', 800, 800), img(115, 'socks-2', 800, 800)],
    status: 'active',
    likesCount: 3,
    commentsCount: 0,
    likedByMe: false,
    bookmarkedByMe: false,
    createdAt: '2026-11-21T07:40:00Z',
    updatedAt: null,
    price: 1200,
    quantity: 8,
    inStock: true,
  },
  // ───── 113 · идея ─────
  {
    id: 113,
    type: 'idea',
    author: igorBrief,
    title: 'Подставка под книгу из одного куска дуба',
    description:
      'Придумал складную подставку без единого гвоздя: два паза, на которые садится вторая половина. Хочу сделать серию с разными узорами резьбы. Как думаете, кому такое пригодилось бы?',
    images: [img(116, 'bookstand', 800, 1000)], // вертикальная картинка
    status: 'active',
    likesCount: 18,
    commentsCount: 4,
    likedByMe: true,
    bookmarkedByMe: true,
    createdAt: '2026-11-20T18:05:00Z',
    updatedAt: null,
  },
  // ───── 112 · заказ ─────
  {
    id: 112,
    type: 'order',
    author: igorBrief,
    title: 'Нужен плед крупной вязки, 130×180 см',
    description:
      'Хочу плед из толстой шерсти, цвет графитовый или тёмно-зелёный. Важно, чтобы не колол кожу. Могу прислать референс.',
    images: [img(117, 'blanket-ref', 1000, 700)],
    status: 'active',
    likesCount: 2,
    commentsCount: 1,
    likedByMe: false,
    bookmarkedByMe: false,
    createdAt: '2026-11-20T11:22:00Z',
    updatedAt: null,
    desiredDeadline: '2026-12-20',
    desiredPayment: 6000,
  },
  // ───── 111 · товар ─────
  {
    id: 111,
    type: 'product',
    author: igorBrief,
    title: 'Кожаный картхолдер ручного шитья',
    description:
      'Растительное дубление, седельный шов вощёной ниткой, края отполированы. Вмещает до 6 карт и пару купюр. Цвет: тёмно-коричневый.',
    images: [
      img(118, 'cardholder-1', 800, 600),
      img(119, 'cardholder-2', 800, 600),
      img(120, 'cardholder-3', 800, 600),
    ],
    status: 'active',
    likesCount: 24,
    commentsCount: 3,
    likedByMe: false,
    bookmarkedByMe: true,
    createdAt: '2026-11-19T16:30:00Z',
    updatedAt: '2026-11-20T09:00:00Z',
    price: 2800,
    quantity: 3,
    inStock: true,
  },
  // ───── 110 · идея (длинный текст) ─────
  {
    id: 110,
    type: 'idea',
    author: marinaBrief,
    title: 'Как покрасить пряжу луковой шелухой',
    description:
      'Делюсь рецептом, который у меня получается стабильно.\n\n1. Возьмите шелухи столько, чтобы она занимала половину кастрюли, и залейте водой. Варите 40 минут.\n2. Остудите отвар и процедите.\n3. Заранее замочите пряжу в воде с ложкой уксуса на 30 минут: так цвет ляжет ровнее.\n4. Опустите пряжу в отвар, медленно доведите до почти кипения и держите 30–40 минут.\n5. Дайте остыть вместе с отваром, потом промойте тёплой водой.\n\nПолучается тёплый золотисто-рыжий цвет. Чем дольше пряжа остывает в отваре, тем темнее оттенок. Работает на шерсти и шёлке, на хлопке цвет бледнее. Если добавить щепотку квасцов, цвет станет стойким. Фото моих мотков в карусели 👇',
    images: [
      img(121, 'dye-1', 800, 600),
      img(122, 'dye-2', 800, 600),
      img(123, 'dye-3', 800, 600),
      img(124, 'dye-4', 800, 600),
      img(125, 'dye-5', 800, 600),
    ],
    status: 'active',
    likesCount: 112,
    commentsCount: 17,
    likedByMe: true,
    bookmarkedByMe: true,
    createdAt: '2026-11-19T09:10:00Z',
    updatedAt: null,
  },
  // ───── 109 · товар ─────
  {
    id: 109,
    type: 'product',
    author: annaBrief,
    title: 'Набор вышитых открыток, 5 штук',
    description: 'Открытки на плотной крафтовой бумаге с вышивкой гладью: лисы, грибы, ёжики. В комплекте конверты.',
    images: [img(126, 'cards-1', 900, 600), img(127, 'cards-2', 900, 600)],
    status: 'active',
    likesCount: 9,
    commentsCount: 2,
    likedByMe: false,
    bookmarkedByMe: false,
    createdAt: '2026-11-18T20:45:00Z',
    updatedAt: null,
    price: 900,
    quantity: 12,
    inStock: true,
  },
  // ───── 108 · заказ (без срока) ─────
  {
    id: 108,
    type: 'order',
    author: marinaBrief,
    title: 'Деревянная шкатулка для крючков и спиц',
    description:
      'Ищу мастера по дереву. Нужна шкатулка примерно 30×15×10 см с отделениями под крючки и спицы разной длины. Дерево светлое: ясень или берёза.',
    images: [],
    status: 'active',
    likesCount: 5,
    commentsCount: 2,
    likedByMe: false,
    bookmarkedByMe: false,
    createdAt: '2026-11-17T13:00:00Z',
    updatedAt: null,
    desiredDeadline: null,
    desiredPayment: 4000,
  },
  // ───── 107 · товар (последний экземпляр, много картинок) ─────
  {
    id: 107,
    type: 'product',
    author: marinaBrief,
    title: 'Снуд из альпаки, ручная работа',
    description:
      'Двойной снуд из альпаки с шёлком. Очень мягкий, не колется, греет в −15. Один экземпляр, повторить такой же цвет не смогу.',
    images: [
      img(128, 'snood-1', 800, 1000),
      img(129, 'snood-2', 800, 1000),
      img(130, 'snood-3', 800, 1000),
      img(131, 'snood-4', 800, 1000),
    ],
    status: 'active',
    likesCount: 41,
    commentsCount: 6,
    likedByMe: true,
    bookmarkedByMe: false,
    createdAt: '2026-11-16T10:20:00Z',
    updatedAt: null,
    price: 3200,
    quantity: 1,
    inStock: true,
  },
  // ───── 106 · идея (без описания) ─────
  {
    id: 106,
    type: 'idea',
    author: annaBrief,
    title: 'Вышивка гладью по фотографии питомца',
    description: null,
    images: [img(132, 'portrait-embroidery', 1000, 800)],
    status: 'active',
    likesCount: 27,
    commentsCount: 5,
    likedByMe: false,
    bookmarkedByMe: true,
    createdAt: '2026-11-14T19:00:00Z',
    updatedAt: null,
  },
  // ───── 105 · товар (нет в наличии) ─────
  {
    id: 105,
    type: 'product',
    author: igorBrief,
    title: 'Разделочная доска из ореха с ручкой',
    description: 'Орех, пропитка льняным маслом и воском. Размер 40×22 см, толщина 3 см.',
    images: [img(133, 'board-1', 800, 600), img(134, 'board-2', 800, 600)],
    status: 'active',
    likesCount: 15,
    commentsCount: 1,
    likedByMe: false,
    bookmarkedByMe: false,
    createdAt: '2026-11-12T08:00:00Z',
    updatedAt: '2026-11-19T12:00:00Z',
    price: 2400,
    quantity: 0,
    inStock: false,
  },
  // ───── 104 · заказ (по нему же создан диалог) ─────
  {
    id: 104,
    type: 'order',
    author: annaBrief,
    title: 'Свитер для таксы, горчичный цвет',
    description:
      'Нужен тёплый свитер для таксы: холка 25 см, длина спины 38 см, обхват груди 44 см. Цвет горчичный, можно с белой полосой. Пряжа мягкая, чтобы не кусалась.',
    images: [img(135, 'dog-sweater-1', 800, 800), img(136, 'dog-sweater-2', 800, 800)],
    status: 'active',
    likesCount: 7,
    commentsCount: 6, // совпадает с деревом комментариев в comments.js
    likedByMe: true,
    bookmarkedByMe: false,
    createdAt: '2026-11-08T09:15:00Z',
    updatedAt: null,
    desiredDeadline: '2026-11-25',
    desiredPayment: 3500,
  },
  // ───── 103 · идея (без картинок) ─────
  {
    id: 103,
    type: 'idea',
    author: igorBrief,
    title: 'Кожаный чехол для блокнота с тиснением',
    description: 'Хочу делать чехлы под блокноты формата А5 со сменным блоком. Тиснение по запросу: инициалы, узор, карта города.',
    images: [],
    status: 'active',
    likesCount: 0,
    commentsCount: 0,
    likedByMe: false,
    bookmarkedByMe: false,
    createdAt: '2026-11-05T15:40:00Z',
    updatedAt: null,
  },
  // ───── 102 · заказ (без срока и оплаты) ─────
  {
    id: 102,
    type: 'order',
    author: annaBrief,
    title: 'Вышить монограмму на льняной скатерти',
    description: 'Скатерть есть, нужно вышить две буквы «А» и «С» в углу. Условия обсудим в личке.',
    images: [img(137, 'tablecloth', 900, 600)],
    status: 'active',
    likesCount: 1,
    commentsCount: 0,
    likedByMe: false,
    bookmarkedByMe: false,
    createdAt: '2026-11-02T12:10:00Z',
    updatedAt: null,
    desiredDeadline: null,
    desiredPayment: null,
  },
  // ───── 101 · товар ─────
  {
    id: 101,
    type: 'product',
    author: marinaBrief,
    title: 'Амигуруми: заяц в свитере',
    description: 'Вязаная игрушка, высота 22 см, наполнитель холлофайбер. Безопасна для детей от 3 лет.',
    images: [img(138, 'bunny-1', 800, 800), img(139, 'bunny-2', 800, 800)],
    status: 'active',
    likesCount: 33,
    commentsCount: 8,
    likedByMe: false,
    bookmarkedByMe: true,
    createdAt: '2026-10-28T11:00:00Z',
    updatedAt: null,
    price: 1800,
    quantity: 2,
    inStock: true,
  },
];

// ── Публикации, которые лента не показывает, но они нужны в профиле ──

// archived: у товара quantity всегда 0. Виден в чужом профиле (GET /users/{id}/posts)
export const archivedPost = {
  id: 100,
  type: 'product',
  author: igorBrief,
  title: 'Кожаный ремень, ширина 3,5 см',
  description: 'Снят с продажи.',
  images: [img(140, 'belt', 800, 600)],
  status: 'archived',
  likesCount: 12,
  commentsCount: 2,
  likedByMe: false,
  bookmarkedByMe: false,
  createdAt: '2026-10-10T10:00:00Z',
  updatedAt: '2026-11-01T10:00:00Z',
  price: 3500,
  quantity: 0,
  inStock: false,
};

// draft: виден только автору (здесь это Анна, id = 1). Поля могут быть пустыми.
export const draftPost = {
  id: 115,
  type: 'idea',
  author: annaBrief,
  title: '',
  description: null,
  images: [],
  status: 'draft',
  likesCount: 0,
  commentsCount: 0,
  likedByMe: false,
  bookmarkedByMe: false,
  createdAt: '2026-11-21T08:00:00Z',
  updatedAt: null,
};

// ── Состояние лайка (ответ PUT/DELETE /posts/{id}/like) ──
export const likeState = { likedByMe: true, likesCount: 8 };

// ── Удобные выборки ──
export const bookmarkedPosts = posts.filter((p) => p.bookmarkedByMe); // для /users/me/bookmarks
export const postsByType = {
  idea: posts.filter((p) => p.type === 'idea'),
  order: posts.filter((p) => p.type === 'order'),
  product: posts.filter((p) => p.type === 'product'),
};
