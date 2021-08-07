import { useToken } from "@chakra-ui/react";
import type { Actions, CounterActions, Influence } from "@contexts/GameStateContext";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import * as React from "react";
import { actionHelpDetails, IActionHelpDetails } from "./helpDetails";
import {
  HelpDetailsAccordionHeader,
  HelpDetailsAccordionItem,
  HelpDetailsAccordionPanel,
  HelpDetailsAccordionPanelAction
} from "./HelpDetailsAccordion";

interface IInfluenceAccordionItemProps {
  influence: Influence;
  index: number;
}

function getActionDetailsForInfluence(influence: Influence): Array<IActionHelpDetails> {
  return [InfluenceDetails[influence].action, InfluenceDetails[influence].counterAction]
    .filter((action): action is Actions | CounterActions => Boolean(action))
    .map((action) => actionHelpDetails[action]);
}

const InfluenceAccordionItem: React.FC<IInfluenceAccordionItemProps> = ({ influence, index }) => {
  const actions = getActionDetailsForInfluence(influence);
  if (!actions) throw new Error(`No details for ${influence}.`);
  const color = useToken("colors", InfluenceDetails[influence].color);
  
  return (
    <HelpDetailsAccordionItem>
      <HelpDetailsAccordionHeader index={index} colorKey={color}>
        {influence}
      </HelpDetailsAccordionHeader>
      <HelpDetailsAccordionPanel>
        {actions.map((action) => (
          <HelpDetailsAccordionPanelAction key={action.name} action={action} />
        ))}
      </HelpDetailsAccordionPanel>
    </HelpDetailsAccordionItem>
  );
};

export default InfluenceAccordionItem;