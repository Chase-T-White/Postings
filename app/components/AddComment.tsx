"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

type PostProps = {
  id?: string;
};

type Comment = {
  postId?: string;
  title: string;
};

export default function AddComment({ id }: PostProps) {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  let toastCommentID: string;

  const { mutate } = useMutation(
    async (data: Comment) =>
      await axios.post("/api/posts/addComment", { data }),
    {
      onSuccess: (data) => {
        toast.success("Comment successfully posted", {
          id: toastCommentID,
        });
        queryClient.invalidateQueries(["detail-post"]);
        setTitle("");
        setIsDisabled(false);
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, { id: toastCommentID });
        }
        setIsDisabled(false);
      },
    }
  );

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    toastCommentID = toast.loading("Adding your comment", {
      id: toastCommentID,
    });
    toast.dismiss();
    mutate({ title, postId: id });
  };

  return (
    <form className="my-8" onSubmit={submitComment}>
      <h3>Add a comment</h3>
      <div className="flex flex-col my-2">
        <input
          type="text"
          value={title}
          name="title"
          className="p-4 text-lg rounded-md my-2"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={isDisabled}
          className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
          type="submit"
        >
          Add Comment
        </button>
        <p
          className={`font-bold ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          }`}
        >{`${title.length}/300`}</p>
      </div>
    </form>
  );
}
