"use client";

import { Button } from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import { getQueryClient } from "@/configs/query-client";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useTranslations } from "@/providers/TranslationProviders";
import { NotificationResponseType } from "@/types";
import { SpinnerIcon, TrashIcon } from "@phosphor-icons/react";
import { BellIcon, BellRingingIcon } from "@phosphor-icons/react/dist/ssr";
import moment from "moment";
import { useEffect, useState } from "react";

const NotificationPage = () => {
  const [page, setPage] = useState(1);
  const { tran } = useTranslations();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { data, isLoading, refetch } = useGetQuery<NotificationResponseType>({
    url: `/profile/notifications?page=${page}`,
    params: { per_page: 10 },
    queryKey: ["notifications", page],
  });

  const { mutate } = useQueryMutation({
    url: "/profile/notifications",
  });

  const { mutate: deleteAll, isLoading: allDeleteLoading } = useQueryMutation({
    url: "/profile/notifications",
  });

  const { mutate: deleteOne, isLoading: oneDeleteLoading } = useQueryMutation({
    url: "/profile/notifications",
  });

  const refetchNotifications = () => {
    getQueryClient().refetchQueries({
      queryKey: [
        ["notifications-unread"],
        { per_page: 5, unread: true },
        false,
      ],
    });
  };

  useEffect(() => {
    const allUnreadIds = data?.data
      ?.filter((n) => !n.read_at)
      ?.map((n) => n.id);
    if (allUnreadIds?.length) {
      mutate(
        { ids: allUnreadIds },
        {
          onSuccess: () => {
            refetch();
            refetchNotifications();
          },
        },
      );
    }
  }, [data, mutate, refetch]);

  const handleAllDelete = () => {
    if (data?.data?.length) {
      deleteAll(
        { _method: "DELETE" },
        {
          onSuccess: () => {
            refetch();
            refetchNotifications();
          },
        },
      );
    }
  };

  const handleOneDelete = (id: number) => {
    setLoadingId(id);
    deleteOne(
      { _method: "DELETE", updatedUrl: `/profile/notifications/${id}` },
      {
        onSuccess: () => {
          refetch();
          refetchNotifications();
          setLoadingId(null);
        },
      },
    );
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-primary/10 border-primary/20 mb-6 flex items-center justify-between rounded-lg border p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <BellIcon className="text-primary h-8 w-8" />
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                {tran("Notifications")}
              </h1>
              <p className="text-muted-foreground">
                {data?.total || 0} {tran("Total Notifications")}
              </p>
            </div>
          </div>
          <Button
            onClick={handleAllDelete}
            variant="danger"
            size="sm"
            loading={allDeleteLoading}
          >
            {tran("Clear All")}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-primary/10 border-primary/20 rounded-lg border p-8 text-center shadow-sm">
            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
            <p className="text-muted-foreground">
              {tran("Loading notifications......")}
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && (
          <div className="space-y-3">
            {!data?.data?.length ? (
              <div className="bg-primary/10 border-primary/20 rounded-lg border p-8 text-center shadow-sm">
                <BellRingingIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-medium">
                  {tran("No Notifications")}
                </h3>
                <p className="text-muted-foreground">
                  {tran("You don't have any notifications")}
                </p>
              </div>
            ) : (
              data?.data?.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-primary/10 border-primary rounded-lg border border-l-4 shadow-sm"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">
                        {notification.data}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {moment(notification.created_at).fromNow()}
                      </p>
                    </div>
                    <div
                      onClick={() => handleOneDelete(notification.id)}
                      className="cursor-pointer text-red-500 hover:text-red-600"
                    >
                      {oneDeleteLoading && loadingId === notification.id ? (
                        <SpinnerIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {/* Pagination Info */}
        <Pagination
          currentPage={data?.current_page || 1}
          lastPage={data?.last_page || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default NotificationPage;
