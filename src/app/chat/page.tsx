"use client";

import { useState } from "react";
import {
  PromptInput,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import { Message, MessageContent } from "@/components/ai-elements/message";

import { useChat } from "@ai-sdk/react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import "highlight.js/styles/github-dark.css";
import "github-markdown-css/github-markdown.css";

export default function RAGChatBot() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) return;

    sendMessage({ text: message.text });
    setInput("");
  };

  const cleanText = (text: string) => {
    return text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  };

  return (
    <div className="w-4xl mx-auto p-6 relative h-screen flex flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.parts.map((part, i) => {
                if (part.type !== "text") return null;

                return (
                  <Message key={`${message.id}-${i}`} from={message.role}>
                    <MessageContent>
                      <div
                        className="markdown-body p-2 rounded-lg"
                        style={{
                          backgroundColor: "transparent",
                          color: "inherit",
                        }}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            pre({ children }) {
                              return (
                                <pre className="relative rounded-xl overflow-hidden my-4">
                                  {children}
                                </pre>
                              );
                            },

                            code({ className, children, ...props }) {
                              const isInline = !className;

                              if (isInline) {
                                return (
                                  <code
                                    className="text-grey-300 px-1.5 py-0.5 rounded-md text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              }

                              return (
                                <code
                                  className={`${className} text-sm leading-6`}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {cleanText(part.text)}
                        </ReactMarkdown>
                      </div>
                    </MessageContent>
                  </Message>
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
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="relative"
        />

        <PromptInputTools className="absolute right-2 bottom-2 mr-2">
          <PromptInputSubmit className="cursor-pointer" />
        </PromptInputTools>
      </PromptInput>
    </div>
  );
}
