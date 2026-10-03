/** @format */
"use client";
import SectionResolver from "@/components/page-sections/SectionResolver";
import DataNotFound from "@/components/ui/DataNotFound";
import { usePageComponent } from "@/hooks/usePageComponent";
import React, { memo, useMemo } from "react";

const PageContent = ({ page }: { page: string }) => {
  const { sections } = usePageComponent({ slug: page });

  const sectionResolved = useMemo(() => {
    if (!sections || sections.length === 0) {
      return null;
    }
    return sections.map((section: any, index: number) => {
      return <SectionResolver key={index} pageSlug={page} section={section} />;
    });
  }, [sections, page]);

  if (!sectionResolved) {
    return (
      <div className="py-10">
        <DataNotFound
          title="Page Not Found"
          message="The page you are looking for does not exist."
          redirect="/"
        />
      </div>
    );
  }

  return <React.Fragment>{sectionResolved}</React.Fragment>;
};

export default memo(PageContent, (prev, next) => prev?.page === next?.page);
