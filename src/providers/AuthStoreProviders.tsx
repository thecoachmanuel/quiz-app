/** @format */

"use client";
import { TOKEN_NAME } from "@/configs";
import { updatePrivateAxiosInstance } from "@/configs/axiosConfig";
import {
  type AuthStore,
  createAuthStore,
  defaultInitState,
} from "@/stores/auth";
import { AppInfoType } from "@/types";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStore } from "zustand";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined,
);

export interface AuthProviderProps {
  children: ReactNode;
  info: AppInfoType | undefined;
}

export const AuthStoreProvider = ({ children, info }: AuthProviderProps) => {
  const [store] = useState<AuthStoreApi>(createAuthStore(defaultInitState));
  const searchParams = useSearchParams();
  const dynamicToken = searchParams.get("token");
  const { isAuthenticated, getUser, loginWithToken } = store.getState();

  const token = Cookies.get(TOKEN_NAME);

  useEffect(() => {
    if (dynamicToken) {
      loginWithToken(dynamicToken);
    }
  }, [dynamicToken, loginWithToken]);

  useEffect(() => {
    if (token) {
      if (!isAuthenticated) {
        updatePrivateAxiosInstance(token);
        getUser();
        store.setState({
          isAuthenticated: true,
        });
      }
    } else {
      store.setState({
        isAuthenticated: false,
        token: "",
        user: null,
      });
    }

    store.setState({ appInfo: info });
  }, [getUser, isAuthenticated, token, info, store]);
  const storeState = useStore(store);
  const contextValue = useMemo(
    () => ({
      ...storeState,
      setState: store.setState,
      getState: store.getState,
      getInitialState: store.getInitialState,
      subscribe: store.subscribe,
    }),
    [storeState, store],
  );
  return (
    <AuthStoreContext.Provider value={contextValue}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error("useAuthStore must be used within a AuthStoreProvider");
  }

  return useStore(store, selector);
};
