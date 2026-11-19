package main

import (
	"backend/internal/config"
	"backend/internal/handler"
	"backend/internal/storage"
	"backend/internal/usecase"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Must()

	router := gin.Default()
	store := storage.New(nil, cfg) // nil - заглушка бд
	uc := usecase.New(store, cfg)

	handler.RegisterRoutes(router, uc, &cfg)
	if err := router.Run(cfg.Addr); err != nil {
		log.Fatalf("Не удалось запустить сервер: %v", err)
	}
}
