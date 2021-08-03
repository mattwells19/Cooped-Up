import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent } from "@chakra-ui/react";
import InfluenceAccordion from "./InfluenceAccordion";
import * as React from "react";

interface IGameHelpSidebarProps {
  open: boolean;
  onClose: () => void;
}

const GameHelpSidebar: React.FC<IGameHelpSidebarProps> = ({ open, onClose }) => {
  return (
    <Drawer isOpen={open} onClose={onClose} size="sm">
      
      <DrawerContent>
        <DrawerCloseButton onClick={onClose} position="relative" display="flex" marginLeft="auto" marginBottom={2} />
        <DrawerBody paddingX={0}>
          <InfluenceAccordion influence="Ambassador" />
          <InfluenceAccordion influence="Assassin" />
          <InfluenceAccordion influence="Captain" />
          <InfluenceAccordion influence="Contessa" />
          <InfluenceAccordion influence="Duke" />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default GameHelpSidebar;