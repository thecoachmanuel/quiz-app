"use client";

import Link from "next/link";
import React from "react";

export interface TabButton {
  label: string;
  key?: string;
  link?: string;
  count?: number;
  active?: boolean;
}

export interface ActionButton {
  label: string;
  href?: string;
  icon?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
}

interface AdminPageHeaderProps {
  title?: string;
  tabButtons?: TabButton[];
  activeTab?: string;
  onTabChange?: (tabKey: string) => void;
  search?: string;
  onSearch?: (val: string) => void;
  searchPlaceholder?: string;
  buttons?: ActionButton[];
  dateFilter?: boolean;
  onDateChange?: (range: string) => void;
  children?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  tabButtons = [],
  activeTab,
  onTabChange,
  search,
  onSearch,
  searchPlaceholder = "Search...",
  buttons = [],
  dateFilter = false,
  onDateChange,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex justify-between items-center gap-4 flex-wrap mb-4 xl:mb-6">
      {/* Left side: Tab buttons or Title */}
      {tabButtons.length > 0 ? (
        <div className="flex flex-wrap gap-2 p-1 rounded-lg md:rounded-full border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)]">
          {tabButtons.map((tab, idx) => {
            const isActive =
              activeTab !== undefined
                ? activeTab === (tab.key || tab.label)
                : tab.active || idx === 0;

            const content = (
              <>
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`ml-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </>
            );

            if (tab.link) {
              return (
                <Link
                  key={idx}
                  href={tab.link}
                  className={`relative inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? "text-white bg-[var(--admin-primary)] shadow-sm"
                      : "text-[var(--admin-neutral-400)] hover:text-[var(--admin-neutral-900)] dark:hover:text-white"
                  }`}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onTabChange?.(tab.key || tab.label)}
                className={`relative inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-white bg-[var(--admin-primary)] shadow-sm"
                    : "text-[var(--admin-neutral-400)] hover:text-[var(--admin-neutral-900)] dark:hover:text-white"
                }`}
              >
                {content}
              </button>
            );
          })}
        </div>
      ) : title ? (
        <h2 className="text-xl font-bold text-[var(--admin-neutral-900)] dark:text-white">
          {title}
        </h2>
      ) : null}

      {/* Right side: Search, Datepicker, Action Buttons */}
      <div className="flex gap-3 items-center flex-wrap grow justify-end">
        {onSearch && (
          <div className="admin-search-form">
            <input
              type="text"
              value={search || ""}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
            />
            <button type="button">
              <i className="ph ph-magnifying-glass text-lg"></i>
            </button>
          </div>
        )}

        {dateFilter && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--admin-neutral-200)] hidden md:inline">
              Date:
            </span>
            <input
              type="date"
              className="admin-form-control text-xs py-1.5 px-2.5 rounded-lg border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] bg-[var(--admin-neutral-0)] dark:bg-[var(--admin-neutral-900)]"
              onChange={(e) => onDateChange?.(e.target.value)}
            />
          </div>
        )}

        {buttons.map((btn, idx) => {
          const btnClass =
            btn.variant === "danger"
              ? "admin-btn-danger"
              : btn.variant === "secondary"
              ? "admin-btn-secondary"
              : "admin-btn-primary";

          if (btn.href) {
            return (
              <Link
                key={idx}
                href={btn.href}
                className={`${btnClass} inline-flex items-center gap-1.5 text-xs py-2 px-3.5 rounded-lg font-medium`}
              >
                {btn.icon && <i className={`${btn.icon} text-base`}></i>}
                {btn.label}
              </Link>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={btn.onClick}
              className={`${btnClass} inline-flex items-center gap-1.5 text-xs py-2 px-3.5 rounded-lg font-medium`}
            >
              {btn.icon && <i className={`${btn.icon} text-base`}></i>}
              {btn.label}
            </button>
          );
        })}

        {children}
      </div>
    </div>
  );
}
