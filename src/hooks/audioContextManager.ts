export class AudioContextManager {
  private static instance: AudioContextManager;
  private context: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private analyzer: AnalyserNode | null = null;
  private connectedElement: HTMLAudioElement | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  setup(audioElement: HTMLAudioElement): AnalyserNode | null {
    try {
      // If already connected to this element and everything is set up, return existing analyzer
      if (this.connectedElement === audioElement && this.analyzer && this.isInitialized) {
        return this.analyzer;
      }

      // Clean up previous connections
      this.cleanup();

      // Create new context and nodes
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.source = this.context.createMediaElementSource(audioElement);
      this.analyzer = this.context.createAnalyser();
      this.analyzer.fftSize = 256;

      // Connect nodes
      this.source.connect(this.analyzer);
      this.analyzer.connect(this.context.destination);
      
      // Store reference to connected element
      this.connectedElement = audioElement;
      this.isInitialized = true;

      return this.analyzer;
    } catch (error) {
      console.error('Audio context setup failed:', error);
      this.cleanup();
      return null;
    }
  }

  private cleanup(): void {
    if (this.source) {
      try {
        this.source.disconnect();
      } catch (e) {
        console.warn('Error disconnecting source:', e);
      }
      this.source = null;
    }

    if (this.analyzer) {
      try {
        this.analyzer.disconnect();
      } catch (e) {
        console.warn('Error disconnecting analyzer:', e);
      }
      this.analyzer = null;
    }

    if (this.context?.state !== 'closed') {
      try {
        this.context?.close();
      } catch (e) {
        console.warn('Error closing context:', e);
      }
    }
    
    this.context = null;
    this.connectedElement = null;
    this.isInitialized = false;
  }

  getAnalyzer(): AnalyserNode | null {
    return this.analyzer;
  }

  reset(): void {
    this.cleanup();
  }
}