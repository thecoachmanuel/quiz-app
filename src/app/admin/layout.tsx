/** @format */

import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import "@/styles/admin.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quizix Admin",
  description: "Quizix Admin Dashboard",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
