import { Text, TextProps } from "@chakra-ui/react";
import * as React from "react";

const Bold: React.FC<TextProps> = ({ children, ...props }) => (
  <Text as="span" fontWeight="bold" {...props}>{children}</Text>
);

export default Bold;