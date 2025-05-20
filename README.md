# Book Review System - Billeasy

1. Clone the respository
```
https://github.com/premchandellendula/BookReviewSystem_Billeasy.git
```

2. Navigate to the project directory:

```
cd BookReviewSystem_Billeasy
```

## Install Dependencies
```
npm install
```

## Set Up Environment Variables
Create a .env file in the root directory and add your PostgreSQL connection string:
```
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
```
```
JWT_SECRET="yourjwtsecret"
```

## Prisma Setup

```
npx prisma migrate dev
```

### Generate Prisma Client
```
npx prisma generate
```

## Start the app
```
node index.js
```

# API Routes - Postman

## Authentication

The backend route will be as `http://localhost:3000/api/v1` with the following routes

- `POST /auth/signup`
```
{
    "username" : "onenine",
    "email": "one@gmail.com",
    "password": "123abc"
}
```

- `POST /auth/login`

```
{
    "email": "one@gmail.com",
    "password": "123abc"
}
```

**Note:** After login, you will receive a `JWT auth` token.

## Books

- `POST /books/books`

We need to pass the jwt token in headers as `Bearer ${token}$`
```
{
    "title": "title goes here",
    "description": "description goes here",
    "imageUrl": "image url",
    "numOfPages": 235(Number),
    "genre": "Genre"
}
```

- `GET /books/books`

There are different routes associated with this route for pagination and get values by filter(author and genre)

```
/books/books - gives every book

/books/books?page=1&limit=10 - gives only books in the page 1 of limit 10

/books/books?author=authorName - gives only books with the author authorName

/books/books?genre=genre - gives only books with the given genre

/books/books?author=authorName&genre=genre - gives only books with the given authorName and genre
```
**Note**: This is not a authenticated endpoint

## Reviews

- `POST /reviews/books/reviews/:id`
> id is the bookId, we pass it to the params

**Note**: For the reviews we need to pass jwt token in the headers as `Bearer ${token}`

```
{
    "comment": "review goes here"
}
```

- `PUT /reviews/reviews/:id`

```
{
    "comment": "updated review goes here"
}
```

- `DELETE /reviews/reviews/:id`

## Ratings

- `POST /ratings/rating/:id`

**Note**: This is an authenticated endpoint

```
{
    "rating": 3.5
}
```

# Testing

You can use Postman or a similar tool to test the endpoints. Make sure to add the `Authorization` header with the JWT token for protected routes.