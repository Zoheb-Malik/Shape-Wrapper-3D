import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// Note: In a production app, ensure the API key is handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTexture = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  try {
    // Using gemini-2.5-flash-image for image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a high quality, seamless texture image of: ${prompt}. The image should be suitable for wrapping around 3D objects. No text, just texture pattern.`,
          },
        ],
      },
    });

    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    const candidate = response.candidates[0];
    const parts = candidate.content?.parts;

    if (!parts) {
       throw new Error("No content parts found in response");
    }

    // Iterate through parts to find the image
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate texture.");
  }
};
