"use client";

import { useState, Fragment } from "react";
import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { useChat } from "@ai-sdk/react";

export default function RAGChatBot() {
  const [input, setInput] = useState<string>("");
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) return;

    sendMessage({ text: message.text });
    setInput("");
  };

  // Helper to clean model text
  const formatText = (text: string) => {
    // Remove <think> ... </think> blocks
    const clean = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
    // Convert newlines to <br /> for React
    return clean.split("\n").map((line, idx) => (
      <Fragment key={idx}>
        {line}
        <br />
      </Fragment>
    ));
  };

  return (
    <div className="w-4xl mx-auto p-6 relative h-[calc(100vh)] flex flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.parts.map((part, i) => {
                if (part.type !== "text") return null;

                return (
                  <Fragment key={`${message.id}-${i}`}>
                    <Message from={message.role}>
                      <MessageContent>{formatText(part.text)}</MessageContent>
                    </Message>
                  </Fragment>
                );
              })}
            </div>
          ))}
          {(status === "submitted" || status === "streaming") && (
            <h1 className="text-gray-500">Loading...</h1>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput onSubmit={handleSubmit} className="mt-4">
        {/* <PromptInputBody> */}
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="relative"
          />
          <PromptInputTools className="absolute right-2 bottom-2 mr-2">
            <PromptInputSubmit className="cursor-pointer" />
          </PromptInputTools>
        {/* </PromptInputBody> */}
      </PromptInput>
    </div>
  );
}