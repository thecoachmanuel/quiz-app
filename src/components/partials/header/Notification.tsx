"use client";

import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import moment from "moment";
import { useCallback, useEffect, useEffectEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { privateInstance } from "@/configs/axiosConfig";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";

import { getQueryClient } from "@/configs/query-client";
import { useTranslations } from "@/providers/TranslationProviders";
import { AppInfoType, NotificationType } from "@/types";
import { ArrowRightIcon, BellIcon } from "@phosphor-icons/react/dist/ssr";

type Props = {
  appInfo: {
    firebase: AppInfoType["firebase"];
  };
};

interface NotificationState {
  notifications: {
    data: NotificationType[];
  };
  unread_count: number;
}

export const FirebaseNotification = ({ appInfo: { firebase } }: Props) => {
  const [initialized, setInitialized] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { tran } = useTranslations();
  const { data, isLoading } = useGetQuery<NotificationState>({
    url: "/profile/notifications",
    params: { per_page: 5, unread: true },
    queryKey: ["notifications-unread"],
  });

  const [isMounted, setIsMounted] = useState(false);

  const handleSetIsMounted = useEffectEvent(() => {
    setIsMounted(true);
  });

  useEffect(() => {
    handleSetIsMounted();
  }, []);

  // Push token to server
  const sendFcmToken = useCallback(async (token: string) => {
    try {
      await privateInstance.post("profile/update-fcm-token", { token });
    } catch (err) {
      console.warn("Error sending FCM token:", err);
    }
  }, []);

  // Initialize Firebase and Notification
  const initFirebase = useCallback(async () => {
    if (
      initialized ||
      (isMounted && typeof window === "undefined") ||
      typeof Notification === "undefined" ||
      typeof Notification.requestPermission !== "function" ||
      !firebase?.apiKey
    ) {
      return;
    }

    try {
      const app: FirebaseApp = initializeApp(firebase);
      const messaging = getMessaging(app);

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        return;
      }

      const token = await getToken(messaging, {
        vapidKey: firebase.vapidKey ?? "",
        serviceWorkerRegistration: await navigator.serviceWorker.ready,
      });

      if (token) {
        await sendFcmToken(token);
        console.warn("FCM token sent to server");
      } else {
        console.warn("No FCM token retrieved.");
      }

      onMessage(messaging, (payload) => {
        // Extract title and body from both notification and data payload
        const msgTitle =
          payload.notification?.title ||
          payload.data?.title ||
          "New Notification";
        const msgBody = payload.notification?.body || payload.data?.body || "";
        const msgId = payload.data?.id || undefined;

        if (!msgBody) {
          console.warn("No message body, skipping");
          return;
        }

        // Add to local notifications state with duplicate detection
        setNotifications((prev) => {
          // Simplified duplicate check - just check body
          const isDuplicate = prev.some((n) => n.data === msgBody);
          if (isDuplicate) {
            console.warn("Duplicate notification, skipping");
            return prev;
          }

          const newNotif = {
            id: msgId ? Number(msgId) : Date.now(),
            data: msgBody,
            read_at: null,
            created_at: new Date().toISOString(),
          };

          const updated = [newNotif, ...prev];
          return updated;
        });

        setUnreadCount((prev) => {
          const newCount = prev + 1;
          return newCount;
        });

        // Refetch notifications from API
        getQueryClient().refetchQueries({
          queryKey: ["notifications-unread"],
        });

        // Show browser notification
        const n = new Notification(msgTitle, { body: msgBody });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      });

      setInitialized(true);
    } catch (err) {
      console.warn("Firebase init failed:", err);
    }
  }, [firebase, initialized, sendFcmToken, isMounted]);

  const handleInitFirebase = useEffectEvent(() => {
    initFirebase();
  });

  // Sync notifications from API - MERGE instead of overwrite
  const handleSetNotifications = useEffectEvent(() => {
    if (data?.notifications?.data) {
      const apiNotifications = data.notifications.data;

      setNotifications((prev) => {
        // Get IDs of existing local notifications
        const existingIds = new Set(prev.map((n) => n.id));

        // Find new notifications from API that we don't have locally
        const newFromApi = apiNotifications.filter(
          (n) => !existingIds.has(n.id),
        );

        // Merge: keep existing + add new from API
        const merged = [...prev, ...newFromApi];

        // Sort by created_at (newest first)
        return merged
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 10);
      });

      // Update unread count to max of current or API
      setUnreadCount((prev) => Math.max(prev, data.unread_count));
    }
  });

  useEffect(() => {
    if (firebase?.apiKey) {
      handleInitFirebase();
    }
  }, [firebase, initFirebase]);

  useEffect(() => {
    handleSetNotifications();
  }, [data]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:outline-none">
        <Button
          size="sm"
          className="relative size-10 rounded-full max-sm:p-2 sm:size-12"
        >
          <BellIcon className="text-xl sm:text-2xl" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="space-y-1">
        {notifications.map((n, i) => (
          <DropdownMenuItem
            key={`notif-${i}`}
            className="bg-secondary/5 flex flex-col items-start gap-1 py-1"
          >
            <span>{n.data}</span>
            <span className="text-light4 text-xs">
              {moment(n.created_at).fromNow()}
            </span>
          </DropdownMenuItem>
        ))}

        {notifications.length > 2 && (
          <DropdownMenuItem className="text-muted-foreground p-0 text-sm">
            <Button
              size="sm"
              href="/dashboard/notifications"
              className="w-full"
              variant="outline"
            >
              <span>{tran("View all")}</span> <ArrowRightIcon />
            </Button>
          </DropdownMenuItem>
        )}

        {notifications.length === 0 && !isLoading && (
          <DropdownMenuItem className="text-muted-foreground text-sm">
            {tran("No notifications")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
