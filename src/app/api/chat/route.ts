import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs
} from "ai";
// import { openai } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import { searchDocuments } from "@/lib/search";

const tools = {
  searchKnowledgeBase: tool({
    description: "Search the knowledge base for relevant information.",
    inputSchema: z.object({
      query: z.string().describe("The search query to find relevant documents"),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 3, 0.5);
        if (results.length === 0) {
          return "No relevant information found in the knowledge base.";
        }

        const formattedResults = results
          .map((r, i) => `[${i + 1}]. ${r.content}`)
          .join("\n\n");

        return formattedResults;
      } catch (error) {
        console.error("Error searching knowledge base", error);
        throw new Error("Failed to search knowledge base");
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: groq("qwen/qwen3-32b"),
      messages: await convertToModelMessages(messages),
      tools,
      system:
        "You are a helpful AI assistant. You have access to a knowledge base and can search it for relevant information. Use the provided tools to assist the user with their queries.",
      stopWhen: stepCountIs(2),
      });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error generating response", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
