import type { ApolloCache } from "@apollo/client/cache";
import type { CreatePostResponse } from "./create-types-queries";
import { GET_POSTS, type PostListResponse } from "./list-types-queries";

export function updateCache(cache: ApolloCache<PostListResponse>, { data }: { data: CreatePostResponse }, username: string, userId: string) {
    const existingPosts = cache.readQuery<PostListResponse>({
      query: GET_POSTS,
      variables: {
        options: {
          paginate: {
            page: 1,
            limit: 10,
          },
          search: {
            q: "",
          },
          sort: [
            {
              field: "id",
              order: "DESC",
            },
          ],
        },
      },
    });
    if (!existingPosts?.posts.data) {
      return;
    }
    const updatedPosts = {
      posts: {
        ...existingPosts.posts,
        data: [
          {
            ...data?.createPost,
            user: {
              __typename: "User",
              username,
              id: userId,
            },
          },
          ...existingPosts.posts.data,
        ],
        meta: {
          ...existingPosts.posts.meta,
          totalCount: existingPosts.posts.meta.totalCount + 1,
        },
      },
    };
    cache.writeQuery({
      query: GET_POSTS,
      variables: {
        options: {
          paginate: {
            page: 1,
            limit: 10,
          },
          search: {
            q: "",
          },
          sort: [
            {
              field: "id",
              order: "DESC",
            },
          ],
        },
      },
      data: updatedPosts,
    });
  },