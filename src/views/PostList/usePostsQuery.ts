import { nextTick, ref, type Ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import {
  type PostListResponse,
  type PageQueryOptions,
  GET_POSTS,
} from "./list-types-queries";

type UsePostsQueryArgs = {
  currentPage: Ref<number>;
  pageSize: number;
  searchParam: Ref<string>;
};

export function usePostsQuery({
  currentPage,
  pageSize,
  searchParam,
}: UsePostsQueryArgs) {
  const router = useRouter();
  const searchQuery = ref(searchParam.value || "");
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

    router.replace({ query: {} });

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

  function loadSearch() {
    currentPage.value = 1;
    refetch({
      options: buildSearchOptions(1, pageSize),
    });
  }

  function handleReset() {
    searchQuery.value = "";
    currentPage.value = 1;
    refetch({
      options: buildSearchOptions(1, pageSize),
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
    loadSearch,
    handleReset,
  };
}
