"use client";

import { ADMIN_MENU } from "@/configs/adminMenu";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { adminFetch, ADMIN_API_BASE } from "@/configs/adminApi";

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

interface Notification {
  id: number;
  data: string;
  created_at: string;
}

// Flatten menu for search
function flattenMenu(
  items: typeof ADMIN_MENU
): { title: string; href: string }[] {
  const result: { title: string; href: string }[] = [];
  for (const item of items) {
    if (item.href) result.push({ title: item.title, href: item.href });
    if (item.submenus) {
      for (const sub of item.submenus) {
        if (sub.href) result.push({ title: sub.title, href: sub.href });
        if (sub.submenus) {
          for (const s of sub.submenus) {
            if (s.href) result.push({ title: s.title, href: s.href });
          }
        }
      }
    }
  }
  return result;
}

const ALL_LINKS = flattenMenu(ADMIN_MENU);

export default function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAdminAuthStore();

  const [isDark, setIsDark] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifCount, setNotifCount] = useState(0);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Initialize dark mode
  useEffect(() => {
    const isDarkStored = localStorage.getItem("theme") === "dark";
    setIsDark(isDarkStored);
    if (isDarkStored) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminFetch("/logout", { method: "POST" });
    } catch {}
    logout();
    router.push("/admin/login");
  };

  const filteredLinks = searchQuery
    ? ALL_LINKS.filter((l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const avatarUrl =
    user?.avatar ||
    `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || "Admin")}&background=6366f1&color=fff`;

  return (
    <nav className="admin-topbar">
      <div className="flex justify-between items-center h-full">
        {/* Left side */}
        <div className="flex gap-4 items-center">
          <button
            onClick={onToggleSidebar}
            className="admin-topbar-btn"
            aria-label="Toggle sidebar"
          >
            <i className="ph ph-list text-2xl"></i>
          </button>

          {/* Search */}
          <div className="relative admin-dropdown" ref={searchRef}>
            <div
              className="max-md:hidden rounded-lg border focus-within:border-[var(--admin-primary)] border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-500)] bg-[var(--admin-neutral-0)] dark:bg-[var(--admin-neutral-904)] p-1 flex items-center gap-2 min-w-[240px]"
              onClick={() => setShowSearchDropdown(true)}
            >
              <input
                type="text"
                className="px-3 w-full bg-transparent text-sm outline-none text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-20)]"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
              />
              <span className="size-8 shrink-0 rounded-full flex items-center justify-center">
                <i className="ph ph-magnifying-glass text-xl"></i>
              </span>
            </div>

            {showSearchDropdown && filteredLinks.length > 0 && (
              <div className="absolute top-[105%] left-0 w-full admin-dropdown-menu admin-white-box !p-1.5 space-y-1 max-h-[300px] overflow-y-auto admin-custom-scrollbar z-50">
                {filteredLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="px-3 py-2.5 duration-300 rounded-md block hover:bg-[rgba(99,102,241,0.1)] text-sm"
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchDropdown(false);
                    }}
                  >
                    <span className="font-medium">{link.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex gap-2 md:gap-3 items-center">
          {/* Fullscreen */}
          <button
            title="Toggle Fullscreen"
            onClick={toggleFullscreen}
            className="admin-topbar-btn max-sm:hidden"
          >
            <i
              className={`ph ${isFullscreen ? "ph-corners-in" : "ph-corners-out"} text-xl`}
            ></i>
          </button>

          {/* Frontend link */}
          <a
            href={process.env.NEXT_PUBLIC_BASE_URL || "/"}
            target="_blank"
            className="admin-topbar-btn"
            title="Visit Frontend"
          >
            <i className="ph ph-globe text-xl"></i>
          </a>

          {/* Dark mode */}
          <button
            title="Toggle Theme"
            onClick={toggleDark}
            className="admin-topbar-btn"
          >
            <i className={`ph ${isDark ? "ph-sun" : "ph-moon"} text-xl`}></i>
          </button>

          {/* Notifications */}
          <div className="relative admin-dropdown" ref={notifRef}>
            <div className="relative">
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 text-xs flex items-center justify-center text-white bg-[var(--admin-primary)] rounded-full z-10">
                  {notifCount}
                </span>
              )}
              <button
                title="Notifications"
                className="admin-topbar-btn"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              >
                <i className="ph ph-bell text-xl"></i>
              </button>
            </div>

            {showNotifDropdown && (
              <div className="admin-dropdown-menu w-[300px] right-0">
                <div className="flex items-center justify-between border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-500)] p-3 px-4">
                  <h5 className="font-semibold text-base">Notifications</h5>
                  <Link
                    href="/admin/notifications"
                    className="text-xs text-[var(--admin-primary)]"
                    onClick={() => setShowNotifDropdown(false)}
                  >
                    View All
                  </Link>
                </div>
                <ul className="flex flex-col gap-2 p-4 max-h-[320px] overflow-y-auto admin-custom-scrollbar">
                  {notifications.length === 0 ? (
                    <li className="text-sm text-center text-[var(--admin-neutral-100)] py-4">
                      No notifications
                    </li>
                  ) : (
                    notifications.map((n) => (
                      <li key={n.id}>
                        <Link
                          href={`/admin/notifications/${n.id}`}
                          className="flex cursor-pointer gap-2 rounded-md p-2 duration-300 bg-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.1)] text-sm"
                          onClick={() => setShowNotifDropdown(false)}
                        >
                          {n.data}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="relative admin-dropdown shrink-0" ref={profileRef}>
            <button
              title="User Profile"
              className="size-9 cursor-pointer"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <img
                src={avatarUrl}
                className="rounded-full w-9 h-9 object-cover border-2 border-[var(--admin-neutral-30)]"
                alt="profile"
              />
            </button>

            {showProfileDropdown && (
              <div className="admin-dropdown-menu right-0 w-[250px]">
                <div className="flex flex-col items-center border-b border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-500)] p-4 text-center">
                  <img
                    src={avatarUrl}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                    alt="profile"
                  />
                  <h6 className="font-medium mt-2 text-sm">
                    {user?.full_name || "Admin"}
                  </h6>
                  <span className="text-xs text-[var(--admin-neutral-100)]">
                    {user?.email}
                  </span>
                </div>
                <ul className="flex flex-col p-3 gap-1">
                  <li>
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 duration-300 hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--admin-primary)] text-sm"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <i className="ph ph-user text-xl"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/settings/general"
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 duration-300 hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--admin-primary)] text-sm"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <i className="ph ph-gear text-xl"></i>
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 duration-300 hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--admin-primary)] text-sm"
                    >
                      <i className="ph ph-sign-out text-xl"></i>
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
