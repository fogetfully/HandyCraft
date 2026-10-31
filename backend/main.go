package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
	"sync"
)

type Message struct {
	ID   int    `json:"id"`
	Text string `json:"text"`
}

type messageStore struct {
	mu       sync.RWMutex
	messages []Message
	nextID   int
}

func (s *messageStore) list() []Message {
	s.mu.RLock()
	defer s.mu.RUnlock()

	messages := make([]Message, len(s.messages))
	copy(messages, s.messages)
	return messages
}

func (s *messageStore) add(text string) Message {
	s.mu.Lock()
	defer s.mu.Unlock()

	message := Message{ID: s.nextID, Text: text}
	s.messages = append(s.messages, message)
	s.nextID++
	return message
}

func (s *messageStore) handler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, s.list())
	case http.MethodPost:
		var request struct {
			Text string `json:"text"`
		}
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, "invalid JSON", http.StatusBadRequest)
			return
		}

		request.Text = strings.TrimSpace(request.Text)
		if request.Text == "" {
			http.Error(w, "text must not be empty", http.StatusBadRequest)
			return
		}

		writeJSON(w, http.StatusCreated, s.add(request.Text))
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(value); err != nil {
		log.Printf("writing JSON response: %v", err)
	}
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		}
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		next.ServeHTTP(w, r)
	})
}

func newServer() *http.Server {
	store := &messageStore{nextID: 1}
	mux := http.NewServeMux()
	mux.HandleFunc("/api/messages", store.handler)
	return &http.Server{
		Addr:    ":8080",
		Handler: withCORS(mux),
	}
}

func main() {
	server := newServer()
	log.Printf("backend listening on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
}