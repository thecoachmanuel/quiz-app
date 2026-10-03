"use client";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import WordListContent from "./word-list-content";

export default function WordListBar({
  isLoading,
  userSubmissionData,
}: {
  isLoading: boolean;
  userSubmissionData: any;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="word-list-bar mx-auto w-full max-w-[600px] overflow-hidden px-4 lg:hidden"
    >
      {!isLoading && (
        <Popover>
          <PopoverTrigger asChild>
            <div className="border-primary/20 relative mt-10 flex min-h-[50px] w-full cursor-pointer flex-nowrap gap-2 overflow-hidden rounded-md border px-4 py-3 lg:mt-4">
              <button className="text-primary/90 flex h-full w-full items-center justify-between gap-5 text-lg font-medium capitalize">
                <p>Show matched Words </p>{" "}
                <p>
                  <CaretDownIcon size={24} />
                </p>
              </button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="block w-full border-none bg-transparent p-2 shadow-none lg:hidden">
            <div className="border-primary/20 mx-auto w-full rounded-md border bg-white p-4 shadow-md">
              <WordListContent
                isLoading={isLoading}
                userSubmissionData={userSubmissionData}
              />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
