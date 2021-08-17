import React from "react";
import { Box, Center, CloseButton, Text, useBreakpointValue, useToast, useToken } from "@chakra-ui/react";
import ChallengeIcon from "@icons/ChallengeIcon";
import { Actions, CounterActions, Influence } from "@contexts/GameStateContext";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import { ActionDetails, getActionFromCounterAction } from "@utils/ActionUtils";
import Bold from "@components/Bold";
import { CounterActionDetails } from "@utils/CounterActionUtils";

type IActionToastVariant = Actions | CounterActions | "Challenge";

export interface IActionToastProps {
  variant: IActionToastVariant;
  performerName?: string;
  victimName?: string;
  blockerName?: string;
  lostInfluence?: Influence;
}

function getVariantIcon(variant: IActionToastVariant): React.FC<React.SVGProps<SVGSVGElement>> {
  switch(variant) {
    case Actions.Aid:
    case Actions.Assassinate:
    case Actions.Coup:
    case Actions.Exchange:
    case Actions.Income:
    case Actions.Steal:
    case Actions.Tax:
      return ActionDetails[variant].icon;
    case CounterActions.BlockAid:
    case CounterActions.BlockAssassination:
    case CounterActions.BlockSteal:
      return CounterActionDetails[variant].icon;
    case "Challenge":
      return ChallengeIcon;
  }
}

const getBlockedAction = (variant: IActionToastVariant): Actions | undefined => {
  switch(variant) {
    case CounterActions.BlockAid:
    case CounterActions.BlockAssassination:
    case CounterActions.BlockSteal:
      return getActionFromCounterAction(variant);
    default:
      return undefined;
  }
};

const ActionToast: React.FC<IActionToastProps> = ({
  performerName,
  variant,
  victimName,
  lostInfluence,
  blockerName,
}) => {
  const { closeAll: closeAllToasts } = useToast();

  const iconSizeBig = useToken("sizes", "40");
  const iconSizeSmall = useToken("sizes", "32");
  const iconSize = useBreakpointValue([iconSizeSmall, iconSizeBig]);

  const ActionIcon = getVariantIcon(variant);
  const blockedAction = getBlockedAction(variant);

  return (
    <Box
      bg="gray.600"
      maxW="sm"
      padding="5"
      rounded="md"
      boxShadow="2xl"
      role="alert"
      position="relative"
      overflow="hidden"
    >
      <CloseButton marginLeft="auto" onClick={() => closeAllToasts()} />
      <Center>
        <ActionIcon width={iconSize} />
      </Center>
      <Text fontSize="large">
        {variant === Actions.Income && (
          <>
            <Bold>{performerName}</Bold>
            {" took income which is only performed by mere peasants."}
          </>
        )}
        {variant === Actions.Tax && (
          <>
            <Bold>{performerName}</Bold>
            {" must have royalty in their blood as they have collected tax from the peasants."}
          </>
        )}
        {variant === Actions.Aid && (
          <>
            <Bold>{performerName}</Bold>
            {" has gotten away with foreign aid! A very generous group of Dukes indeed."}
          </>
        )}
        {blockedAction && (
          <>
            <Bold>{blockerName}</Bold>
            {" successfully blocked "}
            <Bold>{performerName}</Bold>
            {" from performing "}
            <Bold color={ActionDetails[blockedAction].color}>{blockedAction}</Bold>
            .
          </>
        )}
        {variant === Actions.Coup && lostInfluence && (
          <>
            <Bold>{performerName}</Bold>
            {" coup'd "}
            <Bold>{victimName}</Bold>
            {" who lost their "}
            <Bold color={InfluenceDetails[lostInfluence].color}>
              {lostInfluence}
            </Bold>
            !
          </>
        )}
        {variant === Actions.Steal && (
          <>
            <Bold>{performerName}</Bold>
            {" has stolen coin from "}
            <Bold>{victimName}</Bold>
            !
          </>
        )}
        {variant === Actions.Assassinate && (
          <>
            <Bold>{performerName}</Bold>
            {" has assassinated "}
            <Bold>{victimName}</Bold>
            {lostInfluence && (
              <>
                {" who lost their "}
                <Bold color={InfluenceDetails[lostInfluence].color}>
                  {lostInfluence}
                </Bold>
              </>
            )}
            !
          </>
        )}
        {variant === Actions.Exchange && (
          <>
            <Bold>{performerName}</Bold>
            {" exchanged their cards. No one likes double Contessas."}
          </>
        )}
        {variant === "Challenge" && lostInfluence && (
          <>
            <Bold display="inline-block" marginTop="3">{victimName}</Bold>
            {" lost their "}
            <Bold color={InfluenceDetails[lostInfluence].color}>
              {lostInfluence}
            </Bold>
            .
          </>
        )}
      </Text>
    </Box>
  );
};

const useActionToast = (): ((props: IActionToastProps) => string | number | undefined) => {
  const toast = useToast();
  return (props: IActionToastProps) =>
    toast({
      duration: 5000,
      position: "top",
      render: (): React.ReactNode => <ActionToast {...props} />,
    });
};

export default useActionToast;
