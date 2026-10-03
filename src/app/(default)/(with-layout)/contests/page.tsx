/** @format */

import { setPageMetaData } from "@/hooks/server/pageSeoSetup";
import PageContent from "../../../../components/partials/PageContent";
import QuizBanner from "../quizzes/QuizBanner";
import ContestList from "./ContestList";
export async function generateMetadata() {
  return await setPageMetaData({
    slug: "contests",
  });
}
export default function ContestPage() {
  return (
    <div>
      <div className="custom-container pt-28 pb-10">
        <QuizBanner
          title="Join the Ultimate Quiz Battle!"
          subtitle="Test Your Knowledge. Win exciting rewards."
          image="/contest-banner.webp"
          nextContest={true}
        />
        <ContestList />
      </div>
      <PageContent page={"contests"} />
    </div>
  );
}
