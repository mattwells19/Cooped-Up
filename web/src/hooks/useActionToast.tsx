import React from "react";
import { Box, Center, Progress, Text, useToast, useToken } from "@chakra-ui/react";
import CoinIcon from "../icons/CoinIcon";
import AxeIcon from "../icons/AxeIcon";
import { Actions } from "../contexts/GameStateContext/types";

interface IActionToastProps {
  performerName: string;
  victimName?: string;
  variant: Actions.Coup | Actions.Income;
}

const ActionToast: React.FC<IActionToastProps> = ({ performerName, variant, victimName }) => {
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
      <Text fontSize="large">
        {variant === Actions.Income && (
          <>
            <Text as="span" fontWeight="bold">{performerName}</Text>
            {` took income which is only performed by mere peasants.`}
          </>
        )}
        {variant === Actions.Coup && (
          <>
            <Text as="span" fontWeight="bold">{performerName}</Text>
            {` coup'd `}
            <Text as="span" fontWeight="bold">{victimName}</Text>
            !
          </>
        )}
      </Text>
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
