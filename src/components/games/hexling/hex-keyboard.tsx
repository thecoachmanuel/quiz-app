import { Button } from "@/components/ui/Button";
import {
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import HexGrid from "./hex-grid";
import useHexStore from "./hooks/useHexStore";

export default function HexKeyboard({
  centerLetter,
  onSubmit,
  onChange,
  isDisabled,
}: {
  centerLetter: string;
  onSubmit: () => void;
  onChange: (event: KeyboardEvent | { key: string }) => void;
  isDisabled?: boolean;
}) {
  const { letters, shuffleLetters } = useHexStore((store) => store);

  return (
    <div className="flex flex-col">
      <HexGrid
        letters={letters}
        centerLetter={centerLetter!}
        onClick={(letter) => {
          onChange({ key: letter });
        }}
        isDisabled={isDisabled}
      />
      <div className="mt-4 flex justify-center gap-4">
        <Button
          className="rounded-full"
          onClick={() => {
            onChange({ key: "Backspace" });
          }}
          disabled={isDisabled}
        >
          <TrashIcon size={16} />
          <span className="sr-only">Delete</span>
        </Button>
        <Button
          className="rounded-full"
          onClick={shuffleLetters}
          disabled={isDisabled}
        >
          <ShuffleIcon size={16} />
          <span className="sr-only">Shuffle</span>
        </Button>
        <Button
          className="rounded-full"
          onClick={onSubmit}
          disabled={isDisabled}
        >
          <PlayIcon size={16} />
          <span className="sr-only">Submit</span>
        </Button>
      </div>
    </div>
  );
}
