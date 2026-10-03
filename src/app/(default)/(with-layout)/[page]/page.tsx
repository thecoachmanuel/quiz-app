/** @format */

import Loader from "@/components/ui/Loader";
import { setPageMetaData } from "@/hooks/server/pageSeoSetup";
import { Suspense, use } from "react";
import PageContentWithBreadcrumb from "@/components/partials/PageContentWithBreadcrumb";

type Props = {
  params: Promise<{ page: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  return setPageMetaData({ slug: page || "/" });
}

const DynamicPage = ({ params }: Props) => {
  const { page } = use(params);
  return (
    <Suspense fallback={<Loader />}>
      <PageContentWithBreadcrumb page={page} />
    </Suspense>
  );
};

export default DynamicPage;
