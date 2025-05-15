'use client';

import { useState } from "react";

export function useLogout() {
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  async function logout(redirectUrl: string) {
    try {
      setLoading(true);

      const logoutUrl = `/api/auth/logout`;

      const response = await fetch(logoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        setError(response as unknown as Error);
        setLoading(false);
        return;
      }

      if (redirectUrl) {
        window.location.assign(redirectUrl);
      } else {
        window.location.reload();
      }
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }

  return {
    error,
    logout,
    loading,
  };
}