import { useToast, Button } from "@chakra-ui/react";
import * as React from "react";

function Toast() {
  const toast = useToast();
  return (
    <Button
      onClick={() => toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      })}
    >
      Show Toast
    </Button>
  );
}

export default Toast;
