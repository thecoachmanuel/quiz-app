import { useContext } from "react";
import { useStore } from "zustand";
import { HexStore } from "../hex-store";
import { HexStoreContext } from "../hex-store-provider";

export default function useHexStore<T>(selector: (store: HexStore) => T): T {
  const context = useContext(HexStoreContext);

  if (!context) {
    throw new Error("useHexStore must be used within a HexStoreProvider");
  }

  return useStore(context, selector);
}
