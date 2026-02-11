
import React, { useState, useEffect } from 'react';
import { AppState, SlideContent } from './types';
import { generatePresentation } from './services/geminiService';
import PresentationViewer from './components/PresentationViewer';
import ChatWidget from './components/ChatWidget';
import { Sparkles, ArrowRight, Loader2, AlertCircle, Globe, Leaf, Briefcase } from 'lucide-react';

const LOADING_MESSAGES = [
  "Cosechando las mejores frutas colombianas...",
  "Extrayendo el realismo mágico en cada slide...",
  "Diseñando estrategia de exportación premium...",
  "Preparando la logística del sabor...",
  "Pulverizando barreras comerciales...",
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
    } catch (err) {
      console.error(err);
      setError("No pudimos conectar con el consultor AI. Por favor, verifica tu conexión e intenta de nuevo.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setSlides([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      {appState === AppState.READY ? (
        <PresentationViewer slides={slides} onReset={handleReset} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
          {/* Background Ambience */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-prestige-green rounded-full blur-[160px] opacity-30"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-prestige-gold rounded-full blur-[160px] opacity-10"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
          </div>

          <div className="z-10 max-w-3xl w-full text-center space-y-12">
            {/* Header */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-prestige-green/20 border border-prestige-gold/30 text-prestige-gold text-xs font-bold tracking-[0.2em] uppercase">
                <Sparkles size={14} />
                <span>Consultoría de Exportación AI</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter">
                Prestige <span className="text-prestige-gold italic">Foods</span>
              </h1>
              <p className="text-xl text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
                Tu pasaporte al mercado global. Creamos presentaciones ejecutivas de nivel 
                <span className="text-prestige-gold font-bold"> World-Class</span> para productos agrícolas colombianos.
              </p>
            </div>

            {/* Action Area */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden">
              
              {appState === AppState.IDLE && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-prestige-gold/40 transition-colors">
                       <div className="text-prestige-gold mb-3"><Leaf size={24} /></div>
                       <h3 className="font-bold text-white mb-1">Pura Esencia</h3>
                       <p className="text-xs text-slate-400">Enfoque en frutas 100% naturales y origen certificado.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-prestige-gold/40 transition-colors">
                       <div className="text-prestige-gold mb-3"><Globe size={24} /></div>
                       <h3 className="font-bold text-white mb-1">Global Reach</h3>
                       <p className="text-xs text-slate-400">Storytelling adaptado a inversionistas y distribuidores.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-prestige-gold/40 transition-colors">
                       <div className="text-prestige-gold mb-3"><Briefcase size={24} /></div>
                       <h3 className="font-bold text-white mb-1">Pitch Pro</h3>
                       <p className="text-sm text-slate-400">11 slides optimizados para cerrar negocios.</p>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    className="w-full group relative flex items-center justify-center gap-4 bg-prestige-gold hover:bg-prestige-gold/90 text-slate-950 font-black py-5 px-10 rounded-2xl transition-all duration-500 transform hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(212,175,55,0.25)] active:scale-95"
                  >
                    <span className="text-lg uppercase tracking-wider">Generar Estrategia Maestra</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                  
                  <div className="flex justify-center gap-6 text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Gemini 3 Pro</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 4K Visuals</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-prestige-gold"></span> Export ready</span>
                  </div>
                </div>
              )}

              {appState === AppState.GENERATING && (
                <div className="py-16 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 bg-prestige-gold blur-[40px] opacity-30 animate-pulse"></div>
                    <div className="w-24 h-24 border-2 border-prestige-gold/20 border-t-prestige-gold rounded-full animate-spin flex items-center justify-center relative z-10">
                       <Sparkles className="text-prestige-gold animate-bounce" size={32} />
                    </div>
                  </div>
                  <div className="space-y-4 text-center">
                    <h3 className="text-2xl font-serif italic text-white">{LOADING_MESSAGES[loadingMsgIdx]}</h3>
                    <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                       <div className="h-full bg-prestige-gold animate-[loading_2s_ease-in-out_infinite]"></div>
                    </div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Nuestra inteligencia está puliendo cada detalle</p>
                  </div>
                </div>
              )}

              {appState === AppState.ERROR && (
                 <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95">
                   <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 border border-red-500/20">
                     <AlertCircle size={40} />
                   </div>
                   <div className="text-center space-y-3">
                     <h3 className="text-2xl font-bold text-white">Error de Sistema</h3>
                     <p className="text-slate-400 max-w-xs mx-auto text-sm">{error}</p>
                   </div>
                   <button
                    onClick={() => setAppState(AppState.IDLE)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold border border-white/10 transition-all active:scale-95"
                  >
                    Reintentar Proceso
                  </button>
                 </div>
              )}
            </div>
          </div>
          
          {/* Footer Branding */}
          <div className="absolute bottom-10 left-10 flex items-center gap-4 text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase">
            <span className="w-8 h-[1px] bg-slate-800"></span>
            Estrategia de Exportación Colombiana 
            <span className="w-8 h-[1px] bg-slate-800"></span>
          </div>
        </div>
      )}
      <ChatWidget />
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default App;
