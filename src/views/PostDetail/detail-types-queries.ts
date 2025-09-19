import gql from "graphql-tag";

type Post = {
  id: string;
  body: string;
  title: string;
  user: {
    username: string;
  };
  comments: {
    data: {
      body: string;
      name: string;
      id: string;
    }[];
  };
};

export type PostQueryResponse = {
  post: Post;
};

export type PostQueryArgs = {
  postId: string;
};

export const GET_POST = gql`
  query Post($postId: ID!) {
    post(id: $postId) {
      id
      body
      comments {
        data {
          body
          name
          id
        }
      }
      title
      user {
        username
      }
    }
  }
`;
