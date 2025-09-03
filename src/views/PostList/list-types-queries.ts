import gql from "graphql-tag";

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

export type PostListResponse = {
  posts: PostsData;
};

export type PageQueryOptions = {
  options: {
    paginate: {
      page: number;
      limit: number;
    };
    search: {
      q: string;
    };
    sort: [
      {
        field: string;
        order: "ASC" | "DESC";
      }
    ];
  };
};
export const GET_POSTS = gql`
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

export const POSTS_VARIABLES = {
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
};
