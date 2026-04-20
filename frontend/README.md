# Books Library Frontend

Modern React + TypeScript + Vite frontend for the **Books REST API homework** backend.

## Stack

- React
- TypeScript
- Vite
- Axios
- React Router v6
- Tailwind CSS

## Features

- Home page with modern hero layout
- Books list page at `/books`
- Filtering by title, published year, and language
- Sorting by title or published year, ascending/descending
- Pagination with page and limit info
- Add, view, edit, and delete book flows
- Book detail page with average rating and review list
- Add review form
- Loading and error states
- `AbortController` in all `useEffect` request flows
- API calls centralized in `src/api.ts`

## API base URL

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Example:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Install and run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Routes

- `/`
- `/books`
- `/books/new`
- `/books/:id`
- `/books/:id/edit`

## Important backend note

This frontend is aligned to the GitHub backend repo:

- `GET /books` -> `{ data, pagination }`
- `GET /books/:id` -> `{ data: book }`
- `GET /books/:id/reviews` -> `{ data: reviews }`
- `GET /books/:id/average-rating` -> `{ data: { averageRating, reviewCount, bookId } }`

There is one backend mismatch in the current API implementation:

- create/update validation requires a `genre` string
- but the service layer currently does not persist the genre relation when creating/updating a book

So the form includes a `genre` field for validator compatibility, but the backend may ignore it until the backend service is updated.
