
import { useMemo } from "react";

export function useUser() {
  return useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);
}
