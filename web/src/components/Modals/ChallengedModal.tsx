import * as React from "react";
import { Box, Center, Text, VStack, keyframes } from "@chakra-ui/react";
import type { Influence, IPlayer } from "@contexts/GameStateContext/types";
import { ChallengeIcon } from "@icons";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import BaseModal from "./BaseModal";

interface IChallengedModal {
  challengedInfluence: Influence;
  performer: IPlayer;
  challengeFailed: boolean;
  challenger: IPlayer;
  onDone: () => void;
}

const slideIn = keyframes({
  "0%": {
    transform: "translateY(100%)",
  },
  "90%": {
    transform: "translateY(-5%)",
  },
  // for some reason it thinks 100% should be before 90%
  // eslint-disable-next-line sort-keys
  "100%": {
    transform: "translateY(0%)",
  },
});

const CustomBox: React.FC = ({ children }) => (
  <Box
    animation={`${slideIn} 1s ease`}
    alignItems="center"
    backgroundColor="gray.700"
    filter="drop-shadow(0px 4px 1px #242830)"
    display="flex"
    justifyContent="center"
    width="100%"
    height="64px"
    borderRadius="2xl"
    paddingX="2"
  >
    {children}
  </Box>
);

const enum Stages {
  initial = 0,
  result,
}

const ChallengedModal: React.FC<IChallengedModal> = ({
  challengedInfluence,
  performer,
  challenger,
  challengeFailed,
  onDone,
}) => {
  const [stage, setStage] = React.useState<Stages>(Stages.initial);

  React.useEffect(() => {
    const timerInterval = setInterval(() => {
      if (stage === Stages.initial) setStage(Stages.result);
      else {
        setStage(Stages.initial);
        clearInterval(timerInterval);
        onDone();
      }
    }, 5000);
    return () => {
      clearInterval(timerInterval);
    };
  }, [stage]);

  return (
    <BaseModal>
      <Center backgroundColor="#4D2527" flexDirection="column" padding="2" rounded="md" overflow="hidden">
        <ChallengeIcon width="93px" height="93px" />
        <Text
          textTransform="uppercase"
          fontFamily="Nova Flat"
          fontSize={["4xl", "5xl"]}
          color="#E4E768"
          textAlign="center"
        >
          Challenge
        </Text>
        <VStack width="100%" spacing="2" height="138px" fontSize={[ "large", "larger"]}>
          {stage >= Stages.initial && (
            <CustomBox>
              <Text>
                <Text as="span" fontWeight="bold">
                  {challenger.name}
                </Text>
                {" has challenged that "}
                <Text as="span" fontWeight="bold">
                  {performer.name}
                </Text>
                {" has a(n) "}
                <Text
                  key={challengedInfluence}
                  as="span"
                  color={InfluenceDetails[challengedInfluence].color}
                  fontWeight="bold"
                >
                  {challengedInfluence}
                </Text>
                !
              </Text>
            </CustomBox>
          )}
          {stage >= Stages.result && (
            <CustomBox>
              <Text>
                {"The challenge has "}
                <Text
                  as="span"
                  color={challengeFailed ? "red.300" : "green.300"}
                  textTransform="uppercase"
                  fontWeight="bold"
                >
                  {challengeFailed ? "failed" : "succeeded"}
                </Text>
                !
              </Text>
            </CustomBox>
          )}
        </VStack>
      </Center>
    </BaseModal>
  );
};

export default ChallengedModal;
