/** @format */
"use client";
import { Button } from "@/components/ui/Button";
import useClickOutside from "@/hooks/useClickOutside";
import { useContestStatus } from "@/hooks/useContestStatus";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { ContestDetailsType } from "@/types/contest";
import { UserType } from "@/types/user";
import { cn } from "@/utils/cn";
import { dataEncode } from "@/utils/helper";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const Countdown = dynamic(() => import("@/components/ui/Countdown"), {
  ssr: false,
});

const ContestJoinModal = dynamic(() => import("./ContestJoinModal"), {
  ssr: false,
});

type Props = {
  contest: ContestDetailsType;
  refetch: () => void;
};
const PlayButton: React.FC<Props> = ({ contest, refetch }) => {
  const { modalRef, modal, setModal } = useClickOutside();
  const { tran } = useTranslations();
  const { user }: { user: UserType } = useAuthStore((state) => state);
  const { upcomingContest, runningContest, completedContest } =
    useContestStatus(contest);

  useEffect(() => {
    if (runningContest) {
      refetch();
    }
  }, [runningContest, refetch]);

  const participantStatus = contest?.participants?.length
    ? contest?.participants[0]?.status
    : "pending";

  return (
    <React.Fragment>
      {contest?.has_taken ? (
        <>
          {participantStatus === "submitted" && (
            <Button
              href={`/result/contest?contest=${contest?.translation.slug}&username=${dataEncode(user?.username)}`}
              className="w-full"
            >
              {tran("Show Result")}
            </Button>
          )}

          {participantStatus === "running" && (
            <Button
              href={`/play/contest?contest=${contest?.translation.slug}`}
              className="w-full"
            >
              {tran("Play Now")}
            </Button>
          )}

          {runningContest && participantStatus === "pending" && (
            <Button
              className="w-full"
              href={`/play/contest?contest=${contest?.translation?.slug}`}
            >
              {tran("Play Now")}
            </Button>
          )}

          {upcomingContest && (
            <>
              <Button
                className={cn(
                  upcomingContest
                    ? "text-primary w-full !cursor-default bg-transparent"
                    : "w-full",
                )}
              >
                <p>{tran("Countdown")}:</p>
                <Countdown dateTime={contest?.start_time || ""} />
              </Button>

              <div
                id="statusNote"
                className="bg-primary/10 text-primary my-3 rounded-xl px-4 py-3 text-sm"
              >
                {tran("Contest unlocks in")}{" "}
                <span className="font-semibold">
                  <Countdown dateTime={contest?.start_time || ""} />
                </span>
                .{" "}
                {tran(
                  "Please wait until the timer reaches zero to start playing.",
                )}
              </div>

              <Button className="w-full" disabled={true}>
                {tran("Play Now")}
              </Button>
            </>
          )}

          {participantStatus === "won" && (
            <Button
              className="w-full"
              href={`/result/contest?contest=${contest?.translation.slug}&username=${dataEncode(user?.username)}`}
            >
              {tran("Show Result")}
            </Button>
          )}
        </>
      ) : (
        <>
          {completedContest && (
            <Button
              className="w-full !cursor-default !text-red-500 hover:bg-transparent"
              variant="danger-outline"
              onClick={() => toast.error("Contest Ended")}
            >
              {tran("Contest Ended")}
            </Button>
          )}
          {(upcomingContest || runningContest) && (
            <Button className="w-full" onClick={() => setModal(true)}>
              {tran("Unlock Now")}
            </Button>
          )}
        </>
      )}
      <ContestJoinModal
        modalRef={modalRef}
        showModal={modal}
        setShowModal={setModal}
        contest={contest}
        refetch={refetch}
      />
    </React.Fragment>
  );
};

export default PlayButton;
