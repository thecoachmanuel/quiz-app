"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/Button";
import ImageLoader from "@/components/ui/ImageLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { cn } from "@/utils/cn";
import { InfoIcon, VaultIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const OTHER_GAMES_LIST = [
  {
    mode: "main",
    name: "Wordling Main",
    icon: "/main.svg",
    href: "/games/wordling",
  },
  {
    mode: "max",
    name: "Wordling Max",
    icon: "/max.svg",
    href: "/games/wordling-max",
  },
  {
    mode: "mini",
    name: "Wordling Mini",
    icon: "/mini.svg",
    href: "/games/wordling-mini",
  },
];

function ResultsDialogComponent({
  open,
  onOpenChange,
  gameDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameDate?: string;
}) {
  const { data: resultData, isLoading: isLoadingResult } = useGetQuery({
    url: `/games/hexling/game-result`,
    params: {
      game_date: gameDate,
    },
  });

  const gamePoints = resultData?.gamePoints || 0;
  const earnPoints = resultData?.earnPoints || 0;
  const secretWords = resultData?.secretWords || [];
  const guessedWords = resultData?.guessedWords || [];
  const allBadges = resultData?.allBadges || [];
  const currentBadge = resultData?.currentBadge || null;
  const gameInfo = resultData?.game_info || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full overflow-y-auto sm:max-h-[90dvh]">
        {isLoadingResult ? (
          <div className="flex h-full max-h-[30vh] items-center justify-center overflow-hidden">
            <DialogTitle className="mb-2 border-0 font-bold"></DialogTitle>
            <Loading />
          </div>
        ) : (
          <div>
            <DialogHeader className="px-0">
              <DialogTitle className="mb-2 border-0 font-bold">
                Stats
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="score" className="w-full">
              <TabsList className="bg-primary/10 w-full">
                <TabsTrigger
                  className="bg-dark4 data-[state=active]:bg-primary data-[state=active]:text-dark4 mx-1"
                  value="score"
                >
                  Score
                </TabsTrigger>
                <TabsTrigger
                  className="bg-dark4 data-[state=active]:bg-primary data-[state=active]:text-dark4 mx-1"
                  value="progress"
                >
                  Your Progress
                </TabsTrigger>
                <TabsTrigger
                  className="bg-dark4 data-[state=active]:bg-primary data-[state=active]:text-dark4 mx-1"
                  value="answer"
                >
                  Answers
                </TabsTrigger>
              </TabsList>
              <TabsContent value="score">
                <div className="flex flex-col gap-3 md:px-0">
                  <div className="bg-accent flex flex-col items-center justify-center gap-6 rounded-md px-4 py-8">
                    {currentBadge ? (
                      <div className="flex size-12 items-center justify-center rounded-full text-center text-2xl font-bold tracking-widest whitespace-nowrap md:text-3xl">
                        <ImageLoader
                          src={currentBadge?.image}
                          alt={currentBadge?.name}
                          width={100}
                          height={100}
                          className="hidden"
                        />
                        <p>{currentBadge?.name.toUpperCase()}</p>
                      </div>
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-full text-center text-2xl font-bold tracking-widest whitespace-nowrap md:text-3xl">
                        <ImageLoader
                          src={allBadges[0]?.badge_image}
                          alt={allBadges[0]?.badge_name}
                          width={100}
                          height={100}
                          className="hidden"
                        />

                        <p>{allBadges[0]?.badge_name.toUpperCase()}</p>
                      </div>
                    )}

                    <div className="flex w-full flex-row justify-evenly gap-1.5">
                      <div className="flex flex-1 flex-col items-center gap-1.5">
                        <span className="items-center text-3xl">
                          {earnPoints}
                        </span>
                        <span className="text-sm font-bold tracking-widest">
                          SCORE
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col items-center gap-1.5">
                        <a className="text-3xl">
                          <span className="text-primary">
                            {" "}
                            {guessedWords.length}
                          </span>
                          /{gameInfo?.secret_words_count}
                        </a>
                        <span className="text-center text-sm font-bold tracking-widest">
                          WORDS
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-center text-sm font-bold tracking-wider">
                    PLAY OTHER GAMES
                  </span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {OTHER_GAMES_LIST.map(({ href, mode, name, icon }) => (
                      <Link
                        href={href}
                        key={mode}
                        className="min-w-[150px] grow"
                        onClick={() => {
                          onOpenChange?.(false);
                        }}
                      >
                        <CardContent className="hover:bg-muted h-full p-0 shadow-none">
                          <CardContent className="border-light2/20 flex flex-col items-center justify-center rounded-md border p-3">
                            <div className="relative mb-2 hidden h-[36px] sm:mb-1">
                              <ImageLoader
                                src={icon}
                                alt={mode}
                                width={36}
                                height={36}
                              />
                              {mode === "vault" && (
                                <div className="absolute -top-2 -right-3 rounded-full bg-teal-700 p-1">
                                  <VaultIcon className="size-4 text-teal-50" />
                                </div>
                              )}
                            </div>
                            <span className="w-full text-center text-sm font-bold tracking-wider uppercase">
                              {name}
                            </span>
                          </CardContent>
                        </CardContent>
                      </Link>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="progress">
                {earnPoints <= gamePoints && (
                  <p className="text-muted-foreground my-3 text-center text-sm">
                    You need more{" "}
                    <b className="text-primary">{gamePoints - earnPoints}</b>{" "}
                    points to get all badges.
                  </p>
                )}

                <div className="mt-3">
                  <Table className="mx-auto max-w-[200px] overflow-x-auto sm:max-w-xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-3">Badges</TableHead>
                        <TableHead className="px-6 text-right">
                          Badge Points
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allBadges?.map((badgesData: any) => (
                        <TableRow key={badgesData.badge_name}>
                          <TableCell className="px-6 capitalize">
                            <div className="flex items-center gap-2">
                              <ImageLoader
                                src={badgesData.badge_image}
                                alt={badgesData.badge_name}
                                width={100}
                                height={100}
                                className="hidden"
                              />

                              <p>{badgesData.badge_name.toUpperCase()}</p>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 text-right">
                            {badgesData.badge_points}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Alert className="bg-light2/5 border-light2/20 mt-1 text-black">
                  <InfoIcon className="size-4" />
                  <AlertTitle>How to earn points</AlertTitle>
                  <AlertDescription>
                    <span>
                      Each 4-letter word is worth 1 point, while longer words
                      earn points equal to their length (e.g., DUWAG is worth 5
                      points, MANONG is worth 6 points, and so on).
                    </span>
                  </AlertDescription>
                </Alert>
              </TabsContent>
              <TabsContent value="answer">
                {earnPoints < gamePoints ? (
                  <Alert className="border-light2/20 mt-1">
                    <InfoIcon className="size-4" />
                    <AlertTitle className="text-secondary font-bold">
                      WARNING
                    </AlertTitle>
                    <AlertDescription className="">
                      <span>
                        Answers will be revealed only after you&apos;ve guessed
                        all the words. If you choose to reveal the answers now,{" "}
                        <b className="text-secondary/90">
                          you won&apos;t be able to enter any more words or
                          continue playing this round.
                        </b>{" "}
                        Click the button below to proceed.
                      </span>
                    </AlertDescription>
                    <div></div>
                    <div className="mt-6 flex w-full flex-col justify-end gap-2 md:flex-row md:gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          onOpenChange?.(false);
                        }}
                      >
                        Continue Playing
                      </Button>
                    </div>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3">
                    {secretWords.map((word: string) => (
                      <div key={word} className="flex flex-row gap-1">
                        <span
                          className={cn("text-muted-foreground", {
                            "font-bold text-green-500":
                              guessedWords.includes(word),
                          })}
                        >
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ResultsDialog({
  open,
  onOpenChange,
  gameDate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameDate: string;
}) {
  if (open) {
    return (
      <ResultsDialogComponent
        open={open}
        onOpenChange={onOpenChange}
        gameDate={gameDate}
      />
    );
  }

  return null;
}
