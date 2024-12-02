package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"react-go/backend/auth"
	"react-go/backend/middleware"

	_ "github.com/mattn/go-sqlite3"
)

type User struct {
	FullName string `json:"fullName,omitempty"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type NewUser struct {
	FullName        string `json:"fullName"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
}

var db *sql.DB

func main() {

	var err error
	db, err = sql.Open("sqlite3", "./db.file")
	if err != nil {
		log.Panic(err)
	}
	defer db.Close()

	db.Exec(`CREATE TABLE IF NOT EXISTS users (
		fullName VARCHAR(255) NOT NULL,
		email VARCHAR(255) UNIQUE,
		password VARCHAR(255) NOT NULL
	);`)

	mux := http.NewServeMux()

	/* Routes */

	mux.HandleFunc("POST /login", loginHandler)

	mux.HandleFunc("POST /signup", signupHandler)

	mux.Handle("GET /protected", auth.ValidateJWT(http.HandlerFunc(protected)))

	/******************************************************/

	log.Println("Server is running on port 8080...")
	http.ListenAndServe(":8080", middleware.EnableCors(mux))
}

func protected(w http.ResponseWriter, r *http.Request) {

}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Get email and password out of request body

	var user User
	json.Unmarshal(body, &user)

	if len(user.Email) == 0 || len(user.Password) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{ "status":"Missing Fields. Please ensure the request body matches the needed format." }`))
		return
	}

	// Query DB for an existing user with email and password

	// Note: Only need fullName because email and password is already in user struct for if rows.Next() returns true
	rows, err := db.Query("SELECT fullName FROM users WHERE email= ? AND password= ?", user.Email, user.Password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	defer rows.Close()

	w.Header().Set("Content-Type", "application/json")

	if rows.Next() {

		e := rows.Scan(&user.FullName)

		if e != nil {
			log.Fatal(e.Error())
		}

		// User exists with given email and password, so create JWT, Sign it with Claims, and send it back as JSON
		tokenString, err := auth.CreateJWT(user.Email, user.FullName)
		if err != nil {
			log.Fatal(err.Error())
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(fmt.Sprintf(`{"token":"%s","fullName":"%s","email":"%s"}`, tokenString, user.FullName, user.Email)))
		return
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status":"Invalid Credentials"}`))
	}
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	// Get Name, Email, Password, out of request body

	body, err := io.ReadAll(r.Body)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var newUser NewUser

	json.Unmarshal(body, &newUser)

	if len(newUser.Email) == 0 || len(newUser.FullName) == 0 || len(newUser.Password) == 0 || len(newUser.ConfirmPassword) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"status":"Missing Fields. Please ensure the request body matches the needed format."}`))
		return
	}

	if newUser.Password != newUser.ConfirmPassword {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"status":"Passwords do not match."}`))
		return
	}

	// Check if user exists in DB with same email
	rows, err := db.Query("SELECT * FROM users WHERE email= ?", newUser.Email)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status":"Internal Server Error, Fasho"}`))
		return
	}

	if rows.Next() {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"status":"A user with that email already exists."}`))
		return
	}

	// Create a new User
	result, err := db.Exec(fmt.Sprintf(`INSERT INTO users (fullName, email, password) VALUES ('%s','%s','%s');`, newUser.FullName, newUser.Email, newUser.Password))

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status":"Internal Server Error: Database could not insert new user"}`))
		return
	}

	if affected, _ := result.RowsAffected(); affected == 1 {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"success"}`))
	} else {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status":"Something went wrong."}`))
	}

}
