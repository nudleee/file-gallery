import React, { useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase-config';
import { FirebaseError } from 'firebase/app';
import { useNavigate } from 'react-router-dom';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => void;
  logout: () => void;
  error: FirebaseError | undefined;
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<FirebaseError>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRequestStart = () => {
    setLoading(true);
    setError(undefined);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        user.getIdToken().then((token) => {
          localStorage.setItem('token', token);
          navigate('/');
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const login = (email: string, password: string) => {
    handleRequestStart();
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const register = (email: string, password: string) => {
    handleRequestStart();
    createUserWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    handleRequestStart();
    signOut(auth)
      .then(() => {
        localStorage.removeItem('token');
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const authState = { user, loading, login, logout, register, error };

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
