import type { PostListResponse } from "./list-types-queries";

export function getTotalCount(result: PostListResponse | undefined) {
  if (!result?.posts?.meta) return null;
  const { meta } = result.posts;
  return meta.totalCount;
}

type CheckNextPageArgs = {
  totalCount: number;
  currentPage: number;
  pageSize: number;
};

export function checkNextPage({
  totalCount,
  currentPage,
  pageSize,
}: CheckNextPageArgs) {
  return totalCount > currentPage * pageSize;
}

type CheckPreviousPageArgs = {
  currentPage: number;
};

export function checkPreviousPage({ currentPage }: CheckPreviousPageArgs) {
  return currentPage > 1;
}
