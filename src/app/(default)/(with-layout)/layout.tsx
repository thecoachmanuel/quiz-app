/** @format */

import ErrorBoundary from "@/components/HOC/ErrorBoundary";
import Header from "@/components/partials/header/Header";
import Error from "@/components/ui/error";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Header />
      {children}
    </ErrorBoundary>
  );
}
