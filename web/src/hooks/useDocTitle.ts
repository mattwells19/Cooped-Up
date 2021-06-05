import { useEffect } from "react";

export default function useDocTitle(docTitle?: string): void {
  useEffect(() => {
    document.title = docTitle ? `${docTitle} | Cooped Up` : "Cooped Up";
  }, []);
}
