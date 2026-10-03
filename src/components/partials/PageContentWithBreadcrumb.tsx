/** @format */
"use client";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { usePageComponent } from "@/hooks/usePageComponent";
import React, { memo } from "react";
import PageContent from "./PageContent";

const PageContentWithBreadcrumb = ({ page }: { page: string }) => {
  const { pageTitle } = usePageComponent({ slug: page });

  return (
    <React.Fragment>
      {page !== "/" && page !== "dashboard" && pageTitle && (
        <Breadcrumb title={pageTitle} />
      )}
      {page && <PageContent page={page} />}
    </React.Fragment>
  );
};

export default memo(
  PageContentWithBreadcrumb,
  (prev, next) => prev?.page === next?.page,
);
