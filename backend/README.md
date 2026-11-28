# Локальный запуск HandyCraft

Нужен запущенный Docker Desktop с Linux-контейнерами. Из корня репозитория:

```powershell
docker compose up --build
```

Команда запускает PostgreSQL 17, применяет SQL-миграции, запускает Go backend
и frontend. При первом запуске Docker скачает образы и зависимости.

Порядок: `db healthy → migrate up (exit 0) → backend → frontend`.
Backend проверяет соединение с PostgreSQL перед запуском HTTP-сервера.
Если миграция завершилась с ошибкой, новый контейнер backend не запускается.
При повторном запуске применённые миграции пропускаются по таблице
`schema_migrations`; сообщение `no change` нормально.

- Frontend: http://localhost:5173
- API: http://localhost:8080/api/v1/posts
- PostgreSQL для IDE: `localhost:5432`, база `handycraft`, пользователь
  `handycraft`, пароль `handycraft_dev`.

Эти учётные данные предназначены только для локальной разработки.
Порты опубликованы только на `127.0.0.1`. Внутри Compose backend подключается
к `db:5432`, а frontend пересылает `/api` на `backend:8080`.
Подключение БД не заменяет существующие заглушки API рабочими обработчиками.

Если порт занят, перед запуском задайте другое значение в PowerShell:

```powershell
$env:POSTGRES_PORT = '5433'
# При необходимости также BACKEND_PORT и FRONTEND_PORT.
docker compose up --build
```

## Остановка и сохранение данных

Для фонового запуска используйте `docker compose up --build -d`.
Остановить и удалить контейнеры, сохранив базу:

```powershell
docker compose down
```

Данные находятся в именованном Docker-томе `postgres_data` этого Compose-проекта
и сохраняются после `down` и повторного `up`. Только если нужно намеренно
стереть всю локальную базу, используйте `docker compose down --volumes`.

## Диагностика и проверка

```powershell
docker compose ps -a
docker compose logs migrate backend
docker compose run --rm migrate version
```

Контейнер `migrate` со статусом `Exited (0)` — ожидаемый результат:
он выполняет миграции и заканчивает работу. Для новой базы ожидается версия 1
без признака `dirty`. Применённую миграцию не редактируйте: добавляйте следующий
номер. Не исправляйте ошибки миграции слепым `force` или удалением тома с данными.

Автоматическая проверка всего запуска, из корня репозитория:

```powershell
./backend/scripts/test-local-startup.ps1
```

Она использует отдельный Compose-проект и свободные порты, проверяет API напрямую
и через frontend, версию миграции и сохранение записи после `down → up`.
В конце удаляет только свой тестовый проект и его том.
Проверка самих миграций `up/down/up`: `./backend/scripts/test-migrations.ps1`.

## Запуск Go без контейнера

Сначала из корня проекта подготовьте базу и миграции:

```powershell
docker compose up -d db
docker compose run --rm migrate up
```

Затем из каталога `backend` (контейнер backend на порту 8080 должен быть остановлен):

```powershell
$env:DATABASE_URL = 'postgres://handycraft:handycraft_dev@localhost:5432/handycraft?sslmode=disable'
go run ./cmd/app
```

Если меняли POSTGRES_PORT, укажите его в DATABASE_URL. Приложение не читает `.env`
автоматически. При отсутствии DATABASE_URL или недоступности базы оно завершится
с ошибкой; на подключение отводится 5 секунд. Строка подключения не выводится
в журнал. Подробности схемы и отката: [миграции](migrations/README.md).
