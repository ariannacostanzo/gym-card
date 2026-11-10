import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { saveJson } from "./storage";

/** useState che si legge da localStorage all'avvio e si salva a ogni modifica. */
export function useStoredState<T>(key: string, load: () => T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(load);
  useEffect(() => {
    saveJson(key, value);
  }, [key, value]);
  return [value, setValue];
}
