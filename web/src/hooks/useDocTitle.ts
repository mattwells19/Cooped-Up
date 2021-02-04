import { useEffect } from "react";

export default function useDocTitle(docTitle: string) {
  useEffect(() => {
    document.title = `Cooped Up | ${docTitle}`;
  }, []);
}
