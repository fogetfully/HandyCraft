package storage

import (
	"backend/internal/config"

	"github.com/jmoiron/sqlx"
)

type Storage struct {
	db  *sqlx.DB
	cfg config.Config
}

func New(db *sqlx.DB, cfg config.Config) *Storage {
	return &Storage{
		db:  db,
		cfg: cfg,
	}
}
