import * as React from "react";
import { Accordion, AccordionProps } from "@chakra-ui/react";
import { useGameHelpSidebarContext } from "@contexts/GameHelpSidebarContext";

const HelpDetailsAccordion: React.FC<AccordionProps> = ({ children, ...props }) => {
  const { expanded } = useGameHelpSidebarContext();
  return <Accordion allowMultiple index={expanded} {...props}>{children}</Accordion>;
};

export default HelpDetailsAccordion;