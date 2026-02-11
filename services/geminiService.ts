import { GoogleGenAI, Type } from "@google/genai";
import { SlideContent } from "../types";

const SYSTEM_INSTRUCTION = `
Eres un experto consultor de marketing colombiano, especializado en crear presentaciones de alto impacto (Pitch Decks) para productos de exportación.
Tu tono es profesional pero apasionado, evocando la riqueza de la tierra colombiana ("El realismo mágico").
Tu tarea es generar el contenido de texto para 10 diapositivas para una marca llamada "Prestige Foods" que vende pulpas de fruta premium.
El público objetivo son colombianos viviendo en el extranjero y extranjeros amantes de las frutas exóticas (Lulo, Maracuyá, Feijoa, Guanábana, etc.).
`;

export const generatePresentation = async (): Promise<SlideContent[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera una estructura de presentación de 10 diapositivas para 'Prestige Foods'.
      La historia debe fluir:
      1. Portada impactante.
      2. El problema (La nostalgia, la falta de fruta real en el exterior).
      3. La solución (Prestige Foods: Pulpa 100% natural).
      4. Nuestros Sabores (Menciona frutas exóticas colombianas).
      5. El proceso (Del campo a la mesa, apoyo al campesino).
      6. Calidad Premium (Sin conservantes, sabor auténtico).
      7. Mercado Objetivo (La diáspora colombiana y foodies).
      8. Modelo de Negocio / Distribución.
      9. Testimonio o Frase inspiradora sobre Colombia.
      10. Cierre y Llamado a la acción.
      
      Usa un lenguaje persuasivo, elegante y con "sabor" colombiano profesional.`,
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
              visualPrompt: { type: Type.STRING, description: "Una descripción corta de la imagen sugerida (ej: 'Un lulo fresco cortado por la mitad')" },
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
      const data = JSON.parse(response.text) as SlideContent[];
      
      // Append the specific video slide at the end
      const videoSlide: SlideContent = {
        id: 100, // Assign a unique ID
        title: "Nuestra Esencia en Movimiento",
        subtitle: "Descubre la magia detrás de Prestige Foods",
        bulletPoints: [],
        visualPrompt: "Video corporativo final",
        layoutType: "video",
        videoUrl: "https://yquqoqyowinhmjtkoveo.supabase.co/storage/v1/object/public/imagenes/grok-video-1edf1c8b-3ed9-47a7-b5bd-75659e4ddacc.mp4"
      };

      return [...data, videoSlide];
    }
    throw new Error("No se pudo generar el contenido.");
  } catch (error) {
    console.error("Error generating presentation:", error);
    throw error;
  }
};