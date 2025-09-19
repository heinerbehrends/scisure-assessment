import gql from "graphql-tag";

type User = {
  id: string;
  username: string;
};

export type UsersResponse = {
  users: {
    data: User[];
  };
};

export const GET_USERS = gql`
  query Users {
    users {
      data {
        id
        username
      }
    }
  }
`;

export type CreatePostInput = {
  title: string;
  body: string;
};

export type CreatePostResponse = {
  createPost: {
    __typename: "Post";
    title: string;
    body: string;
    id: string;
    user: {
      __typename: "User";
      id: string;
      username: string;
    };
  };
};

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      title
      body
      id
      user {
        id
        username
        __typename
      }
      __typename
    }
  }
`;
