/** @format */
import { Protected } from "@/components/HOC/Protected";
import PageContent from "@/components/partials/PageContent";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      {children}
      <PageContent page={"dashboard"} />
    </Protected>
  );
}
