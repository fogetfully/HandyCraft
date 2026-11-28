package storage

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/jmoiron/sqlx"
)

var (
	ErrDialogNotFound       = errors.New("dialog not found")
	ErrPostNotFound         = errors.New("post not found")
	ErrDialogAlreadyExists  = errors.New("dialog already exists")
	ErrNotDialogParticipant = errors.New("user is not dialog participant")
	ErrCannotCreateDialog   = errors.New("dialog cannot be created")
)

type Dialog struct {
	DialogID           int64         `db:"DialogID"`
	PostID             int64         `db:"PostID"`
	InitiatorID        int64         `db:"InitiatorID"`
	AuthorConfirmed    bool          `db:"AuthorConfirmed"`
	InitiatorConfirmed bool          `db:"InitiatorConfirmed"`
	UnreadCount        int64         `db:"UnreadCount"`
	LastMessageID      sql.NullInt64 `db:"LastMessageID"`
	LastActivityAt     time.Time     `db:"LastActivityAt"`
	CreatedAt          time.Time     `db:"created"`
}

type CreateDialogInput struct {
	PostID  int64
	UserID  int64
	Content string
}

type postDialogInfo struct {
	AuthorID int64
	PostType string
	Status   string
}

func (s *Storage) CreateDialog(
	ctx context.Context,
	input CreateDialogInput,
) (*Dialog, error) {
	tx, err := s.db.BeginTxx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	var post postDialogInfo
	err = tx.GetContext(ctx, &post, `
        SELECT "AuthorID", "Type", "Status"
        FROM "Posts"
        WHERE "PostID" = $1
          AND "deleted" IS NULL
    `, input.PostID)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrPostNotFound
	}
	if err != nil {
		return nil, err
	}

	if post.AuthorID == input.UserID {
		return nil, ErrCannotCreateDialog
	}

	if post.Status != "active" {
		return nil, ErrCannotCreateDialog
	}

	if post.PostType != "order" && post.PostType != "product" {
		return nil, ErrCannotCreateDialog
	}

	var dialogID int64
	err = tx.GetContext(ctx, &dialogID, `
        SELECT "DialogID"
        FROM "Dialogs"
        WHERE "PostID" = $1
          AND "InitiatorID" = $2
          AND "deleted" IS NULL
    `, input.PostID, input.UserID)

	if err == nil {
		return nil, ErrDialogAlreadyExists
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	err = tx.GetContext(ctx, &dialogID, `
        INSERT INTO "Dialogs" (
            "PostID",
            "InitiatorID",
            "AuthorUnreadCount",
            "InitiatorUnreadCount",
            "LastActivityAt",
            "created",
            "updated"
        )
        VALUES ($1, $2, 1, 0, NOW(), NOW(), NOW())
        RETURNING "DialogID"
    `, input.PostID, input.UserID)
	if err != nil {
		return nil, err
	}

	var messageID int64
	err = tx.GetContext(ctx, &messageID, `
        INSERT INTO "Messages" (
            "DialogID",
            "SenderID",
            "Content",
            "IsRead",
            "created",
            "updated"
        )
        VALUES ($1, $2, NULLIF($3, ''), FALSE, NOW(), NOW())
        RETURNING "MessageID"
    `, dialogID, input.UserID, input.Content)
	if err != nil {
		return nil, err
	}

	_, err = tx.ExecContext(ctx, `
        UPDATE "Dialogs"
        SET "LastMessageID" = $1,
            "LastActivityAt" = NOW(),
            "updated" = NOW()
        WHERE "DialogID" = $2
    `, messageID, dialogID)
	if err != nil {
		return nil, err
	}

	if err = tx.Commit(); err != nil {
		return nil, err
	}

	return s.GetDialog(ctx, dialogID, input.UserID)
}

func (s *Storage) ListDialogs(
	ctx context.Context,
	userID int64,
) ([]Dialog, error) {
	var dialogs []Dialog

	err := s.db.SelectContext(ctx, &dialogs, `
        SELECT
            d."DialogID",
            d."PostID",
            d."InitiatorID",
            d."AuthorConfirmed",
            d."InitiatorConfirmed",
            d."LastMessageID",
            d."LastActivityAt",
            d."created",
            CASE
                WHEN p."AuthorID" = $1 THEN d."AuthorUnreadCount"
                ELSE d."InitiatorUnreadCount"
            END AS "UnreadCount"
        FROM "Dialogs" d
        JOIN "Posts" p ON p."PostID" = d."PostID"
        WHERE d."deleted" IS NULL
          AND (p."AuthorID" = $1 OR d."InitiatorID" = $1)
        ORDER BY d."LastActivityAt" DESC
    `, userID)

	if err != nil {
		return nil, err
	}

	return dialogs, nil
}

func (s *Storage) GetDialog(
	ctx context.Context,
	dialogID int64,
	userID int64,
) (*Dialog, error) {
	var dialog Dialog

	err := s.db.GetContext(ctx, &dialog, `
        SELECT
            d."DialogID",
            d."PostID",
            d."InitiatorID",
            d."AuthorConfirmed",
            d."InitiatorConfirmed",
            d."LastMessageID",
            d."LastActivityAt",
            d."created",
            CASE
                WHEN p."AuthorID" = $2 THEN d."AuthorUnreadCount"
                ELSE d."InitiatorUnreadCount"
            END AS "UnreadCount"
        FROM "Dialogs" d
        JOIN "Posts" p ON p."PostID" = d."PostID"
        WHERE d."DialogID" = $1
          AND d."deleted" IS NULL
          AND (p."AuthorID" = $2 OR d."InitiatorID" = $2)
    `, dialogID, userID)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrDialogNotFound
	}
	if err != nil {
		return nil, err
	}

	return &dialog, nil
}

func (s *Storage) DeleteDialog(
	ctx context.Context,
	dialogID int64,
	userID int64,
) error {
	tx, err := s.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	result, err := tx.ExecContext(ctx, `
        UPDATE "Dialogs" d
        SET "deleted" = NOW(),
            "updated" = NOW()
        FROM "Posts" p
        WHERE d."PostID" = p."PostID"
          AND d."DialogID" = $1
          AND d."deleted" IS NULL
          AND (p."AuthorID" = $2 OR d."InitiatorID" = $2)
    `, dialogID, userID)
	if err != nil {
		return err
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return ErrDialogNotFound
	}

	_, err = tx.ExecContext(ctx, `
        UPDATE "Messages"
        SET "deleted" = NOW(),
            "updated" = NOW()
        WHERE "DialogID" = $1
          AND "deleted" IS NULL
    `, dialogID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (s *Storage) isDialogParticipant(
	ctx context.Context,
	db sqlx.QueryerContext,
	dialogID int64,
	userID int64,
) (bool, error) {
	var exists bool

	err := db.QueryRowxContext(ctx, `
        SELECT EXISTS (
            SELECT 1
            FROM "Dialogs" d
            JOIN "Posts" p ON p."PostID" = d."PostID"
            WHERE d."DialogID" = $1
              AND d."deleted" IS NULL
              AND (p."AuthorID" = $2 OR d."InitiatorID" = $2)
        )
    `, dialogID, userID).Scan(&exists)

	return exists, err
}
