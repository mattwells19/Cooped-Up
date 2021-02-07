import {useEffect} from "../../_snowpack/pkg/react.js";
export default function useDocTitle(docTitle) {
  useEffect(() => {
    document.title = `Cooped Up | ${docTitle}`;
  }, []);
}
