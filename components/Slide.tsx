import React from 'react';
import { SlideContent } from '../types';

interface SlideProps {
  data: SlideContent;
  isActive: boolean;
}

const Slide: React.FC<SlideProps> = ({ data, isActive }) => {
  // Usamos una lógica de búsqueda de imágenes más estética basada en el prompt visual
  const searchTerms = encodeURIComponent(`${data.visualPrompt}, luxury, organic, fruit, moody`);
  const imageUrl = `https://source.unsplash.com/featured/1600x900?${searchTerms}&sig=${data.id}`;

  const commonClasses = `absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] bg-prestige-dark overflow-hidden ${
    isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-110 pointer-events-none'
  }`;

  // Layout: Cover - Editorial Style
  if (data.layoutType === 'cover') {
    return (
      <div className={commonClasses}>
        <div className="absolute inset-0">
          <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover brightness-[0.6] contrast-125 animate-[kenburns_30s_linear_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-b from-prestige-dark/80 via-transparent to-prestige-dark"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center px-12 z-10">
          <div className="max-w-5xl text-center space-y-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-prestige-copper"></div>
              <span className="text-prestige-copper text-[10px] font-bold tracking-[0.6em] uppercase">Private Selection</span>
              <div className="h-[1px] w-12 bg-prestige-copper"></div>
            </div>
            <h1 className="text-8xl md:text-[10rem] font-serif font-black tracking-tighter leading-[0.85] text-prestige-cream">
              {data.title}
            </h1>
            <p className="text-2xl md:text-3xl font-serif italic text-prestige-copper/90 font-light max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          </div>
          <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-50">
             <div className="w-[1px] h-20 bg-prestige-copper/30"></div>
             <span className="text-[9px] tracking-[0.5em] uppercase font-bold">Volume I — Strategy</span>
          </div>
        </div>
        <style>{`
          @keyframes kenburns {
            0% { transform: scale(1.1) translate(0, 0); }
            50% { transform: scale(1.2) translate(-2%, 2%); }
            100% { transform: scale(1.1) translate(0, 0); }
          }
        `}</style>
      </div>
    );
  }

  // Layout: Content Left - Modern Split
  if (data.layoutType === 'content-left') {
    return (
      <div className={`${commonClasses} flex flex-col md:flex-row`}>
        <div className="w-full md:w-[45%] h-full bg-prestige-emerald p-16 md:p-24 flex flex-col justify-center relative border-r border-prestige-copper/10">
          <span className="absolute top-12 left-12 text-prestige-copper/20 font-serif italic text-6xl">{String(data.id).padStart(2, '0')}</span>
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-prestige-cream leading-[1.1] tracking-tight">{data.title}</h2>
            <div className="h-1 w-20 bg-prestige-copper"></div>
            <p className="text-xl font-serif italic text-prestige-copper/80">{data.subtitle}</p>
            <ul className="space-y-6 pt-4">
              {data.bulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-prestige-copper ring-4 ring-prestige-copper/10 group-hover:scale-125 transition-transform"></div>
                  <span className="text-lg text-prestige-cream/80 font-light leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden">
          <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover brightness-90 contrast-110 grayscale-[0.2] hover:scale-105 transition-transform duration-[2000ms]" />
          <div className="absolute inset-0 bg-prestige-emerald/20 mix-blend-overlay"></div>
        </div>
      </div>
    );
  }

  // Layout: Content Right - Image Focus
  if (data.layoutType === 'content-right') {
    return (
      <div className={`${commonClasses} flex flex-col md:flex-row-reverse`}>
        <div className="w-full md:w-[45%] h-full bg-prestige-dark p-16 md:p-24 flex flex-col justify-center border-l border-prestige-copper/10">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-prestige-copper leading-[1.1] tracking-tight">{data.title}</h2>
            <h3 className="text-xl font-serif italic text-prestige-cream/60">{data.subtitle}</h3>
            <div className="space-y-6">
              {data.bulletPoints.map((point, idx) => (
                <div key={idx} className="pb-4 border-b border-prestige-copper/10">
                  <p className="text-lg text-prestige-cream font-light">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden">
          <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover brightness-75 contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-prestige-dark/60"></div>
        </div>
      </div>
    );
  }

  // Layout: Quote - Minimalist Elegance
  if (data.layoutType === 'quote') {
    return (
      <div className={commonClasses}>
        <div className="absolute inset-0 opacity-40">
           <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover grayscale brightness-50" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center p-20 text-center">
          <div className="max-w-4xl glass-card p-16 rounded-[40px] space-y-8">
            <span className="text-prestige-copper text-6xl font-serif">“</span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-prestige-cream leading-snug">
              {data.title}
            </h2>
            <div className="h-[1px] w-12 bg-prestige-copper mx-auto"></div>
            <p className="text-xs font-bold tracking-[0.4em] text-prestige-copper uppercase">{data.subtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  // Layout: Video - Cinematic Focus
  if (data.layoutType === 'video' && data.videoUrl) {
    return (
      <div className={`${commonClasses} bg-black`}>
        <div className="absolute inset-0 z-0">
           <video src={data.videoUrl} className="w-full h-full object-cover blur-2xl opacity-20 scale-110" muted loop autoPlay />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
           <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.9)] border border-prestige-copper/30">
             <video src={data.videoUrl} className="w-full h-full object-cover" controls autoPlay muted />
           </div>
           <div className="mt-12 text-center">
              <h2 className="text-4xl font-serif font-bold text-prestige-cream mb-2">{data.title}</h2>
              <div className="flex items-center justify-center gap-3">
                <span className="h-[1px] w-8 bg-prestige-copper"></span>
                <p className="text-prestige-copper font-bold tracking-[0.3em] text-[10px] uppercase">{data.subtitle}</p>
                <span className="h-[1px] w-8 bg-prestige-copper"></span>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Layout: Closing - High Impact
  return (
    <div className={`${commonClasses} flex items-center justify-center p-12`}>
      <div className="absolute inset-0">
         <img src={imageUrl} alt="closing" className="w-full h-full object-cover brightness-[0.2]" />
      </div>
      <div className="max-w-4xl w-full glass-card p-20 rounded-[60px] text-center space-y-10 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-prestige-copper to-transparent"></div>
        <div className="inline-block p-1 border border-prestige-copper/30 rounded-full">
           <div className="w-16 h-16 rounded-full bg-prestige-emerald flex items-center justify-center border border-prestige-copper/20">
              <span className="font-serif font-black text-prestige-copper text-xl">PF</span>
           </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-7xl font-serif font-black text-prestige-cream tracking-tighter leading-none">{data.title}</h2>
          <p className="text-xl font-serif italic text-prestige-copper">{data.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-left py-10">
            {data.bulletPoints.map((point, idx) => (
              <div key={idx} className="group cursor-default">
                <p className="text-[10px] font-bold text-prestige-copper uppercase tracking-widest mb-2 opacity-50">Strategy {idx + 1}</p>
                <p className="text-lg text-prestige-cream font-light border-l border-prestige-copper/30 pl-4 group-hover:border-prestige-copper transition-colors">{point}</p>
              </div>
            ))}
        </div>
        <div className="pt-10 border-t border-prestige-copper/10">
          <p className="text-[11px] font-black tracking-[0.6em] text-prestige-copper uppercase">prestigefoods.co</p>
        </div>
      </div>
    </div>
  );
};

export default Slide;