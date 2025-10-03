
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show a more user-friendly error or disable functionality.
  // For this example, we'll throw an error to make it clear during development.
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateCaptionFromImage(
  base64ImageData: string,
  mimeType: string,
  userPrompt: string
): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: userPrompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating caption from Gemini:", error);
    if (error instanceof Error) {
        // Provide a more user-friendly message
        if (error.message.includes('API key not valid')) {
            return 'Error: The provided API Key is not valid. Please check your configuration.';
        }
        return `Error calling AI model: ${error.message}`;
    }
    return "An unknown error occurred while generating the caption.";
  }
}
