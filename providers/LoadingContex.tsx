// context/LoadingContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useGlobalLoading must be used within LoadingProvider");
  return context;
};
