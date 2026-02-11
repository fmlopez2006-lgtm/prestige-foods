import React, { useState, useEffect } from 'react';
import { AppState, SlideContent } from './types';
import { generatePresentation } from './services/geminiService';
import PresentationViewer from './components/PresentationViewer';
import ChatWidget from './components/ChatWidget';
import { Sparkles, ArrowRight, AlertCircle, Globe, Leaf, Briefcase } from 'lucide-react';

const LOADING_MESSAGES = [
  "Cosechando las mejores frutas colombianas...",
  "Extrayendo el realismo mágico en cada slide...",
  "Diseñando estrategia de exportación premium...",
  "Preparando la logística del sabor...",
  "Cargando el sol del trópico..."
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    let interval: any;
    if (appState === AppState.GENERATING) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const handleGenerate = async () => {
    setAppState(AppState.GENERATING);
    setError(null);
    try {
      const generatedSlides = await generatePresentation();
      setSlides(generatedSlides);
      setAppState(AppState.READY);
    } catch (err: any) {
      console.error(err);
      // Forzamos el error a ser siempre un string
      setError(err.message || "Error inesperado en el consultor AI.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setSlides([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative font-sans">
      {appState === AppState.READY ? (
        <PresentationViewer slides={slides} onReset={handleReset} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-prestige-green rounded-full blur-[160px] opacity-30"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-prestige-gold rounded-full blur-[160px] opacity-10"></div>
          </div>

          <div className="z-10 max-w-3xl w-full text-center space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-prestige-green/20 border border-prestige-gold/30 text-prestige-gold text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} />
                <span>Consultoría de Exportación AI</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter">
                Prestige <span className="text-prestige-gold italic">Foods</span>
              </h1>
              <p className="text-xl text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
                Tu pasaporte al mercado global con estrategia 
                <span className="text-prestige-gold font-bold"> World-Class</span>.
              </p>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl relative overflow-hidden">
              {appState === AppState.IDLE && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-prestige-gold/40 transition-colors">
                       <Leaf className="text-prestige-gold mb-3" size={24} />
                       <h3 className="font-bold text-sm">Pura Esencia</h3>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-prestige-gold/40 transition-colors">
                       <Globe className="text-prestige-gold mb-3" size={24} />
                       <h3 className="font-bold text-sm">Global Reach</h3>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-prestige-gold/40 transition-colors">
                       <Briefcase className="text-prestige-gold mb-3" size={24} />
                       <h3 className="font-bold text-sm">Pitch Pro</h3>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    className="w-full flex items-center justify-center gap-4 bg-prestige-gold hover:bg-prestige-gold/90 text-slate-950 font-black py-5 px-10 rounded-2xl transition-all"
                  >
                    <span className="text-lg uppercase tracking-wider">Generar Estrategia Maestra</span>
                    <ArrowRight />
                  </button>
                </div>
              )}

              {appState === AppState.GENERATING && (
                <div className="py-16 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                  <div className="w-16 h-16 border-4 border-prestige-gold/20 border-t-prestige-gold rounded-full animate-spin"></div>
                  <div className="space-y-4 text-center">
                    <h3 className="text-2xl font-serif italic text-white">{LOADING_MESSAGES[loadingMsgIdx]}</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Nuestra inteligencia está puliendo cada detalle</p>
                  </div>
                </div>
              )}

              {appState === AppState.ERROR && (
                 <div className="py-12 flex flex-col items-center justify-center space-y-6">
                   <AlertCircle className="text-red-400" size={48} />
                   <div className="text-center">
                     <h3 className="text-2xl font-bold">Error de Sistema</h3>
                     <p className="text-slate-400 text-sm mt-2">{typeof error === 'string' ? error : "Ocurrió un error inesperado"}</p>
                   </div>
                   <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold border border-white/10"
                  >
                    Reintentar
                  </button>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ChatWidget />
    </div>
  );
};

export default App;