import * as React from "react";
import { AccordionPanel, UnorderedList } from "@chakra-ui/react";

const HelpDetailsAccordionPanel: React.FC = ({ children }) => {
  return (
    <AccordionPanel>
      <UnorderedList fontSize="large">
        {children}
      </UnorderedList>
    </AccordionPanel>
  );
};

export default HelpDetailsAccordionPanel;