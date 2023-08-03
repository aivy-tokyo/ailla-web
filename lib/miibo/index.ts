import axios from "axios";

// パラメータ
// api_key	APIキー	String	必須
// agent_id	エージェントID	String	必須
// utterance	ユーザの発話	String	必須
// uid	ユーザ識別子	String
// state	ユーザーステート	Map
// stream	ストリームの利用	Bool
type Param = {
  api_key: string;
  agent_id: string;
  utterance: string;
  uid?: string;
  state?: any;
  stream?: boolean;
};

export const postMiibo = async ({
  uid,
  utterance,
  state,
}: {
  uid: string;
  utterance: string;
  state?: { [key: string]: string };
}) => {
  const response = await axios.post("https://api-mebo.dev/api", {
    api_key: "b6e1c1e0-2b7e-4b7e-8b0a-2b7e4b7e8b0a",
    agent_id: "mebo",
    utterance: utterance,
    uid: uid,
    state: state,
    stream: false,
  } as Param);
  return response.data;
};
