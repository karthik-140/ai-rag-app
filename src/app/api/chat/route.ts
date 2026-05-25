import { streamText, UIMessage, convertToModelMessages } from "ai";
// import { openai } from "@ai-sdk/openai";
import { groq } from '@ai-sdk/groq';

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: groq("qwen/qwen3-32b"),
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error generating response", error);
    return new Response("Failed to generate response", { status: 500 });
  }
}
