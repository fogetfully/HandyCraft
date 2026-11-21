import { messages, dialog, dialogCompleted } from './dialogs.js';
import { annaBrief } from './users.js';

// Содержимое поля `data` для SSE-событий GET /events.
// Удобно для проверки обработчиков: eventHandlers[type](JSON.parse(data)).
export const sseEvents = {
  'message.created': { dialogId: 9001, message: messages[0], unreadCount: 2 },
  'messages.read': { dialogId: 9001, readerId: annaBrief.id, upToMessageId: 7011 },
  'dialog.created': { dialog },
  'dialog.updated': { dialog: dialogCompleted },
  'dialog.deleted': { dialogId: 9001 },
};
