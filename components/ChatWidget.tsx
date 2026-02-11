
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy su Consultor Senior de Prestige Foods. ¿En qué puedo asesorarle hoy respecto a su estrategia de exportación o sobre nuestras frutas exóticas?' }
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'Eres el Consultor Senior de Exportaciones de Prestige Foods. Tu misión es ayudar al usuario a vender pulpa de fruta colombiana premium en el mundo. Eres sofisticado, experto en mercados internacionales y usas un lenguaje profesional con calidez colombiana. Si te preguntan por frutas, destaca el Lulo, la Gulupa y la Guanábana como joyas de exportación.',
        }
      });

      // We recreate the history for the chat instance
      // In a more complex app, we would keep the 'chat' instance in a ref
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const result = await chat.sendMessageStream({ message: userMessage });
      
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text;
        fullResponse += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, he tenido un inconveniente técnico. ¿Podría repetirme la consulta?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans no-print">
      {/* FAB Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-prestige-gold rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:scale-110 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-full bg-prestige-gold animate-ping opacity-20"></div>
          <MessageSquare className="text-slate-950 group-hover:rotate-12 transition-transform" size={28} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="animate-pulse w-1.5 h-1.5 bg-white rounded-full"></span>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="flex flex-col w-[380px] h-[550px] bg-slate-900/95 backdrop-blur-2xl border border-prestige-gold/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-prestige-green to-slate-900 border-b border-prestige-gold/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-prestige-gold flex items-center justify-center">
                <Sparkles className="text-slate-900" size={20} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-white leading-none">Consultor Prestige</h4>
                <p className="text-[10px] text-prestige-gold uppercase tracking-widest mt-1">Estrategia Global AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-prestige-gold/20 text-prestige-gold' : 'bg-prestige-green text-white'}`}>
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-prestige-gold text-slate-950 font-bold rounded-tr-none' 
                      : 'bg-white/5 text-slate-100 border border-white/10 rounded-tl-none'
                  }`}>
                    {m.text || (isLoading && i === messages.length - 1 ? <Loader2 className="animate-spin" size={16} /> : '')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregunte sobre su estrategia..."
                className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-prestige-gold transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 text-prestige-gold hover:text-white disabled:text-slate-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[9px] text-center mt-3 text-slate-500 uppercase tracking-widest">Powered by Gemini 3 Flash</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
