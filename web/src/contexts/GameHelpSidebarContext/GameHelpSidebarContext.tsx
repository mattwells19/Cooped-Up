import * as React from "react";

interface IGameHelpSidebarContext {
  expanded: Array<number>;
  onToggle: (index: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  registerAccordionItem: (index: number) => void;
  canExpandAll: boolean;
  canCollapseAll: boolean;
}

const GameHelpSidebarContext = React.createContext<IGameHelpSidebarContext | null>(null);

const GameHelpSidebarContextProvider: React.FC = ({ children }) => {
  const [expanded, setExpanded] = React.useState<Array<number>>([]);
  const [accordionIndexes, setAccordionIndexes] = React.useState<Array<number>>([]);

  const onToggle = (index: number) => {
    setExpanded((prev) => {
      if (prev.includes(index)) {
        return prev.filter(expandedIndex => expandedIndex !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const expandAll = () => {
    setExpanded(accordionIndexes);
  };
  
  const collapseAll = () => {
    setExpanded([]);
  };

  const registerAccordionItem = (index: number) => {
    setAccordionIndexes((prev) => prev.includes(index) ? prev : [...prev, index]);
  };

  return (
    <GameHelpSidebarContext.Provider value={{
      get canCollapseAll() {
        return expanded.length > 0;
      },
      get canExpandAll() {
        return expanded.length < accordionIndexes.length;
      },
      collapseAll,
      expandAll,
      expanded,
      onToggle,
      registerAccordionItem
    }}>
      {children}
    </GameHelpSidebarContext.Provider>
  );
};

const useGameHelpSidebarContext = (): IGameHelpSidebarContext => {
  const context = React.useContext(GameHelpSidebarContext);
  if (!context) throw new Error("Tried to use GameHelpSidebarContext outside of a GameHelpSidebarContextProvider.");
  return context;
};

export { GameHelpSidebarContextProvider, useGameHelpSidebarContext };