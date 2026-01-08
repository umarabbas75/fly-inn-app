"use client";

import React, { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { bffQuery } from "@/lib/bff-client";

interface User {
  id: number | string;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  phone: string | null;
  image: string | null;
  role: string | null;
  status: boolean;
  email_verified_at: string | null;
  profile_completeness: number;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status } = useSession();
  const isSessionAuthenticated = status === "authenticated";

  // Fetch current user using BFF pattern
  const {
    data: userResponse,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => bffQuery<{ data: any }>("/api/users/current-user"),
    retry: false,
    enabled: isSessionAuthenticated,
  });
  // Extract user data from response
  const userData = userResponse as unknown as User | null;

  // Logout function - clears client state only
  // Note: Actual logout is handled by NextAuth's signOut() in UserDropdown component
  const logout = async () => {
    queryClient.clear();
    router.push("/auth/login");
  };

  const value: AuthContextType = {
    user: userData,
    isLoading,
    isAuthenticated: isSessionAuthenticated,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
