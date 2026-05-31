import {
  Show,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export const Navigation = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-gray-800 text-white">
      <div className="text-lg font-bold">AI RAG App</div>
      <div className="flex items-center gap-2">
        <Show when={"signed-out"}>
          <SignInButton mode="modal">
            <Button variant={"ghost"}>Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant={"ghost"}>Sign Up</Button>
          </SignUpButton>
        </Show>
        <Show when={"signed-in"}>
          <UserButton />
        </Show>
      </div>
    </nav>
  );
};
