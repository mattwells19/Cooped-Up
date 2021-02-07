import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import {ChakraProvider} from "../_snowpack/pkg/@chakra-ui/react.js";
import theme from "./utils/theme.js";
import Layout from "./Layout.js";
const App = () => /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(ChakraProvider, {
  theme
}, /* @__PURE__ */ React.createElement(Layout, null)));
ReactDOM.render(/* @__PURE__ */ React.createElement(App, null), document.getElementById("root"));
if (undefined /* [snowpack] import.meta.hot */ ) {
  undefined /* [snowpack] import.meta.hot */ .accept();
}
