// написан полностью иишкой
package main

import (
	"strings"
	"testing"
)

func TestRunRequiresDatabaseURL(t *testing.T) {
	t.Setenv("DATABASE_URL", "   ")
	err := run()
	if err == nil || err.Error() != "не задана переменная окружения DATABASE_URL" {
		t.Fatalf("expected missing DATABASE_URL error, got %v", err)
	}
}

func TestRunRejectsInvalidDatabaseURLWithoutLeakingCredentials(t *testing.T) {
	const secret = "test-password-must-not-appear"
	t.Setenv("DATABASE_URL", "postgres://user:"+secret+"@localhost:invalid/handycraft")
	err := run()
	if err == nil {
		t.Fatal("expected invalid connection string to stop startup")
	}
	if strings.Contains(err.Error(), secret) {
		t.Fatal("startup error contains database credentials")
	}
	if !strings.Contains(err.Error(), "PostgreSQL") {
		t.Fatalf("expected database connection error, got %v", err)
	}
}
