import { useContext, createContext } from "react";

export const CustomerContext = createContext();

export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) {
    throw new Error("useCustomers must be used inside a CustomerProvider");
  }
  return ctx;
}
