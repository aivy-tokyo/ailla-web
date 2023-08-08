const createAudioQuery = async (text:string, speaker: string | number) => {
  const audioQueryResponse = await fetch(
    `${process.env.NEXT_PUBLIC_VOICEVOX_ENDPOINT}/audio_query?text=${text}&speaker=${speaker}`,
    {
      method: 'post',
      headers: {'Content-Type': 'application/json'}
    }
  );
  const audioQueryJson = await audioQueryResponse.json();
  console.log('audioQueryJson->',audioQueryJson);
  return audioQueryJson;
};

export const createAudio = async (text: string, speaker: string | number) => {
  const synthesisResponse = await fetch(
    `${process.env.NEXT_PUBLIC_VOICEVOX_ENDPOINT}/synthesis?speaker=${speaker}`,
    {
      method: 'post',
      body: JSON.stringify(await createAudioQuery(text, speaker)),
      // responseType: 'arrayBuffer',
      headers: {'accept': 'audio/wav', 'Content-Type': 'application/json'}
    }
  );

  return await synthesisResponse.arrayBuffer()
};