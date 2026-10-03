/** @format */

import ModalStoreProvider from "@/components/games/providers/modal/modal-provider";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModalStoreProvider>
      <div className="custom-container pt-[100px] pb-20 md:pt-[150px]">
        {children}
      </div>
    </ModalStoreProvider>
  );
}
