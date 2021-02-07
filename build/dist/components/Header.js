import React from "../../_snowpack/pkg/react.js";
import {
  Box,
  Heading
} from "../../_snowpack/pkg/@chakra-ui/react.js";
const Header = ({boxProps, children, headingProps}) => /* @__PURE__ */ React.createElement(Box, {
  as: "header",
  w: "100%",
  bg: "gray.900",
  p: "6",
  ...boxProps
}, /* @__PURE__ */ React.createElement(Heading, {
  color: "whiteAlpha.800",
  textAlign: "center",
  as: "h1",
  ...headingProps
}, children));
export default Header;
