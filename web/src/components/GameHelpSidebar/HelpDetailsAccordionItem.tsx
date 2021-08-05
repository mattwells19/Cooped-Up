import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  ListItem,
  UnorderedList,
  Text,
  useToken,
  Accordion,
  AccordionProps,
} from "@chakra-ui/react";
import Bold from "@components/Bold";
import { useGameHelpSidebarContext } from "@contexts/GameHelpSidebarContext";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import * as React from "react";
import type { IActionHelpDetails } from "./helpDetails";

const HelpDetailsAccordion: React.FC<AccordionProps> = ({ children, ...props }) => {
  const { expanded } = useGameHelpSidebarContext();
  return <Accordion allowMultiple index={expanded} {...props}>{children}</Accordion>;
};

const HelpDetailsAccordionItem = AccordionItem;

const HelpDetailsAccordionHeader: React.FC<{ colorKey: string, index: number }> = ({ colorKey, index, children }) => {
  const color = useToken("colors", colorKey);
  const { registerAccordionItem, onToggle } = useGameHelpSidebarContext();

  React.useEffect(() => {
    registerAccordionItem(index);
  }, []);

  return (
    <Heading backgroundColor={`${color}22`} as="h2">
      <AccordionButton onClick={() => onToggle(index)} color={color}>
        <Box flex="1" fontWeight="bold" fontSize="xl" textAlign="left">
          {children}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </Heading>
  );
};

const HelpDetailsAccordionPanel: React.FC = ({ children }) => {
  return (
    <AccordionPanel>
      <UnorderedList fontSize="large">
        {children}
      </UnorderedList>
    </AccordionPanel>
  );
};

const HelpDetailsAccordionPanelAction: React.FC<{action: IActionHelpDetails}> = ({
  action: { name, description, blockedBy }
}) => {
  return (
    <ListItem paddingY={2}>
      {name}
      {description && (
        <UnorderedList color="gray.300" styleType="none" fontSize="md">
          <ListItem>{description}</ListItem>
          {blockedBy && (
            <ListItem paddingY={2}>
              <Text>This action can be blocked by:</Text>
              <UnorderedList styleType="none">
                {blockedBy.map((inf) => (
                  <ListItem key={inf}>
                    <Bold color={InfluenceDetails[inf].color} >
                      {inf}
                    </Bold>
                  </ListItem>
                ))}
              </UnorderedList>
            </ListItem>
          )}
        </UnorderedList>
      )}
    </ListItem>
  );
};

export {
  HelpDetailsAccordion,
  HelpDetailsAccordionItem,
  HelpDetailsAccordionHeader,
  HelpDetailsAccordionPanel,
  HelpDetailsAccordionPanelAction
};
