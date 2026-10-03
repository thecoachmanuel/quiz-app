"use client";

import { ADMIN_MENU, AdminMenuItem } from "@/configs/adminMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  logoLight?: string;
  logoDark?: string;
}

// ---- Submenu Item ----
function AdminSubmenuItem({
  menu,
  level = 0,
}: {
  menu: AdminMenuItem;
  level?: number;
}) {
  const pathname = usePathname();
  const isActive = menu.href
    ? pathname === menu.href || pathname.startsWith(menu.href + "/")
    : false;
  const hasChildren = !!menu.submenus?.length;

  // Check if any child is active (for auto-open)
  const childActive = hasChildren
    ? menu.submenus!.some(
        (sub) =>
          (sub.href && (pathname === sub.href || pathname.startsWith(sub.href + "/"))) ||
          (sub.submenus &&
            sub.submenus.some(
              (s) =>
                s.href &&
                (pathname === s.href || pathname.startsWith(s.href + "/"))
            ))
      )
    : false;

  const [open, setOpen] = useState(isActive || childActive);

  useEffect(() => {
    if (childActive || isActive) setOpen(true);
  }, [pathname, childActive, isActive]);

  if (!hasChildren && menu.href) {
    return (
      <li className={`flex ${level > 0 ? "sidebar-link py-1.5 text-sm" : ""}`}>
        <Link
          href={menu.href}
          className={`admin-submenu-link w-full ${
            isActive ? "active" : ""
          }`}
        >
          {level === 0 && menu.icon && (
            <i className={`${menu.icon} text-xl mr-2`}></i>
          )}
          {menu.title}
        </Link>
      </li>
    );
  }

  return (
    <li className="submenu-item">
      <button
        onClick={() => setOpen(!open)}
        className={`admin-submenu-parent ${childActive || isActive ? "active" : ""}`}
      >
        <div className="flex items-center gap-2">
          {menu.icon && <i className={`${menu.icon} text-[22px]`}></i>}
          <span className="text-sm">{menu.title}</span>
        </div>
        <i
          className={`ph ph-caret-down admin-caret text-sm ${open ? "open" : ""}`}
        ></i>
      </button>

      {open && menu.submenus && (
        <div className="admin-submenu-content">
          <ul className="space-y-0.5 mt-1">
            {menu.submenus.map((sub, i) =>
              sub.submenus ? (
                <AdminSubmenuItem key={i} menu={sub} level={level + 1} />
              ) : (
                <li key={i}>
                  <Link
                    href={sub.href || "#"}
                    className={`admin-submenu-link ${
                      sub.href &&
                      (pathname === sub.href ||
                        pathname.startsWith(sub.href + "/"))
                        ? "active"
                        : ""
                    }`}
                  >
                    {sub.icon && (
                      <i className={`${sub.icon} text-sm mr-1`}></i>
                    )}
                    {sub.title}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </li>
  );
}

// ---- Sidebar Nav Root Items ----
function SidebarNavItem({ menu }: { menu: AdminMenuItem }) {
  const pathname = usePathname();
  const isActive = menu.href
    ? pathname === menu.href || pathname.startsWith(menu.href + "/")
    : false;
  const hasChildren = !!menu.submenus?.length;

  const childActive = hasChildren
    ? menu.submenus!.some(
        (sub) =>
          (sub.href && (pathname === sub.href || pathname.startsWith(sub.href + "/"))) ||
          (sub.submenus &&
            sub.submenus.some(
              (s) =>
                s.href &&
                (pathname === s.href || pathname.startsWith(s.href + "/"))
            ))
      )
    : false;

  const [open, setOpen] = useState(isActive || childActive);

  useEffect(() => {
    if (childActive || isActive) setOpen(true);
  }, [pathname, childActive, isActive]);

  if (!hasChildren && menu.href) {
    return (
      <Link
        href={menu.href}
        className={`admin-nav-item ${isActive ? "active" : ""}`}
      >
        {menu.icon && <i className={`${menu.icon} text-[22px]`}></i>}
        <span>{menu.title}</span>
      </Link>
    );
  }

  return (
    <div className="submenu-item">
      <button
        onClick={() => setOpen(!open)}
        className={`admin-submenu-parent ${childActive || isActive ? "active" : ""}`}
      >
        <div className="flex items-center gap-2">
          {menu.icon && <i className={`${menu.icon} text-[22px]`}></i>}
          <span>{menu.title}</span>
        </div>
        <i
          className={`ph ph-caret-down admin-caret text-sm ${open ? "open" : ""}`}
        ></i>
      </button>

      {open && menu.submenus && (
        <div className="admin-submenu-content">
          <ul className="space-y-0.5 mt-1">
            {menu.submenus.map((sub, i) => (
              <AdminSubmenuItem key={i} menu={sub} level={1} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---- Main Sidebar ----
export default function AdminSidebar({
  isOpen,
  onClose,
  logoLight = "/assets/admin/images/logo-light.png",
  logoDark = "/assets/admin/images/logo-dark.png",
}: AdminSidebarProps) {
  return (
    <aside
      className={`admin-sidebar ${isOpen ? "opened" : "closed"}`}
      style={{ borderRight: "1px solid var(--admin-neutral-30)" }}
    >
      {/* Header */}
      <div className="admin-sidebar-header">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span
            className="text-lg font-bold"
            style={{ color: "var(--admin-primary)" }}
          >
            Quizix Admin
          </span>
        </Link>
        <button
          className="xl:hidden text-xl p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <i className="ph ph-x"></i>
        </button>
      </div>

      {/* Navigation */}
      <div className="admin-sidebar-scroll">
        <div className="space-y-1.5">
          {ADMIN_MENU.map((menu, i) => (
            <SidebarNavItem key={i} menu={menu} />
          ))}
        </div>
      </div>
    </aside>
  );
}
