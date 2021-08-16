import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@utils/theme";
import Layout from "./Layout";
import { RoutingContextProvider } from "@contexts/RoutingContext";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => (
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <RoutingContextProvider>
          <Layout />
        </RoutingContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

ReactDOM.render(<App />, document.getElementById("root"));

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
