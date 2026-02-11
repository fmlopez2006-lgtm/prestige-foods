import React, { useState, useEffect } from 'react';
import { AppState, SlideContent } from './types';
import { generatePresentation } from './services/geminiService';
import PresentationViewer from './components/PresentationViewer';
import ChatWidget from './components/ChatWidget';
import { Sparkles, ArrowRight, AlertCircle, Zap, Shield, Crown } from 'lucide-react';

const LOADING_MESSAGES = [
  "Curando selección de imágenes...",
  "Redactando narrativa estratégica...",
  "Ajustando paleta editorial...",
  "Certificando origen colombiano...",
  "Pulimentando el cobre y esmeralda..."
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
    <div className="min-h-screen bg-prestige-dark text-prestige-cream relative font-sans">
      {appState === AppState.READY ? (
        <PresentationViewer slides={slides} onReset={handleReset} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-prestige-emerald rounded-full blur-[160px] opacity-20"></div>
             <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-prestige-copper rounded-full blur-[160px] opacity-10"></div>
          </div>

          <div className="z-10 max-w-4xl w-full text-center space-y-16">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-prestige-copper/10 border border-prestige-copper/30 text-prestige-copper text-[10px] font-black uppercase tracking-[0.5em]">
                <Crown size={14} />
                <span>Editorial Excellence</span>
              </div>
              <h1 className="text-7xl md:text-[10rem] font-serif font-black tracking-tighter leading-none">
                Prestige <span className="text-prestige-copper italic font-light">— Foods</span>
              </h1>
              <p className="text-2xl text-prestige-cream/50 font-serif italic max-w-2xl mx-auto">
                Estrategia visual para la exportación de clase mundial.
              </p>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[40px] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
              {appState === AppState.IDLE && (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="p-6 rounded-2xl border border-white/5 hover:border-prestige-copper/30 transition-all group">
                       <Zap className="text-prestige-copper mb-4 group-hover:scale-110 transition-transform" size={20} />
                       <h3 className="font-bold text-xs uppercase tracking-widest mb-1">Impacto</h3>
                       <p className="text-[11px] opacity-40 uppercase tracking-tighter">Narrativa Persuasiva</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/5 hover:border-prestige-copper/30 transition-all group">
                       <Shield className="text-prestige-copper mb-4 group-hover:scale-110 transition-transform" size={20} />
                       <h3 className="font-bold text-xs uppercase tracking-widest mb-1">Confianza</h3>
                       <p className="text-[11px] opacity-40 uppercase tracking-tighter">Datos Certificados</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/5 hover:border-prestige-copper/30 transition-all group">
                       <Crown className="text-prestige-copper mb-4 group-hover:scale-110 transition-transform" size={20} />
                       <h3 className="font-bold text-xs uppercase tracking-widest mb-1">Prestigio</h3>
                       <p className="text-[11px] opacity-40 uppercase tracking-tighter">Branding Editorial</p>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    className="w-full relative group overflow-hidden bg-prestige-copper text-prestige-dark font-black py-6 px-12 rounded-2xl transition-all shadow-[0_30px_60px_-15px_rgba(184,134,11,0.4)]"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-sm uppercase tracking-[0.4em]">Curar Estrategia Maestra</span>
                      <ArrowRight size={20} />
                    </div>
                  </button>
                </div>
              )}

              {appState === AppState.GENERATING && (
                <div className="py-20 flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
                  <div className="relative">
                    <div className="w-24 h-24 border border-prestige-copper/20 rounded-full"></div>
                    <div className="absolute inset-0 border-t border-prestige-copper rounded-full animate-spin"></div>
                  </div>
                  <div className="space-y-4 text-center">
                    <h3 className="text-3xl font-serif italic text-prestige-cream">{LOADING_MESSAGES[loadingMsgIdx]}</h3>
                    <div className="flex justify-center gap-1">
                      {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-prestige-copper rounded-full animate-pulse" style={{animationDelay: `${i*200}ms`}}></div>)}
                    </div>
                  </div>
                </div>
              )}

              {appState === AppState.ERROR && (
                 <div className="py-12 flex flex-col items-center justify-center space-y-8">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                      <AlertCircle className="text-red-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-serif italic text-red-400">{error || "Error en el despliegue editorial."}</h3>
                    <button
                      onClick={handleReset}
                      className="px-10 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] border border-white/10 transition-all"
                    >
                      Intentar de nuevo
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