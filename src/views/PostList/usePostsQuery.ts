import { nextTick, ref, type Ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import {
  type PostListResponse,
  type PageQueryOptions,
  GET_POSTS,
} from "./list-types-queries";

export function usePostsQuery({
  currentPage,
  pageSize,
}: {
  currentPage: Ref<number>;
  pageSize: number;
}) {
  const searchQuery = ref("");
  function buildSearchOptions(
    page: number,
    limit: number
  ): PageQueryOptions["options"] {
    return {
      paginate: {
        page,
        limit,
      },
      search: {
        q: searchQuery.value,
      },
      sort: [
        {
          field: "id",
          order: "DESC",
        },
      ],
    };
  }
  const { result, loading, error, fetchMore, refetch } = useQuery<
    PostListResponse,
    PageQueryOptions
  >(GET_POSTS, {
    options: buildSearchOptions(currentPage.value, pageSize),
  });
  const postListTop = ref<HTMLElement>();

  function loadPage(type: "next" | "previous") {
    if (!result.value?.posts.data) return;

    const newPage =
      type === "next" ? currentPage.value + 1 : currentPage.value - 1;

    currentPage.value = newPage;

    fetchMore({
      variables: {
        options: buildSearchOptions(currentPage.value, pageSize),
      },
      updateQuery: (previousResult: PostListResponse, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;
        return {
          posts: {
            ...previousResult.posts,
            data: fetchMoreResult.posts.data,
            meta: fetchMoreResult.posts.meta,
          },
        };
      },
    })?.then(() => {
      // Scroll to top of the list after the new page loads
      nextTick(() => {
        if (postListTop.value) {
          postListTop.value.scrollIntoView({
            behavior: "instant",
            block: "start",
          });
        }
      });
    });
  }

  return {
    searchQuery,
    buildSearchOptions,
    result,
    loading,
    error,
    refetch,
    loadPage,
    postListTop,
  };
}
