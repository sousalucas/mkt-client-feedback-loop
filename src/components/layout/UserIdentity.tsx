'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { avatarColor, getInitials } from '@/lib/utils';

export function UserIdentity() {
  const { userName, saveUser, isLoaded, hasUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  if (!isLoaded) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      saveUser(inputValue.trim());
      setIsOpen(false);
      setInputValue('');
    }
  };

  if (!hasUser) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors"
        >
          <User className="h-4 w-4" />
          <span>Entrar</span>
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-border bg-bg-secondary p-4 shadow-2xl">
            <p className="text-sm text-text-secondary mb-3">Digite seu nome para começar:</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Seu nome..."
                className="flex-1 rounded-xl border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  const color = avatarColor(userName);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-xl border border-border px-3 py-1.5 hover:border-accent/50 transition-colors"
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {getInitials(userName)}
        </div>
        <span className="text-sm font-medium text-text-primary hidden sm:inline">{userName}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-bg-secondary p-2 shadow-2xl">
          <div className="px-3 py-2 border-b border-border-subtle mb-2">
            <p className="text-sm font-medium text-text-primary">{userName}</p>
            <p className="text-xs text-text-tertiary">Revisor ativo</p>
          </div>
          <button
            onClick={() => {
              saveUser('');
              localStorage.removeItem('feedback-loop-user');
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
