package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreatePublicationRequest struct {
	Title string `json:"title" binding:"required"` // Title в теле запроса должен быть не пустой строкой
}

func RegisterRoutes(router *gin.Engine) {
	router.GET("/health", health)
	router.GET("/publications", listPublications)
	router.GET("/publications/:id", publicationByID)
	router.POST("/publications", createPublication)
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
