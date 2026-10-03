/** @format */

"use client";
import logo from "@/../public/logo.svg";
import AdSense from "@/components/extensions/AdSense";
import { Button } from "@/components/ui/Button";
import ImageLoader from "@/components/ui/ImageLoader";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import useClickOutside from "@/hooks/useClickOutside";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AppInfoType } from "@/types";
import { QuizQuestionType } from "@/types/quiz";
import { UserType } from "@/types/user";
import { dataEncode } from "@/utils/helper";
import { XIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";

const QuestionPage = dynamic(() => import("../Question"), {
  ssr: false,
});

const Modal = dynamic(() => import("@/components/ui/Modal"), {
  ssr: false,
});

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

const PageNotFound = dynamic(() => import("@/components/ui/PageNotFound"), {
  ssr: false,
});

const PALY_TYPE = "quiz";

export default function PlayQuiz() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const quiz = searchParams.get(PALY_TYPE);
  const level = searchParams.get("level_slug");
  // const [questionOrder, setQuestionOrder] = useState(1);
  const { modalRef, modal, setModal } = useClickOutside();
  const { appInfo, user }: { appInfo: AppInfoType; user: UserType } =
    useAuthStore((state) => state);

  const { data, isLoading, refetch, isFetching } = useGetQuery<
    QuizQuestionType[] | any
  >({
    url: `questions/${quiz}${level ? `?level=${level}` : ""}`,
  });

  const questionList = useMemo(() => {
    if (!data || !data?.length || !Array.isArray(data)) return [];
    return data?.sort((a: any, b: any) => a.order - b.order) || [];
  }, [data]);

  useEffect(() => {
    if (data && data?.status == "completed") {
      push(
        `/result/quiz?quiz=${quiz}&username=${dataEncode(user?.username)}${level ? `&level_slug=${level}` : ""}`,
      );
    }
  }, [data, level, push, quiz, user?.username]);

  const currentQuestion: QuizQuestionType = useMemo(() => {
    const currentQuestions = questionList?.filter(
      (quiz: any) => !quiz?.isAlreadyAnswered,
    );
    if (currentQuestions?.length) {
      const currentQuestion = currentQuestions[0];
      return currentQuestion as QuizQuestionType;
    }
    return {} as QuizQuestionType;
  }, [questionList]);

  const questionOrder = currentQuestion?.order || 1;

  const setQuestionTimeOut = useCallback(
    (updatedTime?: number) => {
      if (updatedTime) {
        localStorage.setItem(
          currentQuestion?.translation?.slug,
          updatedTime.toString(),
        );
        return;
      }
      if (currentQuestion) {
        localStorage.setItem(
          currentQuestion?.translation?.slug,
          ((currentQuestion?.time_limit || 0) * 60).toString(),
        );
      }
    },
    [currentQuestion],
  );

  const getQuestionTimeOut = () => {
    if (currentQuestion) {
      const stored = localStorage.getItem(currentQuestion?.translation?.slug);
      return stored ? parseInt(stored) : 0;
    }
    return 0;
  };
  if (isLoading) {
    return <Loader />;
  }

  if (!questionList?.length) {
    return (
      <PageNotFound
        title="No Quiz Found"
        message="The quiz you are looking for does not exist."
      />
    );
  }

  return (
    <React.Fragment>
      <div className="grid min-h-screen place-items-center py-6">
        <div className="custom-container w-full">
          <AdSense position="question_page_top" />
          <div className="py-10">
            <div className="bg-primary/5 border-dark5 flex w-full max-w-[1350px] flex-col items-center justify-center overflow-auto rounded-xl border p-6">
              <div className="cursor-disabled flex items-center justify-center gap-2">
                <ImageLoader
                  src={
                    appInfo?.application_info?.logo_favicon?.logo_dark || logo
                  }
                  alt={appInfo?.application_info?.company_info?.name}
                  className="max-sm:size-7"
                  width={40}
                  height={40}
                />
                <span className="heading-3">
                  {appInfo?.application_info?.company_info?.name}
                </span>
              </div>
              <div className="flex w-full items-center justify-center gap-3 max-md:flex-col lg:gap-6 lg:px-20">
                <div className="bg-primary/20 relative h-2 w-full rounded-full max-md:order-2">
                  <div
                    className="bg-primary absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${(100 / questionList.length) * questionOrder}%`,
                    }}
                  ></div>
                </div>
                <div className="flex items-center justify-start gap-3 max-md:order-1 max-md:w-full max-md:justify-between">
                  <div className="border-dark5 flex items-center justify-center gap-2 rounded-sm border px-2 py-2 max-md:text-sm md:px-4 md:py-3">
                    <span className="font-semibold max-[450px]:hidden">Q:</span>
                    <span className="flex items-center justify-center gap-1">
                      <span>{currentQuestion?.order}</span>/{" "}
                      <span>{questionList.length}</span>
                    </span>
                  </div>
                  <Button onClick={() => setModal(true)} variant="danger">
                    Cancel
                  </Button>
                </div>
              </div>

              <AdSense position="question_page_center" />

              {currentQuestion && (
                <QuestionPage
                  playType={PALY_TYPE}
                  refetch={refetch}
                  isFetching={isFetching}
                  questions={currentQuestion}
                  questionOrder={questionOrder}
                  totalQuestion={questionList.length}
                  setQuestionTimeOut={setQuestionTimeOut}
                  getQuestionTimeOut={getQuestionTimeOut}
                />
              )}
            </div>
          </div>
          <AdSense position="question_page_bottom" />
        </div>
      </div>
      <Modal modalRef={modalRef} openModal={modal} title="Cancel Quiz">
        <Button
          onClick={() => setModal(false)}
          variant="danger-outline"
          className="absolute top-4 right-4 rounded-full p-2"
        >
          <XIcon className="h-5 w-5" />
        </Button>
        <div className="relative flex flex-col gap-6">
          <Button
            href="/quizzes"
            variant="danger"
            onClick={() => setModal(false)}
          >
            Yes, Cancel
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
}
