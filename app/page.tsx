"use client";

import AddPost from "./components/AddPost";
import Post from "./components/Post";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { PostType } from "./types/Posts";

// Fetch all posts
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery<PostType[]>({
    queryFn: allPosts,
    queryKey: ["posts"],
  });
  if (error) return error;
  if (isLoading) return "Loading....";
  console.log(data);

  return (
    <main>
      <AddPost />
      {data?.map((post) => (
        <Post
          key={post.id}
          comments={post.Comment}
          postTitle={post.title}
          name={post.user.name}
          avatar={post.user.image}
          id={post.id}
        />
      ))}
    </main>
  );
}
