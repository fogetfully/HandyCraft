package main

import (
	"backend/internal/config"
	"backend/internal/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	cfg := config.Must()
	handler.RegisterRoutes(router)
	err := router.Run(cfg.Addr)
	if err != nil {
		return
	}
}
