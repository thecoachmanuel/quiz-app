import WordListContent from "./word-list-content";

export default function WordListCard({
  userSubmissionData,
  isLoading,
}: {
  userSubmissionData: any;
  isLoading: boolean;
}) {
  return (
    <div className="border-light2/20 bg-primary/5 m-6 hidden h-full max-h-[calc(100dvh-108px)] w-full max-w-[400px] min-w-[350px] flex-col gap-4 overflow-hidden rounded-lg border pt-6 lg:flex">
      <WordListContent
        isLoading={isLoading}
        userSubmissionData={userSubmissionData}
      />
    </div>
  );
}
