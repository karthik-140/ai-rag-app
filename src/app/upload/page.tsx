"use client";

import { useState } from "react";
import { processPdfFile } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function PDFUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const result = await processPdfFile(formData);

      console.log("result", result);
      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "PDF processed successfully",
        });
        event.target.value = ""; // Reset the file input
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to process PDF",
        });
        event.target.value = ""; // Reset the file input
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setMessage({ type: "error", text: "Failed to upload PDF file" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1>PDF Upload</h1>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label htmlFor="pdf-upload" className="text-lg font-semibold">
                Upload PDF file
              </Label>
              <Input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isLoading}
                className="mt-2"
              />
            </div>
            {isLoading && (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                <span className="text-muted-foreground">Processing PDF...</span>
              </div>
            )}
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
              >
                <AlertTitle>
                  {message.type === "success" ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
