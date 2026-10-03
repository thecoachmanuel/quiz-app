"use client";

import { useEffect, useRef, useState } from "react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  emptyText?: string;
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-[var(--admin-neutral-30)] dark:bg-[var(--admin-neutral-600)] rounded"></div>
        </td>
      ))}
    </tr>
  );
}

export default function AdminDataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  onSearch,
  searchPlaceholder = "Search...",
  actions,
  emptyText = "No data found",
}: AdminDataTableProps<T>) {
  const [searchValue, setSearchValue] = useState("");
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (val: string) => {
    setSearchValue(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      onSearch?.(val);
    }, 400);
  };

  const getCellValue = (row: T, key: string): React.ReactNode => {
    if (key.includes(".")) {
      const parts = key.split(".");
      let val: any = row;
      for (const part of parts) val = val?.[part];
      return val ?? "-";
    }
    return row[key] ?? "-";
  };

  // Generate page numbers
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="admin-white-box">
      {/* Table header bar */}
      <div className="flex flex-wrap gap-3 justify-between items-center mb-5">
        {/* Search */}
        {onSearch && (
          <div className="admin-search-form">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button type="button">
              <i className="ph ph-magnifying-glass text-sm"></i>
            </button>
          </div>
        )}
        {/* Actions slot */}
        {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
      </div>

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={col.width ? { width: col.width } : {}}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-[var(--admin-neutral-500)]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <i className="ph ph-database text-4xl opacity-40"></i>
                    <span className="text-sm">{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, ri) => (
                <tr key={ri}>
                  {columns.map((col, ci) => (
                    <td key={ci}>
                      {col.render
                        ? col.render(row)
                        : getCellValue(row, col.key as string)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
          <button
            className="admin-pagination-btn"
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <i className="ph ph-caret-left text-sm"></i>
          </button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={i}
                className="flex items-center justify-center size-9 text-sm text-[var(--admin-neutral-500)]"
              >
                ...
              </span>
            ) : (
              <button
                key={i}
                className={`admin-pagination-btn ${p === currentPage ? "active" : ""}`}
                onClick={() => onPageChange?.(p as number)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="admin-pagination-btn"
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <i className="ph ph-caret-right text-sm"></i>
          </button>
        </div>
      )}
    </div>
  );
}
