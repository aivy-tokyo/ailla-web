import { createContext } from 'react';

interface FirstGreetingContextType {
  firstGreetingDone: boolean;
  setFirstGreetingDone: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FirstGreetingContext = createContext<FirstGreetingContextType>({
  firstGreetingDone: false,
  setFirstGreetingDone: () => { },
});
