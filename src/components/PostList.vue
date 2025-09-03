<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { ref, computed } from "vue";

type Post = {
    title: string;
    id: string;
    user: {
        username: string;
    };
    body: string;
};

type PostsData = {
    data: Post[];
    meta: {
        totalCount: number;
    };
};

type PostListResponse = {
    posts: PostsData;
};

type PageQueryOptions = {
    options: {
        paginate: {
            page: number;
            limit: number;
        };
    };
};
const POSTS = gql`
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
`;


const currentPage = ref(1);
const pageSize = ref(10);

const { result, loading, error, fetchMore } = useQuery<PostListResponse, PageQueryOptions>(POSTS, () => ({
    options: {
        paginate: {
            page: currentPage.value,
            limit: pageSize.value,
        },
    },
}));
console.log('result', result.value);

// Load more function
function loadMore() {
    if (!result.value?.posts.data) return;

    currentPage.value += 1;

    fetchMore({
        variables: {
            options: {
                paginate: {
                    page: currentPage.value,
                    limit: pageSize.value,
                },
            },
        },
        updateQuery: (previousResult: PostListResponse, { fetchMoreResult }: { fetchMoreResult?: PostListResponse }) => {
            if (!fetchMoreResult) return previousResult;

            return {
                ...previousResult,
                data: {
                    ...previousResult,
                    posts: {
                        ...previousResult.posts,
                        data: [
                            ...previousResult.posts.data,
                            ...fetchMoreResult.posts.data,
                        ],
                        meta: fetchMoreResult.posts.meta,
                    },
                },
            };
        },
    });
}

// Get pagination info
const totalCount = computed(() => {
    if (!result.value?.posts?.meta) return null;
    const { meta } = result.value.posts;
    console.log(meta);
    return meta.totalCount;
});

type CheckMorePostsArgs = {
    totalCount: number;
    currentPage: number;
    pageSize: number;
};

function checkMorePosts({
    totalCount,
    currentPage,
    pageSize,
}: CheckMorePostsArgs) {
    return totalCount > currentPage * pageSize;
};


const hasMorePosts = computed(() => {
    if (!totalCount.value) return false;
    return checkMorePosts({
        totalCount: totalCount.value,
        currentPage: currentPage.value,
        pageSize: pageSize.value,
    });
});
</script>

<template>
    <div aria-busy="true" v-if="loading">Loading...</div>
    <div aria-live="assertive" v-if="error">Error: {{ error.message }}</div>

    <section v-if="result && result.posts.data">
        <h1>Posts</h1>

        <ul>
            <li v-for="post in result.posts.data" :key="post.id">
                <h2>{{ post.title }}</h2>
                <p>{{ post.body }}</p>
                <p>{{ post.user.username }}</p>
            </li>
        </ul>

        <!-- Load More Button -->
        <div v-if="hasMorePosts" class="pagination-controls">
            <button @click="loadMore" :disabled="loading" class="load-more-btn">
                {{ loading ? 'Loading...' : 'Load next page' }}
            </button>
        </div>

        <!-- Pagination Info -->
        <div v-if="totalCount" class="pagination-info">
            <p>
                Page {{ currentPage }} of {{ Math.ceil(totalCount / pageSize) }}
                ({{ result.posts.data.length }} of {{ totalCount }} posts)
            </p>
        </div>
    </section>
</template>

<style scoped>
.pagination-controls {
    margin: 2rem 0;
    text-align: center;
}

.load-more-btn {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.load-more-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.load-more-btn:hover:not(:disabled) {
    background-color: #0056b3;
}

.pagination-info {
    text-align: center;
    color: #6c757d;
    margin-top: 1rem;
}
</style>