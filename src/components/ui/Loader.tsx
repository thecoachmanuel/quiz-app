import { cn } from "@/utils/cn";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex h-screen items-center justify-center",
        className || "",
      )}
    >
      <div className="border-primary h-12 w-12 animate-spin rounded-full border-b-2"></div>
    </div>
  );
};

export default Loader;
