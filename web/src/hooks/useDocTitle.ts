import { useEffect } from "react";

export default function useDocTitle(docTitle: string): void {
  useEffect(() => {
    document.title = `${docTitle} | Cooped Up`;
  }, []);
}
