import React from "react";
import { Box, Center, CloseButton, Text, useToast, useToken } from "@chakra-ui/react";
import { ChallengeIcon } from "@icons";
import { Actions, Influence } from "@contexts/GameStateContext/types";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import { ActionDetails } from "@utils/ActionUtils";
import Bold from "@components/Bold";

export interface IActionToastProps {
  variant: Actions | "Challenge";
  performerName?: string;
  victimName?: string;
  blockerName?: string;
  lostInfluence?: Influence;
}

const ActionToast: React.FC<IActionToastProps> = ({
  performerName,
  variant,
  victimName,
  lostInfluence,
  blockerName,
}) => {
  const { closeAll: closeAllToasts } = useToast();
  const iconSize = useToken("sizes", "40");
  const ActionIcon = variant === "Challenge" ? ChallengeIcon : ActionDetails[variant].icon;

  return (
    <Box
      bg="gray.600"
      maxW="sm"
      padding={5}
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
        {variant === Actions.Block && (
          <>
            <Bold>{blockerName}</Bold>
            {" successfully blocked "}
            <Bold>{performerName}</Bold>
          </>
        )}
        {variant === Actions.Coup && (
          <>
            <Bold>{performerName}</Bold>
            {" coup'd "}
            <Bold>{victimName}</Bold>
            {" who lost their "}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <Bold color={InfluenceDetails[lostInfluence!].color}>
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
        {variant === "Challenge" && (
          <>
            <Bold display="inline-block" marginTop="3">{victimName}</Bold>
            {" lost their "}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <Bold color={InfluenceDetails[lostInfluence!].color}>
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
