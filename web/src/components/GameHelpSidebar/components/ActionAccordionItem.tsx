import * as React from "react";
import {
  useToken
} from "@chakra-ui/react";
import type { Actions } from "@contexts/GameStateContext";
import { actionHelpDetails } from "./helpDetails";
import { ActionDetails } from "@utils/ActionUtils";
import {
  HelpDetailsAccordionItem,
  HelpDetailsAccordionHeader,
  HelpDetailsAccordionPanel,
  HelpDetailsAccordionPanelAction
} from "./HelpDetailsAccordion";

interface IActionAccordionItemProps {
  action: Actions;
  index: number;
}

const ActionAccordionItem: React.FC<IActionAccordionItemProps> = ({ action, index }) => {
  const details = actionHelpDetails[action];
  const color = useToken("colors", ActionDetails[action].color);

  return (
    <HelpDetailsAccordionItem>
      <HelpDetailsAccordionHeader index={index} colorKey={color}>
        {details.name}
      </HelpDetailsAccordionHeader>
      <HelpDetailsAccordionPanel>
        <HelpDetailsAccordionPanelAction action={details} />
      </HelpDetailsAccordionPanel>
    </HelpDetailsAccordionItem>
  );
};

export default ActionAccordionItem;