/** @format */

import { setPageMetaData } from "@/hooks/server/pageSeoSetup";
import PageContent from "@/components/partials/PageContent";
import QuizBanner from "./QuizBanner";
import QuizList from "./QuizList";
export async function generateMetadata() {
  return await setPageMetaData({
    slug: "quizzes",
  });
}
export default function QuizzesPage() {
  return (
    <div>
      <div className="custom-container pt-28 pb-10">
        <QuizBanner
          title="Test Your Knowledge"
          subtitle="Dominate the Quiz World!"
        />
        <QuizList />
      </div>
      <PageContent page={"quizzes"} />
    </div>
  );
}
