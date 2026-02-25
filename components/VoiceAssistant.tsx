import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Mic, MicOff, Phone, PhoneOff, Loader2, Volume2, VolumeX } from 'lucide-react';

const VoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlaying = useRef(false);

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
    audioQueue.current = [];
    isPlaying.current = false;
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "Eres el Consultor Senior de Prestige Foods. Ayuda al usuario a vender pulpa de fruta colombiana premium. Sé profesional, cálido y utiliza un lenguaje ejecutivo colombiano. Responde de forma concisa y elegante.",
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            source.connect(processorRef.current!);
            processorRef.current!.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.inlineData?.data) {
                  const base64Audio = part.inlineData.data;
                  const binaryString = atob(base64Audio);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  const int16Data = new Int16Array(bytes.buffer);
                  audioQueue.current.push(int16Data);
                  playNextInQueue();
                }
              }
            }
            
            if (message.serverContent?.interrupted) {
              audioQueue.current = [];
              isPlaying.current = false;
            }

            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
                // Handle transcription if needed
            }
          },
          onclose: () => stopSession(),
          onerror: (err) => {
            console.error("Live API Error:", err);
            stopSession();
          }
        }
      });

      sessionRef.current = session;

      processorRef.current.onaudioprocess = (e) => {
        if (isMuted) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        session.sendRealtimeInput({
          media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };

    } catch (err) {
      console.error("Failed to start session:", err);
      stopSession();
    }
  };

  const playNextInQueue = async () => {
    if (isPlaying.current || audioQueue.current.length === 0 || !audioContextRef.current) return;
    
    isPlaying.current = true;
    const pcmData = audioQueue.current.shift()!;
    
    const audioBuffer = audioContextRef.current.createBuffer(1, pcmData.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < pcmData.length; i++) {
      channelData[i] = pcmData[i] / 0x7FFF;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      isPlaying.current = false;
      playNextInQueue();
    };
    source.start();
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {isActive && (
          <div className="absolute -inset-4 bg-prestige-copper/20 rounded-full animate-pulse"></div>
        )}
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full transition-all shadow-2xl ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-prestige-copper hover:bg-prestige-copper/80 text-prestige-dark'
          }`}
        >
          {isConnecting ? (
            <Loader2 className="animate-spin" size={32} />
          ) : isActive ? (
            <PhoneOff size={32} />
          ) : (
            <Phone size={32} />
          )}
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-prestige-copper">
          {isActive ? 'Llamada en curso' : isConnecting ? 'Conectando...' : 'Asistente de Voz'}
        </span>
        
        {isActive && (
          <button 
            onClick={toggleMute}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
