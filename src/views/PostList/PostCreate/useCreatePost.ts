import { useMutation } from "@vue/apollo-composable";
import { CREATE_POST } from "./create-types-queries";
import { type CreatePostResponse } from "./create-types-queries";
import {
  GET_POSTS,
  POSTS_VARIABLES,
  type PostListResponse,
} from "../list-types-queries";
import { type Ref } from "vue";
import type { ApolloCache } from "@apollo/client";

type CreatePostArgs = {
  title: Ref<string>;
  body: Ref<string>;
  username: Ref<string>;
  userId: Ref<string | undefined>;
};

export function useCreatePost({
  title,
  body,
  username,
  userId,
}: CreatePostArgs) {
  // Store original cache state for rollback
  let originalCacheState: PostListResponse | null = null;
  const tempId = `temp-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 11)}`;

  const {
    mutate: createPostMutation,
    loading: createLoading,
    error: createError,
  } = useMutation<CreatePostResponse>(CREATE_POST, () => ({
    variables: {
      input: {
        title: title.value,
        body: body.value,
      },
    },
    optimisticResponse: {
      createPost: {
        __typename: "Post",
        title: title.value,
        body: body.value,
        id: tempId,
        user: {
          __typename: "User",
          username: username.value,
          id: userId.value || "",
        },
      },
    },
    update: (cache, { data }) => {
      if (!originalCacheState) {
        originalCacheState = cache.readQuery<PostListResponse>({
          query: GET_POSTS,
          variables: POSTS_VARIABLES,
        });
      }

      const existingPosts = cache.readQuery<PostListResponse>({
        query: GET_POSTS,
        variables: POSTS_VARIABLES,
      });

      if (!existingPosts?.posts.data) {
        return;
      }

      // Remove the temporary post and add the real one
      const postsWithoutTemp = existingPosts.posts.data.filter(
        (post) => post.id !== tempId
      );

      const updatedPosts = {
        posts: {
          ...existingPosts.posts,
          data: [
            {
              ...data?.createPost,
              user: {
                __typename: "User",
                username: username.value,
                id: userId.value || "",
              },
            },
            ...postsWithoutTemp,
          ],
          meta: {
            ...existingPosts.posts.meta,
            totalCount: existingPosts.posts.meta.totalCount,
          },
        },
      };

      cache.writeQuery({
        query: GET_POSTS,
        variables: POSTS_VARIABLES,
        data: updatedPosts,
      });
    },
    onError: (
      _: unknown,
      { cache }: { cache: ApolloCache<PostListResponse> }
    ) => {
      // Rollback to original state on error
      if (originalCacheState) {
        cache.writeQuery({
          query: GET_POSTS,
          variables: POSTS_VARIABLES,
          data: originalCacheState,
        });
        originalCacheState = null; // Reset for next attempt
      }
    },
  }));

  return {
    createPostMutation,
    createLoading,
    createError,
  };
}
