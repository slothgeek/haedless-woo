// hooks/usePasswordLogin.js
import { useState } from 'react';

interface LoginError {
  message: string;
  code?: string;
}

export function usePasswordLogin() {
  const [ loginErrors, setLoginErrors ] = useState<LoginError | undefined>();
  const [ isLoading, setIsLoading ] = useState( false );
  const [ userData, setUserData ] = useState( undefined );

  /**
   * A function to log the user in.
   * @param {string} username The username to log in with.
   * @param {string} password The password to log in with.
   * @param {string} redirectTo An optional URL to redirect to after login.
   */
  async function login( username:string, password:string, redirectTo?:string ) {
    setIsLoading( true );

    const loginUrl = '/api/auth/login/password';

    try {
      const res = await fetch( loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify( {
          username,
          password,
        } ),
      } );
      
      const data = await res.json();
      
      if ( ! res.ok || data.error) {  
        setLoginErrors( { message: data.error } );
        setIsLoading( false );
        return;
      }

      // If we get here, the login was successful, so let's redirect.
      if ( redirectTo ) {
        window.location.assign( redirectTo );
      }
    } catch (error) {
      setLoginErrors({ message: 'Error al conectar con el servidor' });
      setIsLoading( false );
    }
  }

  return {
    login,
    errors: loginErrors,
    isLoading,
    isAuthenticated: !! userData,
    userData,
  };
}