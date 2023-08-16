import { useCallback, useState } from "react";
import { Situation, situationCheckIn } from "../features/situations"
import axios from "axios";

const situationMap = {
  checkIn: situationCheckIn,
} as const;

export const useSituation = () => {
  const [situation, setSituation] = useState<Situation | null>();
  
  const getSituations = useCallback(() => {
    return Object.values(situationMap)
  }
  , []);

  const startSituation = useCallback((selectedSituation: Situation) => {
    setSituation(selectedSituation);

    axios.post("/api/chat/situation", {
      title: selectedSituation.title,
      description: selectedSituation.description,
      messages: [],
    });
  }, []);

  return {
    getSituations,
  }
}
