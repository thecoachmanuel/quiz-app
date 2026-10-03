/** @format */
import Loader from "@/components/ui/Loader";
import { setPageMetaData } from "@/hooks/server/pageSeoSetup";
import { Suspense, use } from "react";
import PageContent from "../../../../../components/partials/PageContent";
import QuizDetails from "./Details";
type Params = Promise<{ quiz: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { quiz } = await params;
  return await setPageMetaData({
    type: "quiz",
    slug: quiz,
  });
}

const DetailPage = ({ params }: { params: Params }) => {
  const { quiz } = use(params);
  return (
    <div>
      <div className="pb-10">
        <Suspense fallback={<Loader />}>
          <QuizDetails quiz={quiz} />
        </Suspense>
      </div>
      <PageContent page={"quizzes"} />
    </div>
  );
};

export default DetailPage;
