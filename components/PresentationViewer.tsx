import React, { useState, useEffect, useCallback } from 'react';
import { SlideContent } from '../types';
import Slide from './Slide';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Printer,
  PlayCircle,
  PauseCircle,
  Undo2
} from 'lucide-react';

interface PresentationViewerProps {
  slides: SlideContent[];
  onReset: () => void;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({ slides, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  // Auto-play logic
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-0 md:p-8 font-sans overflow-hidden">
      
      {/* Toolbar - hidden during print */}
      <div className="no-print w-full max-w-6xl flex justify-between items-center mb-6 text-white px-4">
        <div className="flex items-center gap-6">
           <button 
            onClick={onReset}
            className="group text-xs font-bold tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2 uppercase"
          >
            <Undo2 size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Nuevo Proyecto</span>
          </button>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-prestige-gold">
            Estrategia Prestige v1.0
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
           <button 
            onClick={handlePrint}
            className="p-3 hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
            title="Guardar como PDF"
          >
            <Printer size={18} />
            <span className="hidden md:inline">PDF</span>
          </button>
           <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${isPlaying ? 'bg-prestige-gold text-slate-950' : 'hover:bg-white/10 text-white'}`}
            title={isPlaying ? "Pausar" : "Auto-reproducir"}
          >
            {isPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
            <span className="hidden md:inline">{isPlaying ? 'Pausa' : 'Play'}</span>
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-3 hover:bg-white/10 rounded-xl transition-all text-white"
            title="Pantalla Completa"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Main Slide Deck Area */}
      <div className="relative w-full max-w-6xl aspect-video bg-neutral-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden border border-white/5">
        {slides.map((slide, index) => (
          <Slide 
            key={slide.id} 
            data={slide} 
            isActive={index === currentIndex} 
          />
        ))}

        {/* Navigation Overlays - hidden during print */}
        <button 
          onClick={prevSlide}
          className="no-print absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center bg-gradient-to-r from-black/60 to-transparent opacity-0 hover:opacity-100 transition-all z-30 group"
        >
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-sm transform group-hover:scale-110 transition-transform">
            <ChevronLeft className="text-white" size={24} />
          </div>
        </button>

        <button 
          onClick={nextSlide}
          className="no-print absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-gradient-to-l from-black/60 to-transparent opacity-0 hover:opacity-100 transition-all z-30 group"
        >
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-sm transform group-hover:scale-110 transition-transform">
            <ChevronRight className="text-white" size={24} />
          </div>
        </button>
        
        {/* Slide Counter */}
        <div className="no-print absolute bottom-8 right-10 z-30 text-white/40 text-[10px] font-black tracking-[0.4em] bg-black/50 px-4 py-2 rounded-full backdrop-blur-xl border border-white/10">
          {String(currentIndex + 1).padStart(2, '0')} — {String(slides.length).padStart(2, '0')}
        </div>
      </div>

      {/* Thumbnails Navigation - hidden during print */}
      <div className="no-print mt-10 flex gap-3 overflow-x-auto w-full max-w-6xl py-4 justify-center items-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all duration-500 ease-out ${
              idx === currentIndex ? 'w-16 bg-prestige-gold' : 'w-4 bg-white/10 hover:bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Print-only version of slides (for PDF generation) */}
      <div className="hidden print:block fixed top-0 left-0 w-full h-full bg-white z-[9999]">
        {slides.map((slide) => (
          <div key={`print-${slide.id}`} className="slide-container relative w-[297mm] h-[210mm] overflow-hidden">
            <Slide data={slide} isActive={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresentationViewer;