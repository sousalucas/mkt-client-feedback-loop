'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Plus } from 'lucide-react';
import { UserIdentity } from './UserIdentity';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-sky-400 shadow-lg shadow-accent/20">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight font-display">
                Feedback<span className="text-accent">Loop</span>
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === '/' ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                }`}
              >
                Projetos
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/novo-projeto"
              className="flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-hover px-4 py-2 text-sm font-semibold text-white transition-colors shadow-lg shadow-accent/20"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo Projeto</span>
            </Link>
            <UserIdentity />
          </div>
        </div>
      </div>
    </nav>
  );
}
