import { wait } from "@/utils/wait";
import { synthesizeVoice } from "../koeiromap/koeiromap";
import { Viewer } from "../vrmViewer/viewer";
import { Screenplay } from "./messages";
import { Talk } from "./messages";
import axios from 'axios';
import { TextToSpeechApiType } from "@/utils/types";


const createSpeakCharacter =  () => {
  let lastTime = 0;
  let prevFetchPromise: Promise<unknown> = Promise.resolve();
  let prevSpeakPromise: Promise<unknown> = Promise.resolve();

  return (
    screenplay: Screenplay,
    viewer: Viewer,
    textToSpeechApiType: TextToSpeechApiType,
    onStart?: () => void,
    onComplete?: () => void,
  ): Promise<void> => {  // <-- Return a Promise
    return new Promise((resolve, reject) => {  // <-- Create a new Promise
      const fetchPromise = prevFetchPromise.then(async () => {
        const now = Date.now();
        if (now - lastTime < 1000) {
          await wait(1000 - (now - lastTime));
        }

        if(screenplay.talk.message === "")resolve();
        const buffer = await fetchAudio(screenplay.talk, textToSpeechApiType).catch(() => null);
        lastTime = Date.now();
        return buffer;
      });

      prevFetchPromise = fetchPromise;
      prevSpeakPromise = Promise.all([fetchPromise, prevSpeakPromise]).then(([audioBuffer]) => {
        onStart?.();
        if (!audioBuffer) {
          return;
        }
        return viewer.model?.speak(audioBuffer, screenplay);
      });
      prevSpeakPromise.then(() => {
        onComplete?.();
        resolve();  // <-- Resolve the Promise when finished
      }).catch(reject);  // <-- Reject the Promise if there's an error
    });
  };
}

export const speakEnglishCharacter = createSpeakCharacter();

export const fetchAudio = async (talk: Talk, textToSpeechApiType: TextToSpeechApiType): Promise<ArrayBuffer | undefined> => {
  if(textToSpeechApiType === 'googleTextToSpeech'){
    try {
      const response = await axios.post('/api/synthesize', { text: talk.message }, {
        headers: { 'Content-Type': 'application/json' },
        responseType: "arraybuffer",
      });
      
      return response.data;
    } catch (error) {
      console.error('Synthesis failed', error);
    }
  }else if(textToSpeechApiType === 'clovaVoice'){
    try{
      const response = await axios.post('api/clovaVoice',
        {
        // speaker: 'dara-danna',
        speaker: 'dsinu-matt',
        text: talk.message,
        format: 'mp3',
        },
        {
          headers: {'Content-Type': 'application/json'},
          responseType: "arraybuffer"
        }
      )
      return response.data;
    }catch(error) {
      console.error('clovaVoice Failed:',error);
    }
  }
};

