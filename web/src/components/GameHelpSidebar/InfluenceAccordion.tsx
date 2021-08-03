import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  ListItem,
  UnorderedList,
  Text,
  useToken
} from "@chakra-ui/react";
import Bold from "@components/Bold";
import type { Influence } from "@contexts/GameStateContext";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import * as React from "react";
import influenceDetails from "./influenceDetails";

interface IInfluenceAccordionProps {
  influence: Influence;
}

const InfluenceAccordion: React.FC<IInfluenceAccordionProps> = ({ influence }) => {
  const actions = influenceDetails.get(influence);
  if (!actions) throw new Error(`No details for ${influence}.`);
  const color = useToken("colors", InfluenceDetails[influence].color);
  
  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <Heading backgroundColor={`${color}22`} variant="h2">
          <AccordionButton color={color}>
            <Box flex="1" fontWeight="bold" fontSize="xl" textAlign="left">
              {influence}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel>
          {actions.map((action) => (
            <UnorderedList key={`${influence}-${action.name}`} fontSize="large">
              <ListItem paddingY={2}>
                {action.name}
                {action.description && (
                  <UnorderedList color="gray.300" styleType="none" fontSize="md">
                    <ListItem>{action.description}</ListItem>
                    {action.blockedBy && (
                      <Box paddingY={2}>
                        <Text>This action can be blocked by:</Text>
                        <UnorderedList styleType="none">
                          {action.blockedBy.map((inf) => (
                            <ListItem key={inf}>
                              <Bold color={InfluenceDetails[inf].color} >
                                {inf}
                              </Bold>
                            </ListItem>
                          ))}
                        </UnorderedList>
                      </Box>
                    )}
                  </UnorderedList>
                )}
              </ListItem>
            </UnorderedList>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default InfluenceAccordion;