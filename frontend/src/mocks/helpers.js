// Картинки-заглушки: picsum.photos отдаёт стабильное фото по seed.
// Когда бек заработает, URL просто заменятся на настоящие.
export const img = (id, seed, width = 800, height = 600) => ({
  id,
  url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
  width,
  height,
});

// UserBrief — краткая карточка автора, которая вкладывается в посты, комментарии, сообщения
export const toBrief = ({ id, name, avatar }) => ({ id, name, avatar });
