"use client";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS } from "../schema/PostQueries";

export const PostList = () => {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  return (
    <>
      {data.posts.map((post) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </>
  );
};
