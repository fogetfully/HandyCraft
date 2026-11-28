package main

import (
	"backend/internal/config"
	"backend/internal/handler"
	"backend/internal/storage"
	"backend/internal/usecase"
	"context"
	"errors"
	"log"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // Знак _ означает, что пакет подключается для регистрации драйвера: напрямую его функции мы не вызываем.
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	cfg := config.Must()
	if strings.TrimSpace(cfg.DatabaseURL) == "" {
		return errors.New("не задана переменная окружения DATABASE_URL")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	db, err := sqlx.ConnectContext(ctx, "postgres", cfg.DatabaseURL)
	cancel() // освобождаем ресурсы контекста, чтобы не было утечки памяти
	if err != nil {
		// Driver errors may contain credentials from the connection string.
		return errors.New("не удалось подключиться к PostgreSQL: проверьте DATABASE_URL и доступность базы")
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Print("не удалось закрыть подключение к PostgreSQL")
		}
	}()

	router := gin.Default()
	store := storage.New(db, cfg)
	uc := usecase.New(store, cfg)

	handler.RegisterRoutes(router, uc, &cfg)
	return router.Run(cfg.Addr)
}
