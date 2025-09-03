import { useMutation } from "@vue/apollo-composable";
import { CREATE_POST } from "./create-types-queries";
import { type CreatePostResponse } from "./create-types-queries";
import {
  GET_POSTS,
  POSTS_VARIABLES,
  type PostListResponse,
} from "./list-types-queries";

type CreatePostArgs = {
  title: string;
  body: string;
  username: string;
  userId: string;
};

export function useCreatePost({
  title,
  body,
  username,
  userId,
}: CreatePostArgs) {
  const {
    mutate: createPostMutation,
    loading: createLoading,
    error: createError,
  } = useMutation<CreatePostResponse>(CREATE_POST, () => ({
    variables: {
      input: {
        title,
        body,
      },
    },
    optimisticResponse: {
      createPost: {
        __typename: "Post",
        title,
        body,
        id: "101",
        user: {
          __typename: "User",
          username,
          id: userId,
        },
      },
    },
    update: (cache, { data }) => {
      const existingPosts = cache.readQuery<PostListResponse>({
        query: GET_POSTS,
        variables: POSTS_VARIABLES,
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
        variables: POSTS_VARIABLES,
        data: updatedPosts,
      });
    },
  }));

  return {
    createPostMutation,
    createLoading,
    createError,
  };
}
