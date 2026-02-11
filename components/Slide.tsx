import React from 'react';
import { SlideContent } from '../types';

interface SlideProps {
  data: SlideContent;
  isActive: boolean;
}

const Slide: React.FC<SlideProps> = ({ data, isActive }) => {
  const imageSeed = `prestige-v2-${data.id}`; 
  const imageUrl = `https://picsum.photos/seed/${imageSeed}/1600/1000`;

  const commonClasses = `absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out bg-white overflow-hidden ${
    isActive ? 'opacity-100 z-10 translate-y-0 scale-100' : 'opacity-0 z-0 translate-y-4 scale-105 pointer-events-none'
  }`;

  // Layout: Cover
  if (data.layoutType === 'cover') {
    return (
      <div className={commonClasses}>
        <div className="absolute inset-0">
          <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover scale-105 animate-[kenburns_20s_ease_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-t from-prestige-green via-prestige-green/60 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12 z-10 text-white">
          <div className="space-y-4 max-w-4xl">
            <span className="text-prestige-gold text-xs font-black tracking-[0.5em] uppercase border-b border-prestige-gold/30 pb-2 inline-block">Colombia Premium Fruit</span>
            <h1 className="text-7xl md:text-9xl font-serif font-black tracking-tighter mb-4 leading-none">{data.title}</h1>
            <p className="text-2xl font-light text-prestige-gold italic font-serif">{data.subtitle}</p>
          </div>
          <div className="absolute bottom-16 w-full flex flex-col items-center space-y-4">
             <div className="w-px h-16 bg-gradient-to-b from-prestige-gold to-transparent"></div>
             <p className="text-[10px] opacity-40 uppercase tracking-[0.4em]">Estrategia Ejecutiva Internacional</p>
          </div>
        </div>
        <style>{`
          @keyframes kenburns {
            0% { transform: scale(1); }
            100% { transform: scale(1.2) rotate(1deg); }
          }
        `}</style>
      </div>
    );
  }

  // Layout: Content Left (Image Right)
  if (data.layoutType === 'content-left') {
    return (
      <div className={`${commonClasses} flex`}>
        <div className="w-5/12 p-20 flex flex-col justify-center bg-prestige-cream text-prestige-green relative">
          <div className="absolute top-10 left-10 text-[60px] font-serif font-black text-prestige-green/5 select-none">{String(data.id).padStart(2, '0')}</div>
          <h2 className="text-5xl font-serif font-black mb-8 leading-tight tracking-tighter">{data.title}</h2>
          <h3 className="text-xl font-medium mb-10 text-prestige-gold italic">{data.subtitle}</h3>
          <ul className="space-y-6">
            {data.bulletPoints.map((point, idx) => (
              <li key={idx} className="flex items-start group">
                <span className="w-2 h-2 rounded-full bg-prestige-gold mt-2.5 mr-4 shrink-0 transition-transform group-hover:scale-150"></span>
                <span className="text-lg leading-relaxed text-slate-700 font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-7/12 h-full relative overflow-hidden">
          <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
          <div className="absolute inset-0 bg-prestige-green/10 mix-blend-multiply"></div>
        </div>
      </div>
    );
  }

  // Layout: Content Right (Image Left)
  if (data.layoutType === 'content-right') {
    return (
      <div className={`${commonClasses} flex flex-row-reverse`}>
         <div className="w-5/12 p-20 flex flex-col justify-center bg-prestige-green text-white relative">
          <div className="absolute top-10 right-10 text-[60px] font-serif font-black text-white/5 select-none">{String(data.id).padStart(2, '0')}</div>
          <h2 className="text-5xl font-serif font-black mb-8 text-prestige-gold leading-tight tracking-tighter">{data.title}</h2>
          <h3 className="text-xl font-light mb-10 opacity-70 italic font-serif">{data.subtitle}</h3>
          <ul className="space-y-6">
            {data.bulletPoints.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <div className="mt-1.5 mr-4 p-1 rounded-sm border border-prestige-gold/50">
                  <div className="w-1.5 h-1.5 bg-prestige-gold"></div>
                </div>
                <span className="text-lg leading-relaxed opacity-90 font-light">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-7/12 h-full relative overflow-hidden">
          <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-prestige-green/40 to-transparent"></div>
        </div>
      </div>
    );
  }

  // Layout: Quote / Testimonial
  if (data.layoutType === 'quote') {
    return (
      <div className={commonClasses}>
        <div className="absolute inset-0">
           <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover brightness-[0.2]" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center p-20 text-center z-10">
          <div className="w-20 h-[1px] bg-prestige-gold/50 mb-12"></div>
          <h2 className="text-5xl md:text-6xl font-serif font-italic text-white leading-tight mb-10 max-w-5xl italic px-10">
            "{data.title}"
          </h2>
          <p className="text-xl text-prestige-gold font-black tracking-[0.2em] uppercase">{data.subtitle}</p>
          <div className="w-20 h-[1px] bg-prestige-gold/50 mt-12"></div>
        </div>
      </div>
    );
  }

  // Layout: Video
  if (data.layoutType === 'video' && data.videoUrl) {
    return (
      <div className={`${commonClasses} bg-black flex items-center justify-center`}>
        <div className="absolute inset-0 z-0">
           <video src={data.videoUrl} className="w-full h-full object-cover blur-3xl opacity-30 scale-110" muted loop playsInline autoPlay />
        </div>
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">
           <div className="w-full max-w-5xl aspect-video bg-black rounded-lg shadow-[0_48px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 group relative">
             <video src={data.videoUrl} className="w-full h-full object-contain" controls playsInline autoPlay muted />
             <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                <span className="text-[10px] font-black text-white/50 tracking-widest uppercase">Video Corporativo Master</span>
             </div>
           </div>
           
           <div className="mt-12 text-center space-y-2">
              <h2 className="text-4xl font-serif font-black text-white tracking-tighter">{data.title}</h2>
              <p className="text-prestige-gold font-bold tracking-[0.3em] text-xs uppercase">{data.subtitle}</p>
           </div>
        </div>
      </div>
    );
  }

  // Layout: Closing
  return (
    <div className={`${commonClasses} bg-prestige-green flex flex-col justify-center items-center text-center p-12 relative`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20"></div>
      
      <div className="bg-white/[0.03] p-20 rounded-3xl backdrop-blur-xl border border-white/10 max-w-4xl w-full shadow-2xl relative z-10">
        <div className="mb-10 inline-block p-4 border border-prestige-gold/20 rounded-full">
           <div className="w-16 h-16 rounded-full bg-prestige-gold flex items-center justify-center text-slate-900 font-serif font-black text-2xl">PF</div>
        </div>
        
        <h2 className="text-6xl font-serif font-black text-prestige-gold mb-6 tracking-tighter">{data.title}</h2>
        <p className="text-2xl text-white font-light mb-12 italic opacity-80">{data.subtitle}</p>
        
        <div className="grid grid-cols-2 gap-8 text-left mb-16">
            {data.bulletPoints.map((point, idx) => (
              <div key={idx} className="border-l-2 border-prestige-gold/30 pl-6 py-2">
                <p className="text-sm font-bold text-white/80 uppercase tracking-widest leading-relaxed">{point}</p>
              </div>
            ))}
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col items-center">
          <p className="text-lg text-white font-serif italic mb-2">Prestigio que cruza fronteras</p>
          <p className="text-xs text-prestige-gold font-black tracking-[0.4em] uppercase">www.prestigefoods.co</p>
        </div>
      </div>
    </div>
  );
};

export default Slide;