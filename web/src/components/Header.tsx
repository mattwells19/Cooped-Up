import React from "react";
import { Box, BoxProps, Heading, HeadingProps } from "@chakra-ui/react";

interface IHeaderProps {
  boxProps?: BoxProps;
  headingProps?: HeadingProps;
}

const Header: React.FC<IHeaderProps> = ({ boxProps, children, headingProps }) => (
  <Box as="header" w="100%" bg="gray.900" p="6" {...boxProps}>
    <Heading color="whiteAlpha.800" textAlign="center" as="h1" {...headingProps}>
      {children}
    </Heading>
  </Box>
);

export default Header;
