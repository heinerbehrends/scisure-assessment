<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  type CreatePostResponse,
  type UsersResponse,
  CREATE_POST,
  GET_USERS,
} from "./create-types-queries";
import gql from "graphql-tag";
import { GET_POSTS, type PostListResponse } from "./list-types-queries";

const title = ref("");
const body = ref("");
const username = ref("");

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
      body: body.value,
      title: title.value,
      id: "101",
      user: {
        __typename: "User",
        username: username.value,
        id: userId.value as string,
      },
    },
  },
  update: (cache, { data }) => {
    if (data?.createPost) {
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

      if (existingPosts?.posts?.data) {
        const updatedPosts = {
          posts: {
            ...existingPosts.posts,
            data: [
              {
                ...data.createPost,
                user: {
                  __typename: "User",
                  username: username.value,
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

        // Write the updated data back to cache
        cache.writeQuery({
          query: gql`
            query GetPosts($options: PageQueryOptions) {
              posts(options: $options) {
                data {
                  title
                  id
                  user {
                    username
                  }
                  body
                }
                meta {
                  totalCount
                }
              }
            }
          `,
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
      }
    }
  },
}));

function createPost() {
  // Early return if required fields are empty
  if (!title.value.trim() || !body.value.trim() || !username.value) {
    return;
  }

  createPostMutation()
    .then((response) => {
      if (response?.data?.createPost) {
        // You can add success notification here
        console.log("Post created successfully:", response.data.createPost);
      }
    })
    .catch((error) => {
      console.error("Error creating post:", error);
    });
}

const { result, loading, error } = useQuery<UsersResponse>(GET_USERS);

const userId = computed(
  () =>
    result.value?.users?.data?.find((user) => user.username === username.value)
      ?.id
);
</script>
<template>
  <section class="create-post">
    <h2>Create Post</h2>

    <!-- Error message display -->
    <div v-if="createError" class="error-message">
      Error creating post: {{ createError.message }}
    </div>

    <form @submit.prevent="createPost">
      <div class="create-post-container">
        <template v-if="result && result.users">
          <label for="username">Select User</label>
          <div v-if="error" class="error-message">
            Error loading users: {{ error.message }}
          </div>
          <p class="user-input" v-if="loading">Loading...</p>
          <select
            id="username"
            v-model="username"
            placeholder="Select a username"
            :disabled="createLoading"
            required
            class="username-input"
          >
            <option
              v-for="user in result.users.data"
              :key="user.id"
              :value="user.username"
            >
              {{ user.username }}
            </option>
          </select>
        </template>
        <label for="title" class="title-label">Title</label>
        <input
          id="title"
          type="text"
          v-model="title"
          placeholder="Title"
          :disabled="createLoading"
          required
          class="title-input"
        />
        <label for="body" class="body-label">Body</label>
        <textarea
          id="body"
          rows="10"
          v-model="body"
          placeholder="Body"
          :disabled="createLoading"
          required
          class="body-input"
        />
        <button type="submit" :disabled="createLoading" class="submit-button">
          {{ createLoading ? "Creating..." : "Create Post" }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.create-post {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title-input {
  padding: 0.75rem 1.5rem;
  border: 1px solid #888;
  border-radius: 4px;
  font-size: 1rem;
}

.body-input {
  padding: 0.75rem 1.5rem;
  border: 1px solid #888;
  border-radius: 4px;
  font-size: 1rem;
}

.create-post-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.username-input {
  padding: 0.75rem 1.5rem;
  border: 1px solid #888;
  border-radius: 4px;
  font-size: 1rem;
}
</style>
