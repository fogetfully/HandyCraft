package handler

import (
	"backend/internal/config"
	"backend/internal/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	uc  *usecase.Usecase
	cfg *config.Config
}

type CreatePublicationRequest struct {
	Type   string `json:"type" binding:"required,oneof=idea order product"`
	Status string `json:"status" binding:"omitempty,oneof=draft active"`
	Title  string `json:"title" binding:"omitempty,max=100"`
}

// notImplemented - заглушка для необъявленных обработчиков роутов
func notImplemented(c *gin.Context) {
	c.Status(http.StatusNotImplemented)
}

func RegisterRoutes(
	router *gin.Engine,
	uc *usecase.Usecase,
	cfg *config.Config,
) {
	h := &Handler{
		uc:  uc,
		cfg: cfg,
	}

	// версии API. можем добавть сколько угодно, затем нужную версию сделать активной через apiVersion := нужная версия
	apiV1 := router.Group("/api/v1") // v1 - версия API

	// активная версия API (к ней привязываются все роуты)
	apiVersion := apiV1 // здесь можно поменять версию на нужную, чтобы у каждого роута не менять версию отдельно

	// группы роутов
	auth := apiVersion.Group("/auth")
	users := apiVersion.Group("/users")
	posts := apiVersion.Group("/posts")
	comments := apiVersion.Group("/comments")
	dialogs := apiVersion.Group("/dialogs")
	reviews := apiVersion.Group("/reviews")
	//images := api.Group("/images")

	// Routes - подробные описание каждого смотри в контракте
	// Auth
	auth.POST("/register", notImplemented)               // Регистрация - Создаёт учётную запись и отправляет письмо со ссылкой подтверждения email. Вход невозможен до подтверждения.
	auth.POST("/verify-email", notImplemented)           // Подтверждение email по токену из письма
	auth.POST("/resend-verification", notImplemented)    // Повторная отправка письма подтверждения. Всегда отвечает 204, чтобы не раскрывать, есть ли такой email в системе.
	auth.POST("/login", notImplemented)                  // Вход - Возвращает короткоживущий access-токен в теле ответа [...]
	auth.POST("/refresh", notImplemented)                // Обновление access-токена - Использует cookie refreshToken, выдаёт новый access-токен и ротирует refresh-токен (старый становится недействительным).
	auth.POST("/logout", notImplemented)                 // Выход - Отзывает refresh-токен и очищает cookie.
	auth.POST("/password-reset", notImplemented)         // Запрос на восстановление пароля - Отправляет письмо со ссылкой на сброс. Всегда отвечает 204.
	auth.POST("/password-reset/confirm", notImplemented) // Установка нового пароля по токену из письма - После успеха все refresh-токены пользователя отзываются.

	// Users
	users.GET("/me", notImplemented)            // мой профиль
	users.PATCH("/me", notImplemented)          // редактирование своего профиля
	users.DELETE("/me", notImplemented)         // Удаление своего профиля - Каскадно удаляет публикации, диалоги и отзывы пользователя.
	users.GET("/me/bookmarks", notImplemented)  // Мои закладки
	users.GET("/:userId", notImplemented)       // Публичный профиль пользователя
	users.PATCH("/:userId", notImplemented)     // Редактирование полей пользователя (админ)
	users.DELETE("/:userId", notImplemented)    // Удаление пользователя (админ) - Каскадно удаляет его публикации, диалоги и отзывы.
	users.GET("/:userId/posts", notImplemented) // Публикации пользователя - Чужие профили показывают публикации active и archived. Свои профили, и админу, ещё draft.
	// GET /users/{userID}/reviews - роут в группе Reviews

	// Images
	apiVersion.POST("/images", notImplemented) // Загрузка изображения - Единственный способ загрузить файл. Возвращённый id затем указывается в avatarId, imageIds публикации или сообщения. Допустимые форматы: JPEG, PNG, WebP; не более 10 МБ. Изображения, не прикреплённые ни к чему в течение суток, удаляются сервером.

	// Posts
	posts.GET("", h.listPublications)
	posts.POST("", h.createPublication)
	posts.GET("/:postId", h.publicationByID)
	posts.PATCH("/:postId", notImplemented)           // Редактирование публикации (автор или админ) - Частичное обновление. Тип менять нельзя. [...] -> [см. правила смены статуса]
	posts.DELETE("/:postId", notImplemented)          // Удаление публикации (автор или админ) - Каскадно удаляет комментарии, закладки, лайки и диалоги, связанные с публикацией.
	posts.PUT("/:postId/like", notImplemented)        // Поставить лайк - Идемпотентно, повторный вызов ничего не меняет.
	posts.DELETE("/:postId/like", notImplemented)     // Убрать лайк - Идемпотентно.
	posts.PUT("/:postId/bookmark", notImplemented)    // Добавить в закладки - Идемпотентно. В закладки можно добавить публикацию любого типа.
	posts.DELETE("/:postId/bookmark", notImplemented) // Убрать из закладок -

	// Comments
	posts.GET("/:postId/comments", notImplemented)  // Комментарии публикации - Без parentId возвращает комментарии верхнего уровня. С parentId возвращает прямые ответы на этот комментарий. Так строится дерево с любой глубиной: клиент подгружает ответы по repliesCount [...]
	posts.POST("/:postId/comments", notImplemented) // Оставить комментарий или ответ - Комментировать можно только публикации со статусом active и archived. Картинки в комментариях не поддерживаются.
	comments.PATCH("/:commentId", notImplemented)   // Редактирование комментария (автор или админ)
	comments.DELETE("/:commentId", notImplemented)  // Удаление комментария (автор или админ)

	// Dialogs
	posts.POST("/:postId/dialogs", notImplemented)        // Откликнуться на заказ или купить товар - Атомарно создаёт диалог и первое сообщение (сопроводительное). Для заказа это отклик мастера, для товара это покупка; для идеи вызов недопустим. [...] -> [см. условия]
	dialogs.GET("", notImplemented)                       // Мои диалоги - Сортировка по времени последней активности, от новых к старым.
	dialogs.GET("/:dialogId", notImplemented)             // Диалог по id
	dialogs.DELETE("/:dialogId", notImplemented)          // Удалить диалог - Может любой из участников. Диалог удаляется у обоих вместе с сообщениями.
	dialogs.GET("/:dialogId/messages", notImplemented)    // История сообщений - От новых к старым. Для подгрузки старых сообщений передаётся nextCursor предыдущей страницы.
	dialogs.POST("/:dialogId/messages", notImplemented)   // Отправить сообщение - Нужно хотя бы одно из content или imageIds. Собеседнику доставляется событие message.created по SSE.
	dialogs.POST("/:dialogId/read", notImplemented)       // Отметить сообщения прочитанными - Помечает прочитанными все сообщения собеседника с id не больше upToMessageId и пересчитывает unreadCount. [...]
	dialogs.POST("/:dialogId/completion", notImplemented) // Подтвердить завершение заказа или сделки - Подтверждение от своего имени, идемпотентно. [...]

	// Reviews
	users.GET("/:userId/reviews", notImplemented)      // Отзывы о пользователе - Страница отзывов субъекта. В каждом отзыве есть название заказа или товара, текст и автор.
	dialogs.POST("/:dialogId/reviews", notImplemented) // Оставить отзыв собеседнику - Доступно участнику диалога после того, как диалог завершён обоими. Объект отзыва это собеседник. Один отзыв от каждого участника на один диалог (повтор даёт 409).
	reviews.PATCH("/:reviewId", notImplemented)        // редактирование отзыва (автор или админ)
	reviews.DELETE("/:reviewId", notImplemented)       // Удаление отзыва (автор или админ)

	// Realtime
	apiVersion.GET("/events", notImplemented) // Поток событий реального времени (SSE) - Долгоживущее соединение text/event-stream. Одно соединение на вкладку, события только для текущего пользователя [...]
}

