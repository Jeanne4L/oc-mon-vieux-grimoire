# Mon Vieux Grimoire
## This is the backend part of the project

Mon Vieux Grimoire is a book rating site.

## Features

- Signup or login
- Create a new book 
- Modify/delete your books
- Rate a book

## Tech

Mon Vieux Grimoire uses:

- [node.js] - <http://nodejs.org>
- [Express] - <http://expressjs.com>

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm i
nodemon server
```
Create a .env file

## API

Host: [http://localhost:4000/api/](http://localhost:4000/api/)

### Users

---

#### POST /auth/signup

This endpoint allows to create a new user.

###### Request body example:

``` json
{
    "email": "johndoe@email.fr",
    "password": "password"
}

```

###### Response:

| **code** | **response** |
| --- | --- |
| 201 | {"message": "User created"} |
| 500 | {"message":"Internal Server Error"} |

#### POST /auth/login

This endpoint allows to connect the user.

###### Request body example:

``` json
{
    "email": "johndoe@email.fr",
    "password": "password"
}

```

###### Response:

| **code** | **response** |
| --- | --- |
| 200 | { userId; token } |
| 500 | {"message":"Internal Server Error"} |

### Books

---

#### GET /books

This endpoint allows to get all the books.

| **code** | **response** |
| --- | --- |
| 201 | Book object array |
| 400 | {"message": "Bad Request"} |

#### GET /books/bestrating

This endpoint allows to get top three rated books.

| **code** | **response** |
| --- | --- |
| 201 | { book object } |
| 400 | {"message": "Bad Request"} |

#### GET /books/{id}

This endpoint allows to get one book.

| **code** | **response** |
| --- | --- |
| 201 | { book object } |
| 404 | {"message": "Not found"} |

#### POST /books

This endpoint allows to create a new book for a connected user.

###### Headers:

`"Authorization": Bearer Token`

###### Parameters:

| **name** | **type** |  |
| --- | --- | --- |
| userId | string | required |
| title | string | required |
| author | string | required |
| imageUrl | string | required |
| year | number | required |
| genre | string | required |
| ratings | array | optional |
| averageRating | number | optional |

###### Request body example:

``` json
{
  "userId": "123456789",
  "title": "This is the book title",
  "author": "Author Name",
  "imageUrl": "https://exemple.com/image.jpg",
  "year": 2023,
  "genre": "Book genre",
  "ratings": [
    {
      "userId": "123456789",
      "grade": 4
    }
  ],
  "averageRating": 4
}

```

###### Response:

| **code** | **response** |
| --- | --- |
| 201 | { "message": "Book created"} |
| 400 | {"message": "Bad Request"} |

#### POST /books/{id}/rating

This endpoint allows to rate a book.

###### Headers:

`"Authorization": Bearer Token`

###### Parameters:

| **name** | **type** |  |
| --- | --- | --- |
| userId | string | required |
| grade | number | required |

###### Request body example:

``` json
{
    "userId": "123456789",
    "grade": 4
}

```

###### Response:

| **code** | **response** |
| --- | --- |
| 200 | { book object } |
| 400 | {"message": "Bad Request"} |

#### PUT /books/{id}

This endpoint allows to update a book.

###### Headers:

`"Authorization": Bearer Token`

###### Request body example:

``` json
{
    "year": 2022
}

```

###### Response:

| **code** | **response** |
| --- | --- |
| 200 | {"message": "Book updated"} |
| 404 | {"message": "Not found"} |

#### DELETE /books/{id}

This endpoint allows to remove a book.

###### Headers:

`"Authorization": Bearer Token`

###### Response:

| **code** | **response** |
| --- | --- |
| 200 | {"message": "Book deleted" } |
| 404 | {"message": "Not found"} |
