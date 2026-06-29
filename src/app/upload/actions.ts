"use server";

import { PDFParse } from "pdf-parse";
import { db } from "@/lib/db-config";
import { documents } from "@/lib/db-schema";
import { generateEmbeddings } from "@/lib/embeddings";
import { chunkContent } from "@/lib/chunking";

export async function processPdfFile(formDate: FormData) {
  try {
    const file = formDate.get("pdf") as File;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const parser = new PDFParse({
      data: buffer,
    });
    const data = await parser.getText();

    if (!data.text || data.text.trim().length === 0) {
      return {
        success: false,
        error: "No text found in PDF file",
      };
    }

    // 1. Chunk the content
    const chunks = await chunkContent(data.text);
    // 2. Generate embeddings for all chunks at once
    const embeddings = await generateEmbeddings(chunks);

    // 👇 Verify the dimension
    console.log("embeddings:", embeddings);
    console.log("Total chunks:", chunks.length);
    console.log("Embedding dimension:", embeddings[0].length);
    console.log("First embedding:", embeddings[0].slice(0, 10)); // First 10 values
    console.log("embedings length:", embeddings.length);

    // 3. Map them correctly into individual rows
    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
    }));

    // 4. Batch insert into the database
    await db.insert(documents).values(records);

    return {
      success: true,
      message: `Created ${records.length} searchable chunks`,
    };
  } catch (error) {
    console.error("Error processing PDF file:", error);
    return {
      success: false,
      error: "Failed to process PDF file",
    };
  }
}
