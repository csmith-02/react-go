package auth

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("my-jwt-secret")

type Claims struct {
	Email    string `json:"email"`
	FullName string `json:"fullName"`
	jwt.RegisteredClaims
}

func ValidateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")

		if len(authHeader) == 0 {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		if !strings.Contains(authHeader, "Bearer ") {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		tokenString := strings.Split(r.Header.Get("Authorization"), "Bearer ")[1]

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {

			if _, ok := t.Method.(*jwt.SigningMethodHMAC); ok {
				return jwtSecret, nil
			}

			return nil, fmt.Errorf("Unexpected Signing Method")
		})

		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		if !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"message":"Token is not valid"}`))
			return
		}

		next.ServeHTTP(w, r)
	})
}

func CreateJWT(email string, fullName string) (string, error) {

	exp := time.Now().Add(time.Minute * 30)

	claims := &Claims{
		Email:    email,
		FullName: fullName,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(exp),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
