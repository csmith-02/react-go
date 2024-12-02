# <u>Overview</u>

<hr/>

## Stack

### Frontend
- React
- Tailwind CSS
- Typescript

### Backend
- Golang
- SQLite

### Authentication
- JWT (JSON Web Tokens)

<hr/>

### Description

This user authentication system functions by the React frontend initially sending a request to the go server on login/signup. In the case of a signup request, <br>
the user sends a request to insert a new user into the SQLite database, and the server will respond with either an error or success message.<br>
In the case of a login request, the server sends back a JWT token embedded in a JSON response. Then on the frontend, the token is stored in localStorage for each request thereafter.<br>
The token is parsed and validated on the frontend whenever a user goes to a new route. If the token ever becomes invalid, then the user is logged out and token is removed.

### TODO

- Golang server has a protected route /protected that is yet to implemented or used by the frontend. 

