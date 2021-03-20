import React from "react";
import { Box, Center, Progress, Text, useToast, useToken } from "@chakra-ui/react";
import CoinIcon from "../icons/CoinIcon";
import AxeIcon from "../icons/AxeIcon";
import { Actions, Influence } from "../contexts/GameStateContext/types";

type IActionToastProps =
 | { variant: Actions.Coup, performerName: string, victimName: string, lostInfluence: Influence }
 | { variant: Actions.Income, performerName: string, victimName?: never, lostInfluence?: never }

const ActionToast: React.FC<IActionToastProps> = ({ performerName, variant, victimName, lostInfluence }) => {
  // starting at 5% makes the progress bar end closer towards the end
  const [timer, setTimer] = React.useState<number>(5);

  React.useEffect(() => {
    const timerInterval = setInterval(() => setTimer((prev) => prev + 1), 50);
    return () => {
      clearInterval(timerInterval);
    };
  }, []);

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
      <Progress colorScheme="green" size="sm" value={timer} position="absolute" top="0" left="0" right="0" />
      <Center>
        {variant === Actions.Income && <CoinIcon width={useToken("sizes", "40")} />}
        {/* I don't like the coup icon. definitely need to find something better */}
        {variant === Actions.Coup && <AxeIcon width={useToken("sizes", "40")} />}
      </Center>
      <Box fontSize="large">
        {variant === Actions.Income && (
          <Text>
            <Text as="span" fontWeight="bold">{performerName}</Text>
            &nbsp;took income which is only performed by mere peasants.
          </Text>
        )}
        {variant === Actions.Coup && (
          <>
            <Text>
              <Text as="span" fontWeight="bold">{performerName}</Text>
              &nbsp;coup&apos;d&nbsp;
              <Text as="span" fontWeight="bold">
                {victimName}
              </Text>
              !
            </Text>
            <Text marginTop="3">
              <Text as="span" fontWeight="bold">{victimName}</Text>
              &nbsp;lost their&nbsp;
              {lostInfluence}
              .
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
};

const useActionToast = () => {
  const toast = useToast();
  return (props: IActionToastProps) => {
    toast.closeAll();
    return toast({
      position: "top",
      duration: 5000,
      render: () => <ActionToast {...props} />,
    });
  };
};

export default useActionToast;
