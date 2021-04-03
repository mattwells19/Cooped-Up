import { useEffect } from "react";

export default function useDocTitle(docTitle: string) {
  useEffect(() => {
    document.title = `${docTitle} | Cooped Up`;
  }, []);
}
