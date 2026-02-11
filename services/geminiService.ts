import { GoogleGenAI, Type } from "@google/genai";
import { SlideContent } from "../types";

// Clave API proporcionada por el usuario para uso directo en Vercel
const USER_API_KEY = "AIzaSyA2aC6c7jW3kud36fDCmMgyxUbQq9OUpAs";

const SYSTEM_INSTRUCTION = `
Eres un experto consultor de marketing colombiano de alto nivel. 
Tu lenguaje es profesional, ejecutivo y persuasivo.
Diseñas presentaciones para 'Prestige Foods', marca premium de pulpa de fruta colombiana.
Estructura la información para inversores y compradores internacionales.
`;

export const generatePresentation = async (): Promise<SlideContent[]> => {
  // Se usa la clave directa como solicitó el usuario para evitar errores de configuración
  const ai = new GoogleGenAI({ apiKey: USER_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Crea una presentación de 10 diapositivas para Prestige Foods. Enfócate en la calidad premium, origen colombiano, certificaciones de exportación y portafolio (Guanábana, Mango, Lulo, Gulupa).",
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
    if (!text) throw new Error("La IA no devolvió contenido.");

    const rawData = JSON.parse(text);
    
    // Sanitización extrema para evitar React Error #31
    const sanitizedData: SlideContent[] = rawData.map((item: any, index: number) => ({
      id: Number(item.id) || index + 1,
      title: typeof item.title === 'string' ? item.title : "Prestige Foods",
      subtitle: typeof item.subtitle === 'string' ? item.subtitle : "",
      bulletPoints: Array.isArray(item.bulletPoints) 
        ? item.bulletPoints.map((p: any) => typeof p === 'string' ? p : String(p)) 
        : ["Calidad Premium Garantizada"],
      visualPrompt: typeof item.visualPrompt === 'string' ? item.visualPrompt : "fruits",
      layoutType: (['cover', 'content-left', 'content-right', 'quote', 'closing'].includes(item.layoutType) 
        ? item.layoutType 
        : 'content-left') as any
    }));
    
    const videoSlide: SlideContent = {
      id: 999,
      title: "Excelencia en cada Gota",
      subtitle: "Nuestra planta de producción con estándares mundiales",
      bulletPoints: ["Tecnología de punta", "Inocuidad total", "Sabor natural preservado"],
      visualPrompt: "Video corporativo",
      layoutType: "video",
      videoUrl: "https://yquqoqyowinhmjtkoveo.supabase.co/storage/v1/object/public/imagenes/grok-video-1edf1c8b-3ed9-47a7-b5bd-75659e4ddacc.mp4"
    };

    return [...sanitizedData, videoSlide];
  } catch (error: any) {
    console.error("Error en geminiService:", error);
    throw new Error(error.message || "Error al conectar con el servicio de IA.");
  }
};