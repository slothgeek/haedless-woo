'use client';

import { useEffect, useState } from 'react';

interface UserData {
  databaseId: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userData: UserData | undefined;
  error: string | undefined;
}

export function useAuth(
  redirectTo = '', // An optional URL to redirect to.
  redirectOnError = false, // If true, redirect if the user is already logged in.
): AuthState {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    (async () => {

      const res = await fetch('/api/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      setIsLoading(false);
      setUserData(data?.user);
      setIsAuthenticated(!!data?.isLoggedIn);
      setError(data?.error);

    })();
  }, []);

  useEffect(() => {
    if (!!isLoading || !redirectTo || isAuthenticated === undefined) {
      return;
    }

    if (redirectOnError !== isAuthenticated) {
      setTimeout(() => {
        window.location.assign(redirectTo);
      }, 200);
    }
  }, [isLoading, isAuthenticated, redirectOnError, redirectTo]);

  return {
    isLoading,
    isAuthenticated,
    userData,
    error,
  };
}