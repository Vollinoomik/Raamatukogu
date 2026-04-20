"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.review.deleteMany();
    await prisma.book.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.author.deleteMany();
    await prisma.publisher.deleteMany();
    const [author1, author2, author3, author4, author5, author6] = await Promise.all([
        prisma.author.create({
            data: { name: "George Orwell", birthYear: 1903, country: "United Kingdom" }
        }),
        prisma.author.create({
            data: { name: "Jane Austen", birthYear: 1775, country: "United Kingdom" }
        }),
        prisma.author.create({
            data: { name: "Haruki Murakami", birthYear: 1949, country: "Japan" }
        }),
        prisma.author.create({
            data: { name: "J.K. Rowling", birthYear: 1965, country: "United Kingdom" }
        }),
        prisma.author.create({
            data: { name: "Ernest Hemingway", birthYear: 1899, country: "United States" }
        }),
        prisma.author.create({
            data: { name: "Paulo Coelho", birthYear: 1947, country: "Brazil" }
        })
    ]);
    const [publisher1, publisher2, publisher3, publisher4] = await Promise.all([
        prisma.publisher.create({
            data: { name: "Penguin Books", country: "United Kingdom", foundedYear: 1935 }
        }),
        prisma.publisher.create({
            data: { name: "HarperCollins", country: "United States", foundedYear: 1989 }
        }),
        prisma.publisher.create({
            data: { name: "Vintage", country: "United States", foundedYear: 1954 }
        }),
        prisma.publisher.create({
            data: { name: "Bloomsbury", country: "United Kingdom", foundedYear: 1986 }
        })
    ]);
    const [dystopian, politicalSatire, romance, magicalRealism, drama, fantasy, literaryFiction, warFiction, adventure] = await Promise.all([
        prisma.genre.create({ data: { name: "Dystopian" } }),
        prisma.genre.create({ data: { name: "Political Satire" } }),
        prisma.genre.create({ data: { name: "Romance" } }),
        prisma.genre.create({ data: { name: "Magical Realism" } }),
        prisma.genre.create({ data: { name: "Drama" } }),
        prisma.genre.create({ data: { name: "Fantasy" } }),
        prisma.genre.create({ data: { name: "Literary Fiction" } }),
        prisma.genre.create({ data: { name: "War Fiction" } }),
        prisma.genre.create({ data: { name: "Adventure" } })
    ]);
    const book1 = await prisma.book.create({
        data: {
            title: "1984",
            isbn: "9780451524935",
            publishedYear: 1949,
            language: "English",
            pageCount: 328,
            authorId: author1.id,
            publisherId: publisher1.id,
            genres: { connect: [{ id: dystopian.id }] }
        }
    });
    const book2 = await prisma.book.create({
        data: {
            title: "Animal Farm",
            isbn: "9780451526342",
            publishedYear: 1945,
            language: "English",
            pageCount: 112,
            authorId: author1.id,
            publisherId: publisher1.id,
            genres: { connect: [{ id: politicalSatire.id }] }
        }
    });
    const book3 = await prisma.book.create({
        data: {
            title: "Pride and Prejudice",
            isbn: "9780141439518",
            publishedYear: 1813,
            language: "English",
            pageCount: 432,
            authorId: author2.id,
            publisherId: publisher1.id,
            genres: { connect: [{ id: romance.id }] }
        }
    });
    const book4 = await prisma.book.create({
        data: {
            title: "Kafka on the Shore",
            isbn: "9781400079278",
            publishedYear: 2002,
            language: "Japanese",
            pageCount: 505,
            authorId: author3.id,
            publisherId: publisher3.id,
            genres: { connect: [{ id: magicalRealism.id }] }
        }
    });
    const book5 = await prisma.book.create({
        data: {
            title: "Norwegian Wood",
            isbn: "9780375704024",
            publishedYear: 1987,
            language: "Japanese",
            pageCount: 296,
            authorId: author3.id,
            publisherId: publisher3.id,
            genres: { connect: [{ id: drama.id }] }
        }
    });
    const book6 = await prisma.book.create({
        data: {
            title: "Harry Potter and the Philosopher's Stone",
            isbn: "9780747532699",
            publishedYear: 1997,
            language: "English",
            pageCount: 223,
            authorId: author4.id,
            publisherId: publisher4.id,
            genres: { connect: [{ id: fantasy.id }] }
        }
    });
    const book7 = await prisma.book.create({
        data: {
            title: "Harry Potter and the Chamber of Secrets",
            isbn: "9780747538493",
            publishedYear: 1998,
            language: "English",
            pageCount: 251,
            authorId: author4.id,
            publisherId: publisher4.id,
            genres: { connect: [{ id: fantasy.id }] }
        }
    });
    const book8 = await prisma.book.create({
        data: {
            title: "The Old Man and the Sea",
            isbn: "9780684801223",
            publishedYear: 1952,
            language: "English",
            pageCount: 128,
            authorId: author5.id,
            publisherId: publisher2.id,
            genres: { connect: [{ id: literaryFiction.id }] }
        }
    });
    const book9 = await prisma.book.create({
        data: {
            title: "A Farewell to Arms",
            isbn: "9780684801469",
            publishedYear: 1929,
            language: "English",
            pageCount: 352,
            authorId: author5.id,
            publisherId: publisher2.id,
            genres: { connect: [{ id: warFiction.id }] }
        }
    });
    const book10 = await prisma.book.create({
        data: {
            title: "The Alchemist",
            isbn: "9780061122415",
            publishedYear: 1988,
            language: "Portuguese",
            pageCount: 208,
            authorId: author6.id,
            publisherId: publisher2.id,
            genres: { connect: [{ id: adventure.id }] }
        }
    });
    const book11 = await prisma.book.create({
        data: {
            title: "Brida",
            isbn: "9780061762703",
            publishedYear: 1990,
            language: "Portuguese",
            pageCount: 288,
            authorId: author6.id,
            publisherId: publisher2.id,
            genres: { connect: [{ id: fantasy.id }] }
        }
    });
    await prisma.review.createMany({
        data: [
            { bookId: book1.id, reviewerName: "Mari", rating: 5, comment: "Excellent" },
            { bookId: book1.id, reviewerName: "Jaan", rating: 4, comment: "Very good" },
            { bookId: book2.id, reviewerName: "Liis", rating: 5, comment: "Sharp and clever" },
            { bookId: book3.id, reviewerName: "Kaur", rating: 4, comment: "Classic" },
            { bookId: book4.id, reviewerName: "Ann", rating: 5, comment: "Weird but great" },
            { bookId: book4.id, reviewerName: "Rasmus", rating: 4, comment: "Memorable" },
            { bookId: book5.id, reviewerName: "Eva", rating: 3, comment: "Sad story" },
            { bookId: book6.id, reviewerName: "Karl", rating: 5, comment: "Magical" },
            { bookId: book6.id, reviewerName: "Mia", rating: 5, comment: "Loved it" },
            { bookId: book7.id, reviewerName: "Timo", rating: 4, comment: "Fun sequel" },
            { bookId: book8.id, reviewerName: "Sander", rating: 4, comment: "Short and powerful" },
            { bookId: book9.id, reviewerName: "Helen", rating: 3, comment: "Well written" },
            { bookId: book10.id, reviewerName: "Kristi", rating: 5, comment: "Inspirational" },
            { bookId: book10.id, reviewerName: "Mark", rating: 4, comment: "Simple and deep" }
        ]
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
