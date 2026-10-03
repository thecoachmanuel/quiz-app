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
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem("theme");
                if (theme === "dark" || (!theme && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                  document.documentElement.setAttribute("data-theme", "dark");
                } else {
                  document.documentElement.classList.remove("dark");
                  document.documentElement.setAttribute("data-theme", "light");
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </>
  );
}
