// Конфигурация сервера

package config

import "os"

type Config struct {
	Addr        string
	DatabaseURL string
}

func Must() Config {
	//addr := os.Getenv("HTTP_ADDR")
	//if addr == "" {
	//	addr = ":8080"
	//}
	addr := ":8080" // 8080 - порт backend, 3000 - frontend

	databaseURL := os.Getenv("DATABASE_URL")

	return Config{
		Addr:        addr,
		DatabaseURL: databaseURL,
	}
}
