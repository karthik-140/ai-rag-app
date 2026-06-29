import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function generateEmbedding(text: string) {
  const input = text.replace("\n", " ");

  // const { embedding } = await embed({
  //   model: google.embeddingModel("gemini-embedding-2"),
  //   value: input,
  // });

  // return embedding;

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: input,
    config: {
      outputDimensionality: 1536, // Adjust the dimensionality based on your embedding model (768, 1536, 3072, etc.)
    },
  });

  return response.embeddings?.[0]?.values ?? [];
}

// export async function generateEmbeddings(texts: string[]) {
//   const inputs = texts.map((text) => text.replace("\n", " "));

//   // const { embeddings } = await embedMany({
//   //   model: google.embeddingModel("gemini-embedding-2"),
//   //   values: inputs,
//   // });

//   // return embeddings;

//   const response = await ai.models.embedContent({
//     model: "gemini-embedding-2",
//     contents: inputs,
//     config: {
//       outputDimensionality: 1536, // Adjust the dimensionality based on your embedding model (768, 1536, 3072, etc.)
//     },
//   });

//   console.log("response-->", response);
//   console.log("response.embeddingsLength-->", response.embeddings?.length);

//   return response.embeddings?.map((embedding) => embedding.values ?? []) ?? [];
// }

export async function generateEmbeddings(texts: string[]) {
  const embeddings = await Promise.all(
    texts.map(async (text) => {
      const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text.replace(/\n/g, " "),
        config: {
          outputDimensionality: 1536,
        },
      });

      return response.embeddings?.[0]?.values ?? [];
    })
  );

  return embeddings;
}
