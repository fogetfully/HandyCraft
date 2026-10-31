import { useEffect, useState } from 'react';

// Интерфейс один-в-один повторяет структуру Message из Go (с учетом json-тегов)
interface Message {
  id: number;
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const API_URL = 'http://localhost:8080/api/messages';

  // 1. Получаем данные с Go-бэкенда (GET)
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: Message[]) => setMessages(data))
      .catch((err) => console.error('Ошибка загрузки:', err));
  }, []);

  // 2. Отправляем данные на Go-бэкенд (POST)
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (response.ok) {
        const createdMessage: Message = await response.json();
        setMessages((prev) => [...prev, createdMessage]);
        setInputText('');
      }
    } catch (err) {
      console.error('Ошибка отправки:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Тест связки React (TS) + Go</h2>

      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>#{msg.id}:</strong> {msg.text}
          </li>
        ))}
      </ul>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Напиши что-нибудь для Go..."
        />
        <button type="submit">Отправить на бэк</button>
      </form>
    </div>
  );
}

export default App;