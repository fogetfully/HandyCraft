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
	Title string `json:"title" binding:"required,max=50"` // Title в теле запроса должен быть не пустой строкой
}

func RegisterRoutes(router *gin.Engine) {
	apiV1 := router.Group("/api/v1")

	auth := apiV1.Group("/auth")
	users := apiV1.Group("/users")
	posts := apiV1.Group("/posts")
	comments := apiV1.Group("/comments")
	dialogs := apiV1.Group("/dialogs")
	reviews := apiV1.Group("/reviews")

	//images := api.Group("/images")

	//router.GET("/health", health)
	//router.GET("/publications", listPublications)
	//router.GET("/publications/:id", publicationByID)
	//router.POST("/publications", createPublication)

	// Auth
	auth.POST("/register")               // Регистрация - Создаёт учётную запись и отправляет письмо со ссылкой подтверждения email. Вход невозможен до подтверждения.
	auth.POST("/verify-email")           // Подтверждение email по токену из письма
	auth.POST("/resend-verification")    // Повторная отправка письма подтверждения. Всегда отвечает 204, чтобы не раскрывать, есть ли такой email в системе.
	auth.POST("/login")                  // Вход - Возвращает короткоживущий access-токен в теле ответа [...]
	auth.POST("/refresh")                // Обновление access-токена - Использует cookie refreshToken, выдаёт новый access-токен и ротирует refresh-токен (старый становится недействительным).
	auth.POST("/logout")                 // Выход - Отзывает refresh-токен и очищает cookie.
	auth.POST("/password-reset")         // Запрос на восстановление пароля - Отправляет письмо со ссылкой на сброс. Всегда отвечает 204.
	auth.POST("/password-reset/confirm") // Установка нового пароля по токену из письма - После успеха все refresh-токены пользователя отзываются.

	// Users
	users.GET("/me")              // мой профиль
	users.PATCH("/me")            // редактирование своего профиля
	users.DELETE("/me")           // Удаление своего профиля - Каскадно удаляет публикации, диалоги и отзывы пользователя.
	users.GET("/me/bookmarks")    // Мои закладки
	users.GET("/:userId")         // Публичный профиль пользователя
	users.PATCH("/:userId")       // Редактирование полей пользователя (админ)
	users.DELETE("/:userId")      // Удаление пользователя (админ) - Каскадно удаляет его публикации, диалоги и отзывы.
	users.GET("/:userId/posts")   // Публикации пользователя - Чужие профили показывают публикации active и archived. Свои профили, и админу, ещё draft.
	users.GET("/:userId/reviews") // Отзывы о пользователе -Страница отзывов субъекта. В каждом отзыве есть название заказа или товара, текст и автор.

	// Images
	apiV1.POST("/images") // Загрузка изображения - Единственный способ загрузить файл. Возвращённый id затем указывается в avatarId, imageIds публикации или сообщения. Допустимые форматы: JPEG, PNG, WebP; не более 10 МБ. Изображения, не прикреплённые ни к чему в течение суток, удаляются сервером.

	// Posts
	posts.GET("")                     // Лента публикаций - Возвращает только публикации со статусом active, от новых к старым. Без фильтров отдаются все типы. Фильтр city сравнивается с городом автора публикации. Поиск по тексту появится в следующей версии.
	posts.POST("")                    // Создание публикации - Тип определяется полем type и после создания не меняется. status по умолчанию active. Для draft обязателен только type, остальные поля можно не заполнять. Для active обязательны title и, для товара, quantity.
	posts.GET("/:postId")             // публикация по Id - Черновик виден только автору и админу, остальным отвечает 404.
	posts.PATCH("/:postId")           // Редактирование публикации (автор или админ) - Частичное обновление. Тип менять нельзя. [...] -> [см. правила смены статуса]
	posts.DELETE("/:postId")          // Удаление публикации (автор или админ) - Каскадно удаляет комментарии, закладки, лайки и диалоги, связанные с публикацией.
	posts.PUT("/:postId/like")        // Поставить лайк - Идемпотентно, повторный вызов ничего не меняет.
	posts.DELETE("/:postId/like")     // Убрать лайк - Идемпотентно.
	posts.PUT("/:postId/bookmark")    // Добавить в закладки - Идемпотентно. В закладки можно добавить публикацию любого типа.
	posts.DELETE("/:postId/bookmark") // Убрать из закладок -

	// Comments
	posts.GET("/:postId/comments")  // Комментарии публикации - Без parentId возвращает комментарии верхнего уровня. С parentId возвращает прямые ответы на этот комментарий. Так строится дерево с любой глубиной: клиент подгружает ответы по repliesCount [...]
	posts.POST("/:postId/comments") // Оставить комментарий или ответ - Комментировать можно только публикации со статусом active и archived. Картинки в комментариях не поддерживаются.
	comments.PATCH("/:commentId")   // Редактирование комментария (автор или админ)
	comments.DELETE("/:commentId")  // Удаление комментария (автор или админ)

	// Dialogs
	posts.POST("/:postId/dialogs")        // Откликнуться на заказ или купить товар - Атомарно создаёт диалог и первое сообщение (сопроводительное). Для заказа это отклик мастера, для товара это покупка; для идеи вызов недопустим. [...] -> [см. условия]
	dialogs.GET("")                       // Мои диалоги - Сортировка по времени последней активности, от новых к старым.
	dialogs.GET("/:dialogId")             // Диалог по id
	dialogs.DELETE("/:dialogId")          // Удалить диалог - Может любой из участников. Диалог удаляется у обоих вместе с сообщениями.
	dialogs.GET("/:dialogId/messages")    // История сообщений - От новых к старым. Для подгрузки старых сообщений передаётся nextCursor предыдущей страницы.
	dialogs.POST("/:dialogId/messages")   // Отправить сообщение - Нужно хотя бы одно из content или imageIds. Собеседнику доставляется событие message.created по SSE.
	dialogs.POST("/:dialogId/read")       // Отметить сообщения прочитанными - Помечает прочитанными все сообщения собеседника с id не больше upToMessageId и пересчитывает unreadCount. [...]
	dialogs.POST("/:dialogId/completion") // Подтвердить завершение заказа или сделки - Подтверждение от своего имени, идемпотентно. [...]

	// Reviews
	users.GET(":userId/reviews")       // Отзывы о пользователе - Страница отзывов субъекта. В каждом отзыве есть название заказа или товара, текст и автор.
	dialogs.POST("/:dialogId/reviews") // Оставить отзыв собеседнику - Доступно участнику диалога после того, как диалог завершён обоими. Объект отзыва это собеседник. Один отзыв от каждого участника на один диалог (повтор даёт 409).
	reviews.PATCH("/:reviewId")        // редактирование отзыва (автор или админ)
	reviews.DELETE("/:reviewId")       // Удаление отзыва (автор или админ)

	// Realtime
	apiV1.GET("/events") // Поток событий реального времени (SSE) - Долгоживущее соединение text/event-stream. Одно соединение на вкладку, события только для текущего пользователя [...]
}

func health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func listPublications(c *gin.Context) {
	c.JSON(http.StatusOK, []gin.H{ // пока что моковые данные
		{"id": 1, "title": "деревянный стол"},
		{"id": 2, "title": "кружка"},
	})
}

func publicationByID(c *gin.Context) {
	id := c.Param("id")
	// mock
	switch id {
	case "1":
		c.JSON(http.StatusOK, gin.H{
			"id":    1,
			"title": "деревянный стол",
		})
	case "2":
		c.JSON(http.StatusOK, gin.H{
			"id":    2,
			"title": "кружка",
		})
	default:
		c.JSON(http.StatusNotFound, gin.H{
			"error": "publication not found",
		})
	}
}

func createPublication(c *gin.Context) {
	var request CreatePublicationRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid JSON",
		})
		return
	}
	// mock
	c.JSON(http.StatusCreated, gin.H{
		"id":    3,
		"title": request.Title,
	})
}