// health - состояние сервиса
//func health(c *gin.Context) {
//	c.JSON(http.StatusOK, gin.H{"status": "ok"})
//}

// Posts
// listPublications - лента публикаций - возвращает только публикации со статусом active, от новых к старым. Без фильтров отдаются все типы. Фильтр city сравнивается с городом автора публикации.
// Добавить: проверка на active, стандартная сортировка по дате, фильтры
func (h *Handler) listPublications(c *gin.Context) {
	// mock
	c.JSON(http.StatusOK, gin.H{
		"items": []gin.H{
			{
				"id":   1,
				"type": "idea",
				"author": gin.H{
					"id":   1,
					"name": "Иван",
				},
				"title":         "Деревянный стол",
				"status":        "active",
				"images":        []gin.H{},
				"likesCount":    0,
				"commentsCount": 0,
				"createdAt":     "2026-11-19T10:00:00Z",
			},
		},
		"nextCursor": nil,
	})
}

// publicationByID - публикация по Id - черновик виден только автору и админу, остальным отвечает 404.
// Добавить: проверка статуса публикации и реализация под каждую роль
func (h *Handler) publicationByID(c *gin.Context) {
	id := c.Param("postId")
	// mock
	if id != "1" {
		c.Header("Content-Type", "application/problem+json")
		c.JSON(http.StatusNotFound, gin.H{
			"title":  "Публикация не найдена",
			"status": http.StatusNotFound,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":   1,
		"type": "idea",
		"author": gin.H{
			"id":   1,
			"name": "Иван",
		},
		"title":         "Деревянный стол",
		"status":        "active",
		"images":        []gin.H{},
		"likesCount":    0,
		"commentsCount": 0,
		"createdAt":     "2026-11-19T10:00:00Z",
	})
}

// createPublication - создание публикации - тип определяется полем type и после создания не меняется. Поле status по умолчанию active. Для draft обязателен только type, остальные поля можно не заполнять. Для active обязательны title и, для товара, quantity.
// Реализовать вышенаписанное.
func (h *Handler) createPublication(c *gin.Context) {
	// mock
	var request CreatePublicationRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid JSON",
		})
		return
	}
	if request.Status == "" {
		request.Status = "active"
	}

	if request.Status == "active" && request.Title == "" {
		c.Header("Content-Type", "application/problem+json")
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"title":  "Для активной публикации обязательно название",
			"status": http.StatusUnprocessableEntity,
		})
		return
	}

	// mock
	c.JSON(http.StatusCreated, gin.H{
		"id":    2,
		"title": request.Title,
	})
}
