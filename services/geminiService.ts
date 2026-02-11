import { GoogleGenAI, Type } from "@google/genai";
import { SlideContent } from "../types";

const SYSTEM_INSTRUCTION = `
Eres un experto consultor de marketing colombiano, especializado en crear presentaciones de alto impacto para exportación.
Tu misión es presentar a 'Prestige Foods' como la mejor opción de pulpa de fruta premium del mundo.
`;

export const generatePresentation = async (): Promise<SlideContent[]> => {
  // En Vercel, asegúrate de añadir API_KEY en Settings > Environment Variables
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("La clave API no está configurada. Por favor, añádela como API_KEY en las variables de entorno de Vercel.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Genera una estructura de 10 diapositivas ejecutivas para Prestige Foods. Incluye análisis de mercado, productos estrella (Lulo, Gulupa) y visión global.",
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

    const text = response.text;
    if (text) {
      const rawData = JSON.parse(text);
      
      // Limpieza total para evitar que lleguen objetos inesperados al JSX (Error #31)
      const sanitizedData: SlideContent[] = rawData.map((item: any) => ({
        id: Number(item.id) || Math.random(),
        title: String(item.title || "Prestige Foods"),
        subtitle: String(item.subtitle || ""),
        bulletPoints: Array.isArray(item.bulletPoints) ? item.bulletPoints.map((p: any) => String(p)) : [],
        visualPrompt: String(item.visualPrompt || "premium fruit background"),
        layoutType: ['cover', 'content-left', 'content-right', 'quote', 'closing'].includes(item.layoutType) 
          ? item.layoutType 
          : 'content-left'
      }));
      
      const videoSlide: SlideContent = {
        id: 999,
        title: "Nuestra Esencia en Movimiento",
        subtitle: "Descubre la magia detrás de Prestige Foods",
        bulletPoints: ["Calidad Garantizada", "Origen Sostenible"],
        visualPrompt: "Video corporativo",
        layoutType: "video",
        videoUrl: "https://yquqoqyowinhmjtkoveo.supabase.co/storage/v1/object/public/imagenes/grok-video-1edf1c8b-3ed9-47a7-b5bd-75659e4ddacc.mp4"
      };

      return [...sanitizedData, videoSlide];
    }
    throw new Error("No se pudo obtener el contenido de la IA.");
  } catch (error: any) {
    console.error("Error en geminiService:", error);
    throw new Error(error.message || "Error al generar la presentación.");
  }
};