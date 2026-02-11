import { GoogleGenAI, Type } from "@google/genai";
import { SlideContent } from "../types";

const SYSTEM_INSTRUCTION = `
Eres un experto consultor de marketing colombiano, especializado en crear presentaciones de alto impacto (Pitch Decks) para productos de exportación.
Tu tono es profesional pero apasionado, evocando la riqueza de la tierra colombiana.
Tu tarea es generar el contenido de texto para 10 diapositivas para una marca llamada "Prestige Foods".
`;

export const generatePresentation = async (): Promise<SlideContent[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera una estructura de presentación de 10 diapositivas para 'Prestige Foods'.
      Usa un lenguaje persuasivo, elegante y profesional.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              bulletPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              visualPrompt: { type: Type.STRING },
              layoutType: { 
                type: Type.STRING, 
                enum: ['cover', 'content-left', 'content-right', 'quote', 'closing'] 
              }
            },
            required: ["id", "title", "subtitle", "bulletPoints", "visualPrompt", "layoutType"]
          }
        }
      }
    });

    if (response.text) {
      const rawData = JSON.parse(response.text) as any[];
      
      // Sanitización profunda para evitar objetos en el renderizado
      const sanitizedData: SlideContent[] = rawData.map(item => ({
        id: Number(item.id),
        title: String(item.title || ''),
        subtitle: String(item.subtitle || ''),
        bulletPoints: Array.isArray(item.bulletPoints) ? item.bulletPoints.map((p: any) => String(p)) : [],
        visualPrompt: String(item.visualPrompt || ''),
        layoutType: item.layoutType as any
      }));
      
      const videoSlide: SlideContent = {
        id: 100,
        title: "Nuestra Esencia en Movimiento",
        subtitle: "Descubre la magia detrás de Prestige Foods",
        bulletPoints: [],
        visualPrompt: "Video corporativo final",
        layoutType: "video",
        videoUrl: "https://yquqoqyowinhmjtkoveo.supabase.co/storage/v1/object/public/imagenes/grok-video-1edf1c8b-3ed9-47a7-b5bd-75659e4ddacc.mp4"
      };

      return [...sanitizedData, videoSlide];
    }
    throw new Error("Respuesta vacía de la IA");
  } catch (error) {
    console.error("Error generating presentation:", error);
    throw error;
  }
};