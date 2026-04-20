# 📚 Raamatukogu infosüsteem

Full-stack raamatukogu infosüsteem, mis võimaldab hallata raamatuid ja arvustusi.

## Tehnoloogiad

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL

### Frontend

* React
* TypeScript
* Vite
* Axios
* React Router v6
* Tailwind CSS

---

##  Funktsionaalsus

### Raamatud

* Raamatute nimekiri
* Otsing (pealkiri, keel, aasta)
* Sorteerimine (pealkiri, aasta)
* Pagination
* Raamatu detailvaade
* Raamatu lisamine, muutmine ja kustutamine

### Filtrid

* Keele filter (dropdown)
* Žanri filter (dropdown backendist)

### Arvustused

* Arvustuste lisamine
* Keskmine hinnang
* Arvustuste kustutamine

---

## Projekti struktuur

```text
.
├── frontend/        # React frontend
├── src/             # Backend source code
├── prisma/          # Prisma schema ja seed
├── package.json     # Backend dependencies
└── README.md
```

---

## Paigaldus ja käivitamine

### 1. Backend

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Backend töötab:

```
http://localhost:3000/api/v1
```

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend töötab:

```
http://localhost:5173
```
---

##  API Endpointid

### Raamatud

* GET /api/v1/books
* GET /api/v1/books/:id
* POST /api/v1/books
* PUT /api/v1/books/:id
* DELETE /api/v1/books/:id

### Arvustused

* GET /api/v1/books/:id/reviews
* POST /api/v1/books/:id/reviews
* DELETE /api/v1/reviews/:id

### Lisainfo

* GET /api/v1/books/:id/average-rating
* GET /api/v1/genres

---

##  Autor

Johanna Jõerand

---

##  Märkused

* Frontend ja backend töötavad eraldi, kuid suhtlevad REST API kaudu
* API URL on seadistatud keskkonnamuutujaga `VITE_API_URL`
