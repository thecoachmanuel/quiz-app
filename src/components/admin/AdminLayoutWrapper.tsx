"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminFetch } from "@/configs/adminApi";
import { Toaster } from "react-hot-toast";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({
  children,
}: AdminLayoutWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, isAuthenticated, setUser, logout } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Public routes that don't need auth
  const isPublicRoute = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ].some((p) => pathname.startsWith(p));

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isPublicRoute) {
        setIsCheckingAuth(false);
        return;
      }

      if (!token) {
        router.push("/admin/login");
        setIsCheckingAuth(false);
        return;
      }

      try {
        const { data, ok } = await adminFetch<{ data: any }>("/profile");
        if (ok && data?.data) {
          setUser(data.data);
        }
      } catch {
        // In local/demo mode or temporary network downtime, keep existing session
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Auto-close sidebar on small screens when route changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1200) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  // Open sidebar on large screens by default
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1200) {
      setSidebarOpen(true);
    }
  }, []);

  // Loading state
  if (isCheckingAuth && !isPublicRoute) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--admin-neutral-0)] dark:bg-[var(--admin-neutral-904)]">
        <div className="flex flex-col items-center gap-4">
          <svg className="admin-spinner" viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20"></circle>
          </svg>
          <span className="text-sm text-[var(--admin-neutral-500)]">
            Loading admin panel...
          </span>
        </div>
      </div>
    );
  }

  // Public pages (login etc.) — no layout
  if (isPublicRoute) {
    return (
      <div className="admin-wrapper dark:bg-[var(--admin-neutral-903)]">
        <Toaster position="top-right" />
        {children}
      </div>
    );
  }

  return (
    <div className="admin-wrapper dark:bg-[var(--admin-neutral-903)]">
      <Toaster position="top-right" />

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Topbar */}
      <div
        className={`admin-topbar ${!sidebarOpen ? "sidebar-closed" : ""}`}
        style={{ height: "66px" }}
      >
        <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Main Content */}
      <main
        className={`admin-main-content ${!sidebarOpen ? "sidebar-closed" : ""}`}
      >
        <div className="p-3 md:p-4 xl:p-6">{children}</div>
      </main>
    </div>
  );
}
