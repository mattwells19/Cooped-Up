import { Drawer, DrawerBody, DrawerContent, Button, HStack, ButtonGroup, CloseButton, Divider } from "@chakra-ui/react";
import InfluenceAccordionItem from "./InfluenceAccordionItem";
import * as React from "react";
import ActionAccordionItem from "./ActionAccordionItem";
import { Actions } from "@contexts/GameStateContext";
import { HelpDetailsAccordion } from "./HelpDetailsAccordionItem";
import { GameHelpSidebarContextProvider, useGameHelpSidebarContext } from "@contexts/GameHelpSidebarContext";

interface IGameHelpSidebarProps {
  open: boolean;
  onClose: () => void;
}

const GameHelpSidebar: React.FC<IGameHelpSidebarProps> = (props) => (
  <GameHelpSidebarContextProvider>
    <GameHelpSidebarContent {...props} />
  </GameHelpSidebarContextProvider>
);

const GameHelpSidebarContent: React.FC<IGameHelpSidebarProps> = ({ open, onClose }) => {
  const { canCollapseAll, canExpandAll, expandAll, collapseAll } = useGameHelpSidebarContext();

  return (
    <Drawer isOpen={open} onClose={onClose} size="sm">
      <DrawerContent>
        <HStack paddingTop="2" paddingX="2" height="12" alignItems="center" justifyContent="space-between">
          <ButtonGroup size="sm" variant="ghost" spacing={2}>
            <Button disabled={!canExpandAll} onClick={() => expandAll()}>Expand All</Button>
            <Button disabled={!canCollapseAll} onClick={() => collapseAll()}>Collapse All</Button>
          </ButtonGroup>
          <CloseButton onClick={onClose}  />
        </HStack>
        <DrawerBody paddingX={0}>
          <HelpDetailsAccordion>
            <InfluenceAccordionItem index={0} influence="Ambassador" />
            <InfluenceAccordionItem index={1} influence="Assassin" />
            <InfluenceAccordionItem index={2} influence="Captain" />
            <InfluenceAccordionItem index={3} influence="Contessa" />
            <InfluenceAccordionItem index={4} influence="Duke" />
            <Divider marginY="4" />
            <ActionAccordionItem index={5} action={Actions.Coup} />
            <ActionAccordionItem index={6} action={Actions.Aid} />
            <ActionAccordionItem index={7} action={Actions.Income} />
          </HelpDetailsAccordion>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default GameHelpSidebar;