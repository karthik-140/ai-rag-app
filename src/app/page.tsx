"use client";

import { useRouter } from "next/navigation";
import { Show } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();

  const redirectToChat = () => {
    router.push("/chat");
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center ">Welcome to AI RAG App</h1>
      <Show when={"signed-in"}>
        <p className="text-center text-gray-500">
          You are signed in.{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={redirectToChat}
          >
            click here
          </span>{" "}
          to start chatting with the AI!
        </p>
      </Show>
      <Show when={"signed-out"}>
        <p className="text-center text-gray-500">
          Please sign in to start chatting with the AI.
        </p>
      </Show>
    </div>
  );
}
