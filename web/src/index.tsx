import React from "react";
import ReactDOM from "react-dom";
import Layout from "./Layout/Layout";
import "./index.css";

const App: React.FC = () => (
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);

ReactDOM.render(<App />, document.getElementById("root"));

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
