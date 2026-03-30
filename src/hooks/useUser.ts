'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'feedback-loop-user';

export function useUser() {
  const [userName, setUserName] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setUserName(stored);
    setIsLoaded(true);
  }, []);

  const saveUser = useCallback((name: string) => {
    setUserName(name);
    localStorage.setItem(STORAGE_KEY, name);
  }, []);

  return { userName, saveUser, isLoaded, hasUser: !!userName };
}
