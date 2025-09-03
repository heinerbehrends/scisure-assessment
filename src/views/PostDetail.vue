<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const postId = computed(() => route.params.id as string);

type Post = {
    body: string;
    title: string;
    user: {
        username: string;
    };
    comments: {
        data: {
            body: string;
            name: string;
        }[];
    };
};

type PostQueryResponse = {
    post: Post;
};

type PostQueryArgs = {
    postId: string;
};

const GET_POST = gql`
  query Post($postId: ID!) {
    post(id: $postId) {
        body
        comments {
            data {
                body
                name
            }
        }
        title
        user {
            username
        }
    }
  }
`;

const { result, loading, error } = useQuery<PostQueryResponse, PostQueryArgs>(GET_POST, () => ({
    postId: postId.value
}));
</script>

<template>
    <div class="post-detail">
        <!-- Loading -->
        <div v-if="loading" class="loading">Loading post...</div>

        <!-- Error -->
        <div v-if="error" class="error">{{ error }}</div>
        <!-- back to posts -->
        <router-link to="/" class="back-link">← Back to Posts</router-link>
        <!-- Post -->

        <div v-if="result && result.post" class="post">
            <h1>{{ result.post.title }}</h1>
            <p class="meta">By {{ result.post.user?.username }}</p>
            <div class="body">{{ result.post.body }}</div>
        </div>
    </div>
</template>

<style scoped>
.post-detail {
    max-width: 800px;
    margin: 0 auto;
    text-align: left;

}

#app {
    margin: 0;
    padding: 0;
}

.loading,
.error,
.not-found {
    text-align: center;
    padding: 2rem;
}

.post h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.meta {
    color: #666;
    margin-bottom: 2rem;
}

.body {
    line-height: 1.6;
    font-size: 1.1rem;
}

.back-link {
    color: #42b883;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #42b883;
    border-radius: 4px;
}

.back-link:hover {
    text-decoration: underline;
}
</style>
