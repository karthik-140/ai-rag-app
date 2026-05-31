import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center ">Welcome to AI RAG App</h1>
      <p className="text-center text-gray-500">
        Please sign in to start chatting with the AI.
      </p>
    </div>
  );
}
