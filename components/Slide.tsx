import React from 'react';
import { SlideContent } from '../types';

interface SlideProps {
  data: SlideContent;
  isActive: boolean;
}

const Slide: React.FC<SlideProps> = ({ data, isActive }) => {
  // Use a deterministic image seed based on ID to ensure consistent images per slide
  const imageSeed = `prestige-${data.id}`; 
  const imageUrl = `https://picsum.photos/seed/${imageSeed}/1200/800`;

  const commonClasses = `absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out bg-white overflow-hidden ${
    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
  }`;

  // Layout: Cover
  if (data.layoutType === 'cover') {
    return (
      <div className={commonClasses}>
        <div className="absolute inset-0">
          <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover brightness-50" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-12 z-10 text-white">
          <div className="border-b-2 border-prestige-gold pb-6 mb-6">
            <h1 className="text-6xl font-serif font-bold tracking-wide mb-2">{data.title}</h1>
            <p className="text-2xl font-light text-prestige-gold">{data.subtitle}</p>
          </div>
          <p className="text-sm opacity-80 mt-12 uppercase tracking-widest">Prestige Foods Colombia</p>
        </div>
      </div>
    );
  }

  // Layout: Content Left (Image Right)
  if (data.layoutType === 'content-left') {
    return (
      <div className={`${commonClasses} flex`}>
        <div className="w-1/2 p-16 flex flex-col justify-center bg-prestige-cream text-prestige-green">
          <h2 className="text-4xl font-serif font-bold mb-6 text-prestige-green">{data.title}</h2>
          <h3 className="text-xl font-light mb-8 text-stone-600">{data.subtitle}</h3>
          <ul className="space-y-4">
            {data.bulletPoints.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-prestige-gold mr-3 text-xl">•</span>
                <span className="text-lg leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 h-full relative">
          <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover" />
           <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {data.visualPrompt}
          </div>
        </div>
      </div>
    );
  }

  // Layout: Content Right (Image Left)
  if (data.layoutType === 'content-right') {
    return (
      <div className={`${commonClasses} flex flex-row-reverse`}>
         <div className="w-1/2 p-16 flex flex-col justify-center bg-prestige-green text-white">
          <h2 className="text-4xl font-serif font-bold mb-6 text-prestige-gold">{data.title}</h2>
          <h3 className="text-xl font-light mb-8 opacity-90">{data.subtitle}</h3>
          <ul className="space-y-4">
            {data.bulletPoints.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-prestige-gold mr-3 text-xl">✓</span>
                <span className="text-lg leading-relaxed opacity-90">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 h-full relative">
          <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover" />
           <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {data.visualPrompt}
          </div>
        </div>
      </div>
    );
  }

  // Layout: Quote / Testimonial
  if (data.layoutType === 'quote') {
    return (
      <div className={commonClasses}>
        <div className="absolute inset-0">
           <img src={imageUrl} alt={data.visualPrompt} className="w-full h-full object-cover brightness-[0.25]" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center p-20 text-center z-10">
          <span className="text-8xl text-prestige-gold opacity-50 font-serif">“</span>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-white leading-tight mb-8">
            {data.title}
          </h2>
          <p className="text-xl text-stone-300 italic max-w-2xl">{data.subtitle}</p>
        </div>
      </div>
    );
  }

  // Layout: Video
  if (data.layoutType === 'video' && data.videoUrl) {
    return (
      <div className={`${commonClasses} bg-black flex items-center justify-center overflow-hidden`}>
        {/* Ambient background using blurred video */}
        <div className="absolute inset-0 z-0">
           <video 
             src={data.videoUrl} 
             className="w-full h-full object-cover blur-xl opacity-40 scale-110" 
             muted 
             loop 
             playsInline
             autoPlay
           />
        </div>
        
        {/* Main Video Player */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
           <div className="w-full max-w-5xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border border-white/10 relative">
             <video 
               src={data.videoUrl} 
               className="w-full h-full object-contain" 
               controls 
               playsInline
               // Auto-play only when active can be tricky in browsers due to audio policies, 
               // so we default to controls for reliability. 
             >
              Tu navegador no soporta el tag de video.
             </video>
           </div>
           
           <div className="mt-8 text-center">
              <h2 className="text-3xl font-serif text-white mb-2">{data.title}</h2>
              <p className="text-prestige-gold font-light tracking-wide">{data.subtitle}</p>
           </div>
        </div>
      </div>
    );
  }

  // Layout: Closing
  return (
    <div className={`${commonClasses} bg-prestige-green flex flex-col justify-center items-center text-center p-12`}>
      <div className="bg-white/5 p-16 rounded-lg backdrop-blur-sm border border-white/10 max-w-3xl w-full">
        <h2 className="text-5xl font-serif font-bold text-prestige-gold mb-8">{data.title}</h2>
        <p className="text-2xl text-white font-light mb-12">{data.subtitle}</p>
        
        <div className="flex flex-col gap-4 items-center">
            {data.bulletPoints.map((point, idx) => (
              <p key={idx} className="text-lg text-stone-300">{point}</p>
            ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/20">
          <p className="text-sm text-stone-400">www.prestigefoods.co</p>
        </div>
      </div>
    </div>
  );
};

export default Slide;