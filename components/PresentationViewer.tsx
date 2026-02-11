import React, { useState, useEffect } from 'react';
import { SlideContent } from '../types';
import Slide from './Slide';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Download,
  PlayCircle
} from 'lucide-react';

interface PresentationViewerProps {
  slides: SlideContent[];
  onReset: () => void;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({ slides, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play logic
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleDownload = () => {
    alert("Descargando PDF de alta resolución... (Simulación)");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 md:p-8">
      
      {/* Toolbar */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4 text-white">
        <div>
           <button 
            onClick={onReset}
            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Volver al Editor
          </button>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={handleDownload}
            className="p-2 hover:bg-white/10 rounded-full transition-colors tooltip"
            title="Descargar PDF"
          >
            <Download size={20} />
          </button>
           <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-full transition-colors ${isPlaying ? 'text-prestige-gold bg-white/10' : 'hover:bg-white/10'}`}
            title={isPlaying ? "Pausar" : "Reproducir Automáticamente"}
          >
            <PlayCircle size={20} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* Main Slide Deck Area */}
      <div className="relative w-full max-w-6xl aspect-video bg-black shadow-2xl rounded-sm overflow-hidden border border-slate-700">
        {slides.map((slide, index) => (
          <Slide 
            key={slide.id} 
            data={slide} 
            isActive={index === currentIndex} 
          />
        ))}

        {/* Navigation Overlays */}
        <button 
          onClick={prevSlide}
          className="absolute left-0 top-0 bottom-0 w-24 flex items-center justify-center bg-gradient-to-r from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity z-20 group"
        >
          <ChevronLeft className="text-white group-hover:scale-125 transition-transform" size={48} />
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center bg-gradient-to-l from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity z-20 group"
        >
          <ChevronRight className="text-white group-hover:scale-125 transition-transform" size={48} />
        </button>
        
        {/* Slide Counter */}
        <div className="absolute bottom-6 right-8 z-20 text-white/50 text-sm font-mono tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
          {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      </div>

      {/* Thumbnails / Progress */}
      <div className="mt-8 flex gap-2 overflow-x-auto w-full max-w-6xl pb-4 justify-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-12 bg-prestige-gold' : 'w-8 bg-slate-700 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PresentationViewer;