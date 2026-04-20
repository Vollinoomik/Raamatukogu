import { BookPlus, Home, Library } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo';

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  `rounded-full px-4 py-2 text-sm font-semibold ${
    isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export function Navbar(): JSX.Element {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span className="text-2xl font-extrabold tracking-tight text-brand-pink">Books Library</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass}>
            <span className="inline-flex items-center gap-2"><Home className="h-4 w-4" />Home</span>
          </NavLink>
          <NavLink to="/books" className={navLinkClass}>
            <span className="inline-flex items-center gap-2"><Library className="h-4 w-4" />Books</span>
          </NavLink>
        </nav>

        <Link
          to="/books/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-5 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/20 hover:-translate-y-0.5"
        >
          <BookPlus className="h-4 w-4" />
          Add Book
        </Link>
      </div>
    </header>
  );
}
