/** @format */
"use client";
import Skeleton from "@/components/ui/QuizItemSkeleton";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useListParams } from "@/hooks/useListParams";
import { QuizPaginationApiResponse } from "@/types/quiz";
import { getToken } from "@/utils";
import dynamic from "next/dynamic";
import React, { memo } from "react";
import Categories from "../contests/Categories";
import QuizItems from "./QuizItems";
import SearchField from "./SearchField";

const Pagination = dynamic(() => import("@/components/ui/Pagination"), {
  ssr: false,
});

const PER_PAGE_ITEM = 9;

import { useQuizStore } from "@/stores/quizStore";

const QuizList = () => {
  const token = getToken();

  const {
    page,
    category,
    searchText,
    debouncedSearchText,
    handlePageChange,
    handleCategoryChange,
    handleSearchChange,
  } = useListParams({ baseUrl: "/quizzes" });

  const {
    data: quizList,
    refetch,
    isLoading: isQuizListLoading,
  } = useGetQuery<QuizPaginationApiResponse>({
    isPublic: !token,
    url: "/quizzes",
    queryKey: "quizzes",
    params: {
      page: page,
      per_page: PER_PAGE_ITEM,
      search: debouncedSearchText,
      category: category,
    },
  });

  const getFrontendQuizzes = useQuizStore((state) => state.getFrontendQuizzes);
  const storeQuizList = getFrontendQuizzes({
    page,
    per_page: PER_PAGE_ITEM,
    search: debouncedSearchText,
    category,
  });

  const effectiveQuizList =
    quizList?.data && quizList.data.length > 0 ? quizList : storeQuizList;

  return (
    <React.Fragment>
      <div className="pt-6">
        <SearchField
          searchText={searchText}
          setSearchText={handleSearchChange}
        />
      </div>
      <Categories setSelectedCategory={handleCategoryChange} />

      {isQuizListLoading && !effectiveQuizList ? (
        <Skeleton total={3} />
      ) : (
        <QuizItems quizList={effectiveQuizList} refetch={refetch} />
      )}

      <Pagination
        currentPage={page}
        lastPage={effectiveQuizList?.last_page ?? 1}
        onPageChange={handlePageChange}
      />
    </React.Fragment>
  );
};

export default memo(QuizList);
