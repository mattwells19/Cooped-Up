import * as React from "react";
import { ListItem, UnorderedList, Text } from "@chakra-ui/react";
import Bold from "@components/Bold";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import type { IActionHelpDetails } from "../helpDetails";

const HelpDetailsAccordionPanelAction: React.FC<{ action: IActionHelpDetails }> = ({
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

export default HelpDetailsAccordionPanelAction;