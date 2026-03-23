# Books REST API

## Autor

* Johanna Joerand

## Projekt

REST API raamatute ja arvustuste haldamiseks.
Tehnoloogiad: **TypeScript, Express, Prisma, PostgreSQL, Zod**

---

# Installatsioon

```bash
npm install
```

## Environment

Loo `.env` fail:
sisu sinna saad env.example failist.

---

# Andmebaas

## Migratsioonid

```bash
npx prisma migrate dev
```

## Seed

```bash
npm run db:seed
```

## Prisma Studio

```bash
npm run db:studio
```

---

# Käivitamine

```bash
npm run dev
```

Server jookseb:

* Express → http://localhost:3000

---

#  API Endpoints

##  Books

* `POST /api/v1/books`
* `GET /api/v1/books`
* `GET /api/v1/books/:id`
* `PUT /api/v1/books/:id`
* `DELETE /api/v1/books/:id`

##  Reviews

* `POST /api/v1/books/:bookId/reviews`
* `GET /api/v1/books/:bookId/reviews`
* `GET /api/v1/books/:id/average-rating`

---

#  Query võimalused

Näide:

```bash
GET /api/v1/books?language=English&sortBy=publishedYear&sortOrder=desc&page=1&limit=5
```
---

# cURL Näited

## GET kõik raamatud

```bash
curl http://localhost:3000/api/v1/books
```
Siit vastusest võta ühe raamatu ID ja kasuta seda järgmistes GET'ides
---

## GET üks raamat

```bash
curl http://localhost:3000/api/v1/books/{id}
```

---

## POST raamat

```bash
curl -X POST http://localhost:3000/api/v1/books \
-H "Content-Type: application/json" \
-d '{
  "title": "Test Book",
  "isbn": "9991234567890",
  "publishedYear": 2024,
  "language": "English",
  "genre": "Fantasy",
  "authorId": "AUTHOR_ID",
  "publisherId": "PUBLISHER_ID",
  "pageCount": 300
}'
```

---

## PUT raamat

```bash
curl -X PUT http://localhost:3000/api/v1/books/{id} \
-H "Content-Type: application/json" \
-d '{
  "pageCount": 400
}'
```

---

## DELETE raamat

```bash
curl -X DELETE http://localhost:3000/api/v1/books/{id}
```

---

## POST review

```bash
curl -X POST http://localhost:3000/api/v1/books/{bookId}/reviews \
-H "Content-Type: application/json" \
-d '{
  "reviewerName": "Tester",
  "rating": 5,
  "comment": "Great book"
}'
```

---

## GET reviewd

```bash
curl http://localhost:3000/api/v1/books/{bookId}/reviews
```

---

## GET average rating

```bash
curl http://localhost:3000/api/v1/books/{id}/average-rating
```

---

# Märkused

* `.env` faili ei lisata Git'i
* kasuta `.env.example` faili konfiguratsiooni näidiseks
* Prisma ID-d ei ole `b1`, vaid stringid (nt `cm...`)
