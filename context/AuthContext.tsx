import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getUserByRecordId } from 'lib/platform';
import { signOutFirebase } from '../firebase/firebaseAuth';
import { clearUserId, getUserId, saveUserId } from 'utils/session';

export type AuthUser = {
  id: string;
  name: string;
  emailAddress: string;
  [key: string]: unknown;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isCheckingSession: boolean;
  login: (user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    (async () => {
      const userId = await getUserId();
      if (userId) {
        const storedUser = await getUserByRecordId(userId);
        setUser(storedUser);
      }
      setIsCheckingSession(false);
    })();
  }, []);

  const login = async (loggedInUser: AuthUser) => {
    await saveUserId(loggedInUser.id);
    setUser(loggedInUser);
  };

  const logout = async () => {
    await signOutFirebase();
    await clearUserId();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        isCheckingSession,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
