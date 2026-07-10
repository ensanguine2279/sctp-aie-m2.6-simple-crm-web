import { createContext, useContext } from "react";

export const AuthContext = createContext();

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside a AuthProvider");
  }
  return ctx;
}
