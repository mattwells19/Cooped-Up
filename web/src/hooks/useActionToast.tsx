import React from "react";
import { Box, Center, CloseButton, Text, useToast, useToken } from "@chakra-ui/react";
import { AxeIcon, ChallengeIcon, CoinIcon } from "@icons";
import { Actions, Influence } from "@contexts/GameStateContext/types";
import { InfluenceDetails } from "@utils/InfluenceUtils";

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
        {variant === Actions.Income && <CoinIcon width={iconSize} />}
        {/* TODO: Needs Graphic */}
        {variant === Actions.Coup && <AxeIcon width={iconSize} />}
        {/* TODO: Needs Graphic */}
        {variant === Actions.Tax && <CoinIcon width={iconSize} />}
        {/* TODO: Needs Graphic */}
        {variant === Actions.Aid && <CoinIcon width={iconSize} />}
        {/* TODO: Needs Graphic */}
        {variant === "Challenge" && <ChallengeIcon width={iconSize} />}
        {/* TODO: Needs Graphic */}
        {variant === Actions.Block && <CoinIcon width={iconSize} />}
        {/* TODO: Needs Graphic */}
        {variant === Actions.Steal && <CoinIcon width={iconSize} />}
      </Center>
      <Box fontSize="large">
        {variant === Actions.Income && (
          <Text>
            <Text as="span" fontWeight="bold">
              {performerName}
            </Text>
            {" took income which is only performed by mere peasants."}
          </Text>
        )}
        {variant === Actions.Tax && (
          <Text>
            <Text as="span" fontWeight="bold">
              {performerName}
            </Text>
            {" must have royalty in their blood as they have collected tax from the peasants."}
          </Text>
        )}
        {variant === Actions.Aid && (
          <Text>
            <Text as="span" fontWeight="bold">
              {performerName}
            </Text>
            {" has gotten away with foreign aid! A very generous group of Dukes indeed."}
          </Text>
        )}
        {variant === Actions.Block && (
          <Text>
            <Text as="span" fontWeight="bold">
              {blockerName}
            </Text>
            {" successfully blocked "}
            <Text as="span" fontWeight="bold">
              {performerName}
            </Text>
          </Text>
        )}
        {variant === Actions.Coup && (
          <>
            <Text>
              <Text as="span" fontWeight="bold">
                {performerName}
              </Text>
              {" coup'd "}
              <Text as="span" fontWeight="bold">
                {victimName}
              </Text>
              !
            </Text>
            <Text marginTop="3">
              <Text as="span" fontWeight="bold">
                {victimName}
              </Text>
              {" lost their "}
              {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
              <Text as="span" fontWeight="bold" color={InfluenceDetails[lostInfluence!].color}>
                {lostInfluence}
              </Text>
              .
            </Text>
          </>
        )}
        {variant === Actions.Steal && (
          <Text>
            <Text as="span" fontWeight="bold">
              {performerName}
            </Text>
            {" has stolen coin from "}
            <Text as="span" fontWeight="bold">
              {victimName}
            </Text>
            !
          </Text>
        )}
        {variant === "Challenge" && (
          <Text marginTop="3">
            <Text as="span" fontWeight="bold">
              {victimName}
            </Text>
            {" lost their "}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <Text as="span" fontWeight="bold" color={InfluenceDetails[lostInfluence!].color}>
              {lostInfluence}
            </Text>
            .
          </Text>
        )}
      </Box>
    </Box>
  );
};

const useActionToast = (): ((props: IActionToastProps) => string | number | undefined) => {
  const toast = useToast();
  return (props: IActionToastProps) =>
    toast({
      position: "top",
      duration: 5000,
      render: (): React.ReactNode => <ActionToast {...props} />,
    });
};

export default useActionToast;
