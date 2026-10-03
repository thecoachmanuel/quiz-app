import ImageLoader from "@/components/ui/ImageLoader";
import { cn } from "@/utils/cn";

export default function ScoreTracker({
  userSubmissionData,
}: {
  userSubmissionData: any;
}) {
  const lastBadgePosition =
    userSubmissionData?.hexling_play?.earned_badges.length - 1;

  if (userSubmissionData?.hexling_play?.completed_at) {
    return (
      <div className="bg-primary/10 border-primary relative mx-auto flex w-[90%] max-w-[600px] flex-col gap-3 rounded-lg border select-none">
        <div className="flex h-full flex-col items-center justify-center">
          <span className="text-primary leading-widest text-sm font-bold">
            YOUR FINAL RANK
          </span>
          <span className="text-primary text-center text-2xl font-bold tracking-widest">
            {userSubmissionData?.hexling_play?.earned_badges && (
              <ImageLoader
                src={
                  userSubmissionData?.hexling_play?.earned_badges[
                    lastBadgePosition
                  ]?.badge_image
                }
                alt={
                  userSubmissionData?.hexling_play?.earned_badges[
                    lastBadgePosition
                  ]?.badge_name
                }
                width={50}
                height={50}
                className="hidden"
              />
            )}
            {"  "}

            {
              userSubmissionData?.hexling_play?.earned_badges[lastBadgePosition]
                ?.badge_name
            }
          </span>
          <span className="text-primary leading-widest text-sm font-bold">
            {userSubmissionData?.hexling_play?.earned_points} POINTS
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[600px] flex-col gap-3 px-4 select-none">
      <div className="flex items-center justify-center">
        <span className="text-primary text-center text-xl font-bold tracking-widest uppercase">
          {userSubmissionData?.hexling_play?.upcoming_badges ? (
            <ImageLoader
              src={
                userSubmissionData?.hexling_play?.upcoming_badges?.badge_image
              }
              alt={
                userSubmissionData?.hexling_play?.upcoming_badges?.badge_name
              }
              width={50}
              height={50}
              className="hidden"
            />
          ) : (
            ""
          )}
          {"  "}
          {userSubmissionData?.hexling_play?.upcoming_badges
            ? userSubmissionData?.hexling_play?.upcoming_badges?.badge_name
            : ""}
        </span>
      </div>

      <div className="z-1 flex w-full items-center justify-between gap-1.5">
        {userSubmissionData?.hexling_word?.badges?.map(
          (badge: { badge_name: string; badge_points: number }, i: number) => (
            <div
              key={badge.badge_name}
              className={cn(
                "bg-primary/20 relative h-3 w-3 min-w-3 rounded-full transition-all",
                {
                  "w-full":
                    userSubmissionData?.hexling_play?.upcoming_badges
                      ?.badge_name === badge.badge_name,
                  "bg-primary":
                    userSubmissionData?.hexling_play?.earned_badges[i]
                      ?.badge_name === badge.badge_name,

                  "last:w-full":
                    userSubmissionData?.hexling_play?.upcoming_badges === null,
                },
              )}
            >
              {userSubmissionData?.stats?.upcoming_badges?.badge_name ===
                badge.badge_name && (
                <>
                  <div
                    className="bg-primary relative h-full rounded-full px-4 transition-all"
                    style={{
                      width: `${(userSubmissionData?.stats?.current_badge_points / userSubmissionData?.stats?.upcoming_badges?.badge_points) * 100}%`,
                    }}
                  >
                    <span className="bg-primary text-dark2 absolute -top-1 right-0 z-1 h-6 rounded-full px-2 text-center font-bold">
                      {userSubmissionData?.stats?.current_badge_points}
                    </span>
                  </div>

                  <span className="absolute -right-1 -bottom-6 z-1 font-bold opacity-80">
                    {userSubmissionData?.stats?.upcoming_badges?.badge_points}
                  </span>
                </>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
