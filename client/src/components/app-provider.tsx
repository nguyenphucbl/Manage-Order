"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import {
  decodeToken,
  getFromLocalStorage,
  removeFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
const AppContext = createContext({
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
});
export const useAppContext = () => {
  return useContext(AppContext);
};
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRoleState] = useState<RoleType | undefined>();
  const setRole = useCallback((role?: RoleType) => {
    setRoleState(role);
    if (!role) {
      removeFromLocalStorage("accessToken");
      removeFromLocalStorage("refreshToken");
    }
  }, []);
  useEffect(() => {
    const accessToken = getFromLocalStorage("accessToken");
    if (accessToken) {
      const role = decodeToken(accessToken).role as RoleType;
      setRoleState(role);
    }
  }, []);
  return (
    <AppContext.Provider value={{ role, setRole }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
