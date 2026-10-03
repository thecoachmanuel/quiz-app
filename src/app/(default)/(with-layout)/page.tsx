/** @format */

import Loader from "@/components/ui/Loader";
import { setPageMetaData } from "@/hooks/server/pageSeoSetup";
import { Suspense, use } from "react";
import PageContentWithBreadcrumb from "@/components/partials/PageContentWithBreadcrumb";

type Props = {
  params: Promise<{ page?: string[] }>;
};

export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  const slug = page?.length ? page[page.length - 1] : "/";
  return setPageMetaData({ slug });
}

const DynamicPage = ({ params }: Props) => {
  const { page } = use(params);

  const slug = page?.length ? page[page.length - 1] : "/";

  return (
    <Suspense fallback={<Loader />}>
      <PageContentWithBreadcrumb page={slug} />
    </Suspense>
  );
};

export default DynamicPage;
