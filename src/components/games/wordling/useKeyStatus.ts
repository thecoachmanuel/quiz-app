import { useMemo } from "react";
import { UserSubmissions } from "./Wordling";

export type LetterStatusType = "correct" | "present" | "absent";

interface LetterStatus {
  letter: string;
  status: LetterStatusType;
}

// Custom Hook
export const useKeyStatus = (submissions: UserSubmissions): LetterStatus[] => {
  return useMemo(() => {
    const statusRank: Record<LetterStatusType, number> = {
      correct: 3,
      present: 2,
      absent: 1,
    };

    const letterMap = new Map<string, LetterStatus>();

    submissions?.flat().forEach((item) => {
      const { letter, status } = item;

      // Only process valid status types
      if (status === "correct" || status === "present" || status === "absent") {
        const currentRank = statusRank[status];
        const existingRank = letterMap.has(letter)
          ? statusRank[letterMap.get(letter)!.status]
          : 0;

        if (currentRank > existingRank) {
          letterMap.set(letter, { letter, status });
        }
      }
    });

    return Array.from(letterMap.values());
  }, [submissions]);
};
