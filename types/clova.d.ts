declare module ClovaAPI {
  module Voice {
    interface RequestBody {
      speaker: string; // Voice type used for speech synthesis
      text: string; // Text to be synthesized, UTF-8 encoded, up to 2000 characters
      volume?: number; // Volume control, integer between -5 and 5
      speed?: number; // Speech speed, integer between -5 and 5
      pitch?: number; // Speech pitch, integer between -5 and 5
      emotion?: number; // Emotion in speech, integer between 0 and 3
      emotionStrength?: number; // Emotion strength, integer between 0 and 2
      format?: string; // Audio format, "mp3" or "wav"
      samplingRate?: number; // Sampling rate, applicable for "wav" format
      alpha?: number; // Voice tone, integer between -5 and 5
      endPitch?: number; // Ending sound treatment, integer between -5 and 5
    };
  }
}
