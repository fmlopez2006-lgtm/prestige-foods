import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, X, Send, Sparkles, Loader2, Phone, MessageCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import VoiceAssistant from './VoiceAssistant';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy su Consultor Senior de Prestige Foods. ¿En qué puedo asesorarle hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'Eres el Consultor Senior de Prestige Foods. Ayuda al usuario a vender pulpa de fruta colombiana premium. Sé profesional, cálido y utiliza un lenguaje ejecutivo colombiano.',
        }
      });

      const result = await chat.sendMessageStream({ message: userMessage });
      
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const chunkText = chunk.text || '';
        fullResponse += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = String(fullResponse);
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, he tenido un inconveniente técnico. ¿Podría intentarlo de nuevo?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans no-print">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-prestige-copper rounded-full shadow-lg hover:scale-110 transition-all"
        >
          <div className="absolute inset-0 rounded-full bg-prestige-copper animate-ping opacity-20"></div>
          <MessageSquare className="text-slate-950" size={28} />
        </button>
      )}

      {isOpen && (
        <div className="flex flex-col w-[350px] md:w-[380px] h-[500px] bg-slate-900 border border-prestige-copper/30 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-prestige-emerald to-slate-900 border-b border-prestige-copper/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-prestige-copper flex items-center justify-center">
                <Sparkles className="text-slate-900" size={16} />
              </div>
              <span className="font-serif font-bold text-white text-sm">Consultor Prestige</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMode(mode === 'chat' ? 'voice' : 'chat')}
                className="p-2 text-white/50 hover:text-prestige-copper transition-colors"
                title={mode === 'chat' ? 'Cambiar a Voz' : 'Cambiar a Chat'}
              >
                {mode === 'chat' ? <Phone size={18} /> : <MessageCircle size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>

          {mode === 'chat' ? (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-prestige-copper text-slate-950 font-bold' 
                        : 'bg-white/5 text-slate-100 border border-white/10'
                    }`}>
                      {typeof m.text === 'string' ? m.text : String(m.text)}
                      {isLoading && i === messages.length - 1 && !m.text && <Loader2 className="animate-spin text-prestige-copper" size={16} />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10 bg-slate-900">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escriba su consulta..."
                    className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-prestige-copper transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2 text-prestige-copper hover:text-white disabled:opacity-30 transition-all hover:scale-110"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950/50 space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-serif italic text-white">Asistente de Voz Live</h3>
                <p className="text-xs text-white/40 uppercase tracking-widest">Conexión en tiempo real</p>
              </div>
              <VoiceAssistant />
              <p className="text-[10px] text-white/30 text-center max-w-[200px]">
                Hable directamente con nuestro consultor para recibir asesoría estratégica instantánea.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;