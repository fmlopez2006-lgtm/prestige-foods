import React, { useState } from 'react';
import { AppState, SlideContent } from './types';
import { generatePresentation } from './services/geminiService';
import PresentationViewer from './components/PresentationViewer';
import { Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setAppState(AppState.GENERATING);
    setError(null);
    try {
      const generatedSlides = await generatePresentation();
      setSlides(generatedSlides);
      setAppState(AppState.READY);
    } catch (err) {
      console.error(err);
      setError("Hubo un error conectando con la inteligencia artificial. Por favor intenta de nuevo.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setSlides([]);
  };

  if (appState === AppState.READY) {
    return <PresentationViewer slides={slides} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-prestige-green rounded-full blur-[150px] opacity-20"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-prestige-gold rounded-full blur-[150px] opacity-10"></div>
      </div>

      <div className="z-10 max-w-2xl w-full text-center space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-prestige-gold text-sm font-medium tracking-wide">
            <Sparkles size={16} />
            <span>AI Powered Presentation Deck</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight">
            Prestige <span className="text-prestige-gold">Foods</span>
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-lg mx-auto leading-relaxed">
            Genera una presentación ejecutiva de clase mundial para tus pulpas de fruta colombianas en segundos.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
          
          {appState === AppState.IDLE && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                   <h3 className="text-prestige-gold font-bold mb-1">Estrategia</h3>
                   <p className="text-sm text-slate-400">Enfoque en nostalgia y calidad de exportación.</p>
                </div>
                <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                   <h3 className="text-prestige-gold font-bold mb-1">Diseño</h3>
                   <p className="text-sm text-slate-400">10 Slides con imágenes generadas y copy persuasivo.</p>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full group relative flex items-center justify-center gap-3 bg-prestige-gold hover:bg-yellow-500 text-slate-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                <span>Generar Presentación</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-xs text-slate-500">
                Impulsado por Google Gemini • Diseñado para exportadores colombianos
              </p>
            </div>
          )}

          {appState === AppState.GENERATING && (
            <div className="py-12 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-prestige-gold blur-lg opacity-20 animate-pulse"></div>
                <Loader2 size={48} className="text-prestige-gold animate-spin relative z-10" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-medium text-white">Diseñando Slides...</h3>
                <p className="text-sm text-slate-400 animate-pulse">Redactando textos persuasivos y seleccionando imágenes...</p>
              </div>
            </div>
          )}

          {appState === AppState.ERROR && (
             <div className="py-8 flex flex-col items-center justify-center space-y-6">
               <div className="p-4 bg-red-500/10 rounded-full text-red-400">
                 <AlertCircle size={48} />
               </div>
               <div className="text-center space-y-2">
                 <h3 className="text-xl font-medium text-white">Ups, algo salió mal</h3>
                 <p className="text-sm text-slate-400 max-w-xs mx-auto">{error}</p>
               </div>
               <button
                onClick={() => setAppState(AppState.IDLE)}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
              >
                Intentar de nuevo
              </button>
             </div>
          )}

        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 text-slate-600 text-sm font-mono">
        HECHO EN COLOMBIA 🇨🇴
      </div>
    </div>
  );
};

export default App;