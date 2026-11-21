import { img } from './helpers.js';
import { annaBrief, marinaBrief } from './users.js';

// Одна переписка: Анна (я, заказчик) ↔ Марина (мастер) по заказу 104 «Свитер для таксы».
// Сценарий: Марина откликнулась, согласовали детали, прислала результат, отправила посылку.
// Марина уже подтвердила завершение, ждёт подтверждения от Анны → есть непрочитанные
// сообщения, кнопка «Подтвердить» активна, форма отзыва пока закрыта.

const DIALOG_ID = 9001;
const base = { dialogId: DIALOG_ID };

// GET /dialogs/9001/messages — от НОВЫХ к СТАРЫМ (как отдаёт бек)
export const messages = [
  {
    ...base, id: 7011, sender: marinaBrief,
    content: 'Буду очень благодарна за отзыв о работе 🙏',
    images: [], isRead: false, createdAt: '2026-11-21T08:31:00Z',
  },
  {
    ...base, id: 7010, sender: marinaBrief,
    content: 'Рада, что подошло! Подтвердите, пожалуйста, завершение заказа 🙂',
    images: [], isRead: false, createdAt: '2026-11-21T08:30:00Z',
  },
  {
    ...base, id: 7009, sender: annaBrief,
    content: 'Получили! Сидит идеально, Бублик в восторге 🐕',
    images: [img(206, 'dog-wearing-sweater', 800, 1000)], isRead: true, createdAt: '2026-11-20T15:12:00Z',
  },
  {
    ...base, id: 7008, sender: marinaBrief,
    content: 'Готово! Отправила СДЭКом, трек: 1234567890.',
    images: [], isRead: true, createdAt: '2026-11-18T10:05:00Z',
  },
  {
    ...base, id: 7007, sender: annaBrief,
    content: 'Очень красиво! Рукава можно сделать чуть длиннее?',
    images: [], isRead: true, createdAt: '2026-11-15T18:00:00Z',
  },
  {
    ...base, id: 7006, sender: marinaBrief,
    content: 'Промежуточный результат, как вам?',
    images: [img(204, 'work-in-progress-1', 800, 800), img(205, 'work-in-progress-2', 800, 800)],
    isRead: true, createdAt: '2026-11-15T17:20:00Z',
  },
  {
    ...base, id: 7005, sender: marinaBrief,
    content: 'Договорились, 3500 как в заказе. Начинаю.',
    images: [], isRead: true, createdAt: '2026-11-08T13:40:00Z',
  },
  {
    ...base, id: 7004, sender: annaBrief,
    content: 'Горчичный, с белой полосой. Вот мой красавец:',
    images: [img(203, 'dachshund', 800, 600)], isRead: true, createdAt: '2026-11-08T13:15:00Z',
  },
  {
    ...base, id: 7003, sender: marinaBrief,
    content: 'Мерки записала. А какой цвет хотите?',
    images: [], isRead: true, createdAt: '2026-11-08T13:10:00Z',
  },
  {
    ...base, id: 7002, sender: annaBrief,
    content: 'Здравствуйте, Марина! Да, пришлите, пожалуйста. Мерки: холка 25 см, длина спины 38, грудь 44.',
    images: [], isRead: true, createdAt: '2026-11-08T13:02:00Z',
  },
  {
    // Первое сообщение, оно же сопроводительное при отклике (POST /posts/104/dialogs)
    ...base, id: 7001, sender: marinaBrief,
    content:
      'Здравствуйте! Свяжу свитер из мериноса, опыт с одеждой для собак есть. Срок — около недели. Примеры работ прикрепила.',
    images: [img(201, 'my-work-1', 800, 800), img(202, 'my-work-2', 800, 800)],
    isRead: true, createdAt: '2026-11-08T12:30:00Z',
  },
];

export const messagesPage = { items: messages, nextCursor: null };

// GET /dialogs/9001 и элемент GET /dialogs
export const dialog = {
  id: DIALOG_ID,
  post: { id: 104, type: 'order', title: 'Свитер для таксы, горчичный цвет' },
  peer: marinaBrief,
  myRole: 'customer', // я автор заказа → customer; Марина → master
  lastMessage: messages[0],
  unreadCount: 2, // 7010 и 7011
  completion: { confirmedByMe: false, confirmedByPeer: true, completed: false },
  createdAt: '2026-11-08T12:30:00Z',
  lastActivityAt: '2026-11-21T08:31:00Z',
};

// GET /dialogs
export const dialogsPage = { items: [dialog], nextCursor: null };

// Ответ на POST /dialogs/9001/read
export const readResponse = { unreadCount: 0 };

// Ответ на POST /dialogs/9001/completion после моего подтверждения → открываются отзывы
export const dialogCompleted = {
  ...dialog,
  unreadCount: 0,
  completion: { confirmedByMe: true, confirmedByPeer: true, completed: true },
};
