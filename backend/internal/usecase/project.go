package usecase

import (
	"backend/internal/config"
	"backend/internal/storage"
)

type Usecase struct {
	store *storage.Storage
	cfg   config.Config
}

func New(store *storage.Storage, cfg config.Config) *Usecase {
	return &Usecase{
		store: store,
		cfg:   cfg,
	}
}
