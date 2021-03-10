import React from "react";
import { Box, Center, Progress, Text, useToast, useToken } from "@chakra-ui/react";
import CoinIcon from "../icons/CoinIcon";

interface IActionToastProps {
  playerName: string;
}

const ActionToast: React.FC<IActionToastProps> = ({ playerName }) => {
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
      <Center><CoinIcon width={useToken("sizes", "40")} /></Center>
      <Text fontSize="large">
        <Text as="span" fontWeight="bold">{playerName}</Text>
        {` took income which is only performed by mere peasants.`}
      </Text>
    </Box>
  );
};

const useActionToast = () => {
  const toast = useToast();
  return (props: IActionToastProps) => toast({
    position: "top",
    duration: 5000,
    render: () => <ActionToast {...props} />,
  });
};

export default useActionToast;
