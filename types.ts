export interface SlideContent {
  id: number;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  visualPrompt: string; // Description for the image
  layoutType: 'cover' | 'content-left' | 'content-right' | 'quote' | 'closing' | 'video';
  videoUrl?: string;
}

export interface PresentationData {
  companyName: string;
  theme: string;
  slides: SlideContent[];
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  READY = 'READY',
  ERROR = 'ERROR',
}