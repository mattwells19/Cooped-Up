import { Flex, FlexProps } from "@chakra-ui/react";
import * as React from "react";

type ICardSetProps = FlexProps; 

const CardSet: React.FC<ICardSetProps> = ({ children, ...props }) => {
  return (
    <Flex flexDirection="column" gridGap="1" {...props}>
      {children}
    </Flex>
  );
};

export default CardSet;