import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "@/lib/api";
import type { User } from "@/lib/types";

export type Role = "admin" | "faculty" | "student";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (rawUser: any): User => ({
  ...rawUser,
  profile:
    rawUser.studentProfile ||
    rawUser.facultyProfile ||
    rawUser.adminProfile ||
    rawUser.profile,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      return;
    }

    const response = await authAPI.getProfile();
    setUser(normalizeUser(response.data.data.user));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          console.log("AuthContext: Fetching profile with token...");
          await refreshUser();
        } catch (error) {
          console.error("AuthContext: Failed to fetch profile:", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { user: rawUser, token } = response.data.data;
      setUser(normalizeUser(rawUser));
      setToken(token);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await authAPI.loginWithGoogle(idToken);
      const { user: rawUser, token } = response.data.data;
      setUser(normalizeUser(rawUser));
      setToken(token);
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithGoogle,
        refreshUser,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
