import { Flex, FlexProps, Text, TextProps } from "@chakra-ui/react";
import * as React from "react";

interface ICardSetHeaderProps {
  primaryText: string;
  secondaryText?: string;
  primaryTextProps?: Partial<TextProps>;
  secondaryTextProps?: Partial<TextProps>;
  textGroupFlexProps?: Partial<FlexProps>;
}

const CardSetHeader: React.FC<ICardSetHeaderProps> = ({
  primaryText,
  secondaryText,
  primaryTextProps,
  secondaryTextProps,
  textGroupFlexProps,
}) => {
  if (secondaryText) {
    return (
      <Flex justifyContent="space-between" width="full" fontSize={["md", "lg"]} {...textGroupFlexProps}>
        <Text {...primaryTextProps}>{primaryText}</Text>
        <Text color="gray.400" {...secondaryTextProps}>{secondaryText}</Text>
      </Flex>
    );
  } else {
    return (
      <Text fontSize="large" textAlign="center" {...primaryTextProps}>
        {primaryText}
      </Text>
    );
  }
};

export default CardSetHeader;