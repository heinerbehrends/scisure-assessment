import { useMutation } from "@vue/apollo-composable";
import { CREATE_POST } from "./create-types-queries";
import { type CreatePostResponse } from "./create-types-queries";
import {
  GET_POSTS,
  POSTS_VARIABLES,
  type PostListResponse,
} from "./list-types-queries";
import { type Ref } from "vue";

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
        id: "101",
        user: {
          __typename: "User",
          username: username.value,
          id: userId.value || "",
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
                username: username.value,
                id: userId.value || "",
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
