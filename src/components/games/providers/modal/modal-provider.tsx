"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { useStore } from "zustand";
import { ModalStore, createModalStore } from "./modal-store";

export type ModalStoreApi = ReturnType<typeof createModalStore>;

export const ModalStoreContext = createContext<ModalStoreApi | undefined>(
  undefined,
);

export default function ModalStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [modalStore, setModalStore] =
    useState<ModalStoreApi>(createModalStore());

  const handleSetStore = useEffectEvent((store: ModalStoreApi) => {
    setModalStore(store);
  });

  useEffect(() => {
    handleSetStore(modalStore);
  }, [modalStore]);

  return (
    <ModalStoreContext.Provider value={modalStore}>
      {children}
    </ModalStoreContext.Provider>
  );
}

export const useModalStore = <T,>(selector: (_store: ModalStore) => T): T => {
  const context = useContext(ModalStoreContext);

  if (!context) {
    throw new Error("useModalStore must be used within a ModalStoreProvider");
  }

  return useStore(context, selector);
};
