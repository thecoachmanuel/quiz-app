/** @format */

"use client";

import { Button } from "@/components/ui/Button";
import { QuestionCountDownTimer } from "@/components/ui/QuestionCountDownTimer";
import { getQueryClient } from "@/configs/query-client";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestQuestionType } from "@/types/contest";
import { QuizQuestionType } from "@/types/quiz";
import { UserType } from "@/types/user";
import { dataEncode } from "@/utils/helper";
import confetti from "canvas-confetti";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import QuestionTitle from "./QuestionTitle";
import WrongMicSwitchButton from "./WrongMicSwitchButton";

const Explanation = dynamic(() => import("./Explanation"), {
  ssr: false,
});

const HintTooltip = dynamic(() => import("./HintTooltip"), {
  ssr: false,
});

const Options = dynamic(() => import("./Options"), {
  ssr: false,
});

const QuestionLoader = dynamic(() => import("./QuestionLoader"), {
  ssr: false,
});

export interface OptionsType {
  label: string;
  value: string;
}

export type QuestionPageProps = {
  playType: "quiz" | "contest";
  questions: QuizQuestionType | ContestQuestionType;
  questionOrder?: number;
  totalQuestion: number;
  refetch: () => void;
  setQuestionTimeOut: (updatedTime?: number) => void;
  getQuestionTimeOut: () => number;
  isFetching?: boolean;
};

export default function QuestionPage({
  playType,
  questions,
  questionOrder = 1,
  totalQuestion,
  refetch,
  setQuestionTimeOut,
  getQuestionTimeOut,
  isFetching,
}: QuestionPageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const { user }: { user: UserType } = useAuthStore((state) => state);
  const timeLimit = (questions?.time_limit || 0) * 60;
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizName = searchParams.get(playType);
  const level = searchParams.get("level_slug");
  const isMultipleAns = useMemo(
    () =>
      ["fill_in_the_blank", "multiple_choice"].includes(
        questions?.question_type || "",
      ),
    [questions],
  );
  const [isAlreadyAnswered, setIsAlreadyAnswered] = useState(false);

  const questionOrderNumber = questionOrder && Number(questionOrder);
  const { tran } = useTranslations();

  const { mutate, isLoading } = useQueryMutation({
    isPublic: false,
    url: `/${playType}-answer/${quizName}/${questions?.translation?.slug}${level ? `?level_slug=${level}` : ""}`,
  });

  const hendleSetSelectedAnswerAndCorrectAnswer = useEffectEvent(() => {
    setSelectedAnswer([]);
    setCorrectAnswer([]);
  });

  useEffect(() => {
    hendleSetSelectedAnswerAndCorrectAnswer();
  }, [questionOrderNumber]);

  const getTimeTaken = useCallback(() => {
    const stored = getQuestionTimeOut();
    const totalTime = (questions?.time_limit || 0) * 60;
    const timeUsed = stored ? totalTime - stored : totalTime;
    return timeUsed;
  }, [getQuestionTimeOut, questions]);

  const removeQuestionTimeOut = useCallback(() => {
    if (questions?.translation?.slug) {
      localStorage.removeItem(questions.translation.slug);
    }
  }, [questions]);

  const submitAnswer = useCallback(
    (answers: string[], e: React.MouseEvent<HTMLButtonElement>) => {
      if (!answers.length) {
        toast.error(tran("Please select at least one answer."));
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      removeQuestionTimeOut();
      mutate(
        { answers, taken_time: getTimeTaken() },
        {
          onSuccess: (res) => {
            const data = res?.data?.data;
            setCorrectAnswer(data?.correct_answers || []);
            setIsAlreadyAnswered(true);
            getQueryClient().invalidateQueries({
              queryKey: [
                "quizzes",
                { category: "all", page: 1, per_page: 9, search: "" },
                false,
              ],
            });
            if (data?.is_correct) {
              confetti({
                origin: {
                  x: x / window.innerWidth,
                  y: y / window.innerHeight,
                },
              });
            } else {
              if (isMicOn) {
                new Audio("/wrong.mp3").play();
              }
              toast.error(data?.message);
            }
          },
        },
      );
    },
    [mutate, getTimeTaken, tran, removeQuestionTimeOut, isMicOn],
  );

  const handleOnCompleteTimer = () => {
    if (isAlreadyAnswered) {
      return;
    }
    mutate(
      { answers: [], taken_time: questions?.time_limit },
      {
        onSuccess: (res) => {
          const data = res?.data?.data;

          setCorrectAnswer(data?.correct_answers || []);

          setIsAlreadyAnswered(true);

          removeQuestionTimeOut();
        },
        onError: (response: any) => {
          toast.error(response?.data?.data?.message);
        },
      },
    );
  };

  const showResult = useCallback(() => {
    if (questions?.translation?.slug) {
      localStorage.removeItem(questions.translation.slug);
    }
    router.push(
      `/result/${playType}?${playType}=${quizName}&username=${dataEncode(user?.username)}${level ? `&level_slug=${level}` : ""}`,
    );
  }, [questions, playType, quizName, level, router, user]);

  const questionButton = useMemo(() => {
    if (isAlreadyAnswered && questionOrderNumber == totalQuestion) {
      return <Button onClick={showResult}>{tran("Result")}</Button>;
    }

    return (
      <div className="flex items-center gap-3">
        <Button
          disabled={isAlreadyAnswered}
          loading={isLoading}
          onClick={(e) => {
            submitAnswer(selectedAnswer, e);
          }}
        >
          {tran("Submit")}
        </Button>

        <Button
          onClick={() => {
            refetch();
            localStorage.removeItem(questions?.translation?.slug || "");
            setIsAlreadyAnswered(false);
          }}
          disabled={isLoading || !isAlreadyAnswered}
          variant="secondary"
          className="text-text"
        >
          {tran("Continue")}
        </Button>
      </div>
    );
  }, [
    tran,
    isAlreadyAnswered,
    questionOrderNumber,
    totalQuestion,
    refetch,
    isLoading,
    submitAnswer,
    selectedAnswer,
    questions,
    showResult,
  ]);

  return (
    <div className="flex w-full flex-col pt-4 sm:px-6 lg:px-20">
      {isFetching && totalQuestion != questionOrder ? (
        <QuestionLoader />
      ) : (
        <>
          <QuestionTitle
            question_type={questions?.question_input_type}
            translation={questions?.translation}
          />

          <div className="relative flex w-full items-center justify-center gap-6 py-6 max-lg:flex-col lg:py-10 2xl:gap-12">
            <Explanation
              explanation_type={questions?.explanation_type}
              translation={questions?.translation}
            />
            <Options
              correctAnswer={correctAnswer}
              options={questions?.options}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
              isAlreadyAnswered={isAlreadyAnswered}
              isMultipleAns={isMultipleAns}
            />
          </div>

          <div className="border-dark5 flex w-full flex-wrap items-center justify-between gap-3 border-t pt-4 sm:gap-6">
            <QuestionCountDownTimer
              initialDuration={timeLimit}
              size={60}
              progressColor="var(--primary)"
              questionOrder={questionOrder}
              setQuestionTimeOut={setQuestionTimeOut}
              getQuestionTimeOut={getQuestionTimeOut}
              removeQuestionTimeOut={handleOnCompleteTimer}
              isAlreadyAnswered={isAlreadyAnswered}
            />

            <div className="flex flex-wrap gap-3">
              <HintTooltip hint={questions?.translation?.hints} />
              <WrongMicSwitchButton isMicOn={isMicOn} setIsMicOn={setIsMicOn} />
              {questionButton}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
