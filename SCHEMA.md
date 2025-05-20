# Schema Overview

## User

- id (Primary Key)
- username (unique)
- email (unique)
- password
- Relationships
  + Has many books (as author)
  + Has many ratings
  + has many reviews

## Book

- id (Primary Key)
- title
- description
- imageUrl
- numberOfPages
- genre
- authorId (Foreign Key -> User)
- Relationships
  + Has many ratings
  + Has many reviews

## Rating

- id (Primary Key)
- rating (0.0 to 5.0 in 0.5 increments)
- userId (Foreign Key -> User)
- bookId (Foreign Key -> Book)
- Unique Constraint(userId, bookId)

## Review

- id (Primary Key)
- comment
- userId (Foreign Key -> User)
- bookId (Foreign Key -> Book)
- Unique Constraint(userId, bookId)