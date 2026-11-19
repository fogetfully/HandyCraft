package usecase

import (
	"backend/internal/config"
	"backend/internal/storage"
)

type Usecase struct {
	store *storage.Storage
	cfg   config.Config
}

// New создаёт готовый экземпляр структуры Usecase
func New(store *storage.Storage, cfg config.Config) *Usecase {
	return &Usecase{
		store: store,
		cfg:   cfg,
	}
}

//func (u *Usecase) listPublication(ctx context.Context) {
//	//
//}
//
//func (u *Usecase) publicationByID(ctx context.Context) {
//
//}
