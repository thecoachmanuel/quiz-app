/** @format */

import ImageLoader from "@/components/ui/ImageLoader";
import { ASSETS_URL } from "@/configs";
import { QuizQuestionTranslation } from "@/types/question";
import { sanitizeText } from "@/utils/helper";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react/dist/ssr";
import WavesurferPlayer from "@wavesurfer/react";
import dynamic from "next/dynamic";
import React, { useCallback, useMemo, useState } from "react";
import type WaveSurfer from "wavesurfer.js";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type QuestionProps = {
  question_type?: string;
  translation?: QuizQuestionTranslation;
};

const QuestionTitle: React.FC<QuestionProps> = ({
  question_type,
  translation,
}) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = useCallback(() => {
    wavesurfer?.playPause();
  }, [wavesurfer]);

  const memoContent = useMemo(() => {
    if (!translation?.question_text) return "";

    return sanitizeText(translation.question_text);
  }, [translation]);

  if (!question_type || !translation?.question_text) return null;

  switch (question_type) {
    case "text":
      return (
        <div
          className="heading-4 text-center"
          dangerouslySetInnerHTML={{
            __html: memoContent,
          }}
        >
          {}
        </div>
      );

    case "image":
      return (
        <div className="mx-auto w-full max-w-[500px] lg:w-1/2">
          <ImageLoader
            src={translation.question_text}
            alt="Question"
            width={500}
            height={500}
          />
        </div>
      );

    case "video":
      console.log(translation.question_text);
      return (
        <div className="mx-auto w-full max-w-[500px] lg:w-1/2">
          <ReactPlayer
            width="100%"
            height="100%"
            url={ASSETS_URL + translation.question_text}
            controls
          />
        </div>
      );

    case "audio":
      return (
        <div className="bg-primary/5 mx-auto flex w-full max-w-[500px] gap-3 px-3 py-3 sm:px-6 sm:py-5 lg:w-1/2">
          <button
            onClick={togglePlayPause}
            className="bg-primary flex size-14 shrink-0 items-center justify-center rounded-full text-xl text-white sm:text-2xl"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <div className="flex-1">
            <WavesurferPlayer
              height={60}
              url={ASSETS_URL + translation.question_text}
              waveColor="#262D3B"
              progressColor="#4D6BFE"
              barWidth={2}
              barGap={1}
              onReady={setWavesurfer}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default QuestionTitle;
