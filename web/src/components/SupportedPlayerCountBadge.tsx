import * as React from "react";
import { Box, BoxProps, Text, useToken } from "@chakra-ui/react";
import GroupIcon from "@icons/GroupIcon";

const SupportedPlayerCountBadge = (props: BoxProps): React.ReactElement => {
  const teal = useToken("colors", "teal.200");

  return (
    <Box {...props}>
      <Box
        display="flex"
        justifyContent="space-evenly"
        paddingX="3"
        paddingY="1"
        gridGap="3"
        color="teal.200"
        border="1px solid"
        borderColor="teal.200"
        borderRadius="md"
        backgroundColor={`${teal}10`}
      >
        <GroupIcon width="24px" />
        <Text>2 - 6 players</Text>
      </Box>
    </Box>
  );
};

export default SupportedPlayerCountBadge;