import { useMemo } from "react";

// Custom hook to get the current user from localStorage
export function useUser() {
  return useMemo(() => {
    try {
      // Try to parse the 'user' item stored as JSON in localStorage
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      // If parsing fails (e.g., corrupted or missing data), return null
      return null;
    }
  }, []); // Empty dependency array: only runs once on component mount
}
