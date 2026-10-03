/** @format */

import Pagination from "@/components/ui/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useTimeTaken } from "@/hooks/useTimeTaken";
import { useTranslations } from "@/providers/TranslationProviders";
import {
  ContestType,
  ParticipantPaginationType,
  ParticipantType,
} from "@/types/contest";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

const DataNotFound = dynamic(() => import("@/components/ui/DataNotFound"), {
  ssr: false,
});

const ImageLoader = dynamic(() => import("@/components/ui/ImageLoader"), {
  ssr: false,
});

type Params = {
  contest: ContestType;
};
const Participants: React.FC<Params> = ({
  contest: {
    translation: { slug },
  },
}) => {
  const { tran } = useTranslations();
  const [page, setPage] = useState(1);
  const { data: participants, isLoading } =
    useGetQuery<ParticipantPaginationType>({
      url: `/contest-participants/${slug} `,
      params: {
        page,
      },
    });

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  return (
    <div className="pt-8">
      <div className="">
        <h5 className="heading-5">{tran("Participants")}</h5>
        <Table className="mt-6 overflow-hidden rounded-xl font-medium">
          <TableHeader className="bg-primary/10">
            <TableRow>
              <TableHead>{tran("Rank")}</TableHead>
              <TableHead>{tran("Player")}</TableHead>
              <TableHead>{tran("Score")}</TableHead>
              <TableHead>{tran("Time")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Loader className="h-40" />
                </TableCell>
              </TableRow>
            ) : (
              <ParticipantTable participants={participants?.data} />
            )}
          </TableBody>
        </Table>
        {participants?.data?.length ? (
          <Pagination
            currentPage={participants?.current_page || 1}
            lastPage={participants?.last_page || 1}
            onPageChange={handlePageChange}
          />
        ) : (
          <DataNotFound
            title="No Participants Found"
            message="The participants you are looking for does not exist."
            imageSize="sm"
          />
        )}
      </div>
    </div>
  );
};

export default Participants;

const ParticipantTable = ({
  participants,
}: {
  participants: ParticipantType[] | undefined;
}) => {
  const { tran } = useTranslations();
  const timeTaken = useTimeTaken();
  return participants?.length
    ? participants?.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item?.rank}</TableCell>
          <TableCell className="flex items-center justify-start gap-2">
            <ImageLoader
              src={item?.user?.avatar}
              user={item?.user}
              width={24}
              height={24}
              className="size-6 rounded-full"
            />
            {item?.user?.full_name}
          </TableCell>
          <TableCell>{item?.score}</TableCell>
          <TableCell>
            {timeTaken(item?.time_taken || 0)} {tran("min")}
          </TableCell>
        </TableRow>
      ))
    : null;
};
