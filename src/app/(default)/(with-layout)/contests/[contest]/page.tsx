/** @format */
import Loader from "@/components/ui/Loader";
import { setPageMetaData } from "@/hooks/server/pageSeoSetup";
import { Suspense, use } from "react";
import PageContent from "@/components/partials/PageContent";
import Details from "./Details";

type Params = Promise<{ contest: string }>;
export async function generateMetadata({ params }: { params: Params }) {
  const { contest } = await params;
  return await setPageMetaData({
    type: "contest",
    slug: contest,
  });
}

const DetailPage = ({ params }: { params: Params }) => {
  const { contest } = use(params);
  return (
    <div>
      <div className="pb-10">
        <Suspense fallback={<Loader />}>
          <Details slug={contest} />
        </Suspense>
      </div>

      <PageContent page={"contests"} />
    </div>
  );
};

export default DetailPage;
