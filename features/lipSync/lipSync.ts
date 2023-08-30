import { LipSyncAnalyzeResult } from "./lipSyncAnalyzeResult";

const TIME_DOMAIN_DATA_LENGTH = 2048;

export class LipSync {
  public readonly audio: AudioContext;
  public readonly analyser: AnalyserNode;
  public readonly timeDomainData: Float32Array;
  
  private _bufferSource?: AudioBufferSourceNode; 

  public constructor(audio: AudioContext) {
    this.audio = audio;

    this.analyser = audio.createAnalyser();
    this.timeDomainData = new Float32Array(TIME_DOMAIN_DATA_LENGTH);
  }

  public update(): LipSyncAnalyzeResult {
    this.analyser.getFloatTimeDomainData(this.timeDomainData);

    let volume = 0.0;
    for (let i = 0; i < TIME_DOMAIN_DATA_LENGTH; i++) {
      volume = Math.max(volume, Math.abs(this.timeDomainData[i]));
    }

    // cook
    volume = 1 / (1 + Math.exp(-45 * volume + 5));
    if (volume < 0.1) volume = 0;

    return {
      volume,
    };
  }

  public async playFromArrayBuffer(buffer: ArrayBuffer, onEnded?: () => void) {
    const audioBuffer = await this.audio.decodeAudioData(buffer);

    this._bufferSource = this.audio.createBufferSource();
    this._bufferSource.buffer = audioBuffer;

    this._bufferSource.connect(this.audio.destination);
    this._bufferSource.connect(this.analyser);
    this._bufferSource.start();
    if (onEnded) {
      this._bufferSource.addEventListener("ended", onEnded);
    }
  }

  public stop() {
    if (!this._bufferSource)return;
    this._bufferSource.stop();
  }
}
