import * as React from "react";
import { AccordionButton, AccordionIcon, Box, Heading, useToken } from "@chakra-ui/react";
import { useGameHelpSidebarContext } from "@contexts/GameHelpSidebarContext";

const HelpDetailsAccordionHeader: React.FC<{ colorKey: string, index: number }> = ({ colorKey, index, children }) => {
  const color = useToken("colors", colorKey);
  const { registerAccordionItem, onToggle } = useGameHelpSidebarContext();

  React.useEffect(() => {
    registerAccordionItem(index);
  }, []);

  return (
    <Heading backgroundColor={`${color}22`} as="h3">
      <AccordionButton onClick={() => onToggle(index)} color={color}>
        <Box flex="1" fontWeight="bold" fontSize="xl" textAlign="left">
          {children}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </Heading>
  );
};

export default HelpDetailsAccordionHeader;