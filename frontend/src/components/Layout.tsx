import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
