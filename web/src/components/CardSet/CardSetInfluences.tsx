import { Flex, FlexProps } from "@chakra-ui/react";
import * as React from "react";

type ICardSetInfluencesProps = FlexProps; 

const CardSetInfluences: React.FC<ICardSetInfluencesProps> = ({ children, ...props }) => {
  return (
    <Flex gridGap={["4px", "10px"]} width="full" {...props}>
      {children}
    </Flex>
  );
};

export default CardSetInfluences;