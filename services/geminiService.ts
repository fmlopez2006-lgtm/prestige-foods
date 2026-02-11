import { GoogleGenAI, Type } from "@google/genai";
import { SlideContent } from "../types";

// Clave API autorizada para uso directo en Vercel por el usuario
const USER_API_KEY = "AIzaSyA2aC6c7jW3kud36fDCmMgyxUbQq9OUpAs";

const SYSTEM_INSTRUCTION = `
Eres un Director Creativo de una agencia de branding de lujo en Colombia.
Tu estilo visual es editorial, minimalista y de alto contraste (estilo revista Monocle o Kinfolk).
Diseñas presentaciones para 'Prestige Foods' (pulpas de fruta premium).
Estructura la presentación con una narrativa de exclusividad.
IMPORTANTE: El campo 'visualPrompt' debe ser una descripción artística corta en inglés para buscar una imagen en Unsplash (ej: "moody tropical fruit dark background", "luxury food photography glass bottle").
`;

export const generatePresentation = async (): Promise<SlideContent[]> => {
  const ai = new GoogleGenAI({ apiKey: USER_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Crea una presentación maestra de 10 diapositivas para Prestige Foods. Enfócate en la superioridad del origen colombiano, la pureza del producto y la sofisticación del proceso de exportación.",
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
              visualPrompt: { type: Type.STRING, description: "Keywords en inglés para fotografía de stock de lujo" },
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

    const text = response.text;
    if (!text) throw new Error("La IA no generó respuesta.");

    const rawData = JSON.parse(text);
    
    const sanitizedData: SlideContent[] = rawData.map((item: any, index: number) => ({
      id: Number(item.id) || index + 1,
      title: typeof item.title === 'string' ? item.title : "Prestige",
      subtitle: typeof item.subtitle === 'string' ? item.subtitle : "",
      bulletPoints: Array.isArray(item.bulletPoints) 
        ? item.bulletPoints.map((p: any) => typeof p === 'string' ? p : String(p)) 
        : ["Exclusividad garantizada"],
      visualPrompt: typeof item.visualPrompt === 'string' ? item.visualPrompt : "premium fruit",
      layoutType: (['cover', 'content-left', 'content-right', 'quote', 'closing'].includes(item.layoutType) 
        ? item.layoutType 
        : 'content-left') as any
    }));
    
    const videoSlide: SlideContent = {
      id: 999,
      title: "El Origen del Sabor",
      subtitle: "Compromiso con la tierra colombiana",
      bulletPoints: ["Cosecha manual", "Fruta de exportación", "Proceso en frío"],
      visualPrompt: "Colombian highlands agriculture",
      layoutType: "video",
      videoUrl: "https://yquqoqyowinhmjtkoveo.supabase.co/storage/v1/object/public/imagenes/grok-video-1edf1c8b-3ed9-47a7-b5bd-75659e4ddacc.mp4"
    };

    return [...sanitizedData, videoSlide];
  } catch (error: any) {
    console.error("Error en geminiService:", error);
    throw new Error("Fallo en la conexión creativa. Intente nuevamente.");
  }
};