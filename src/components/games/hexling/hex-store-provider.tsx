"use client";

import {
  createContext,
  ReactNode,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { createHexStore, defaultInitState, HexState } from "./hex-store";

export type HexStoreApi = ReturnType<typeof createHexStore>;

export const HexStoreContext = createContext<HexStoreApi | undefined>(
  undefined,
);

export interface HexStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<HexState>;
}

export const HexStoreProvider = ({
  children,
  initialState = {},
}: HexStoreProviderProps) => {
  const [hexStore, setHexStore] = useState<HexStoreApi>(
    createHexStore({
      ...defaultInitState,
      ...initialState,
    }),
  );

  const handleSetHexStore = useEffectEvent((store: HexStoreApi) => {
    setHexStore(store);
  });

  useEffect(() => {
    handleSetHexStore(hexStore);
  }, [initialState, hexStore]);

  return (
    <HexStoreContext.Provider value={hexStore}>
      {children}
    </HexStoreContext.Provider>
  );
};
