import { ref } from "vue";
import type { PageQueryOptions } from "../views/PostList/list-types-queries";

export function usePostSearch() {
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

  function resetSearch() {
    searchQuery.value = "";
  }

  return {
    // State
    searchQuery,

    // Methods
    buildSearchOptions,
    resetSearch,
  };
}
