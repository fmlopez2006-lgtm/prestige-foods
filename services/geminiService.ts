import { GoogleGenAI, Type } from "@google/genai";
import { SlideContent } from "../types";

const SYSTEM_INSTRUCTION = `
Eres un experto consultor de marketing colombiano de alto nivel. 
Tu lenguaje es profesional, ejecutivo y persuasivo.
Diseñas presentaciones para 'Prestige Foods', marca premium de pulpa de fruta colombiana.
Estructura la información para inversores y compradores internacionales.
`;

export const generatePresentation = async (): Promise<SlideContent[]> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Configuración requerida: Por favor, añade la variable API_KEY en el panel de Vercel.");
  }

  const ai = new GoogleGenAI({ apiKey });

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
    
    // Sanitización forzada: React Error #31 ocurre si intentas renderizar un objeto como texto
    const sanitizedData: SlideContent[] = rawData.map((item: any, index: number) => ({
      id: Number(item.id) || index + 1,
      title: String(item.title || "Prestige Foods"),
      subtitle: String(item.subtitle || ""),
      bulletPoints: Array.isArray(item.bulletPoints) 
        ? item.bulletPoints.map((p: any) => String(p)) 
        : ["Calidad Premium Garantizada"],
      visualPrompt: String(item.visualPrompt || "premium fruits"),
      layoutType: (['cover', 'content-left', 'content-right', 'quote', 'closing'].includes(item.layoutType) 
        ? item.layoutType 
        : 'content-left') as any
    }));
    
    // Slide de video constante
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