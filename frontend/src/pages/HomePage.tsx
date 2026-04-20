import { BookPlus, BookText, Search, Settings, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

const features = [
  {
    icon: Search,
    title: 'Smart Search & Filter',
    description: 'Find books easily with filters by title, year, and language. Sort by title or publication year.',
    border: 'border-rose-100',
  },
  {
    icon: Star,
    title: 'Reviews & Ratings',
    description: 'Read and write book reviews. See average ratings and community feedback for each book.',
    border: 'border-emerald-100',
  },
  {
    icon: Settings,
    title: 'Full CRUD Operations',
    description: 'Create, edit, and delete books. Manage your library with complete control.',
    border: 'border-fuchsia-100',
  },
];

export function HomePage(): JSX.Element {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
      <section className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Logo className="mb-8 h-16 w-16" />
        <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-900 md:text-7xl">Books Library</h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-600">
          Discover, manage, and review your favorite books. Explore your collection with advanced filtering and share your thoughts.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link to="/books" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-fuchsia-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink-500/20">
            <BookText className="h-5 w-5" />
            Browse Books
          </Link>
          <Link to="/books/new" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-violet-500/20">
            <BookPlus className="h-5 w-5" />
            Add New Book
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description, border }) => (
          <article key={title} className={`rounded-[28px] border ${border} bg-white p-8 shadow-soft`}>
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
              <Icon className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
