import {
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button
} from "@chakra-ui/react";
import Bold from "@components/Bold";
import * as React from "react";
import type { FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const resetRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <AlertDialog isOpen={true} onClose={() => null} leastDestructiveRef={resetRef} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Looks like we ran into an issue 😔</AlertDialogHeader>
          <AlertDialogBody maxHeight="20rem" overflow="auto">
            <Bold>Error Log:</Bold>
            <Text as="pre" whiteSpace="normal">{error.message}</Text>
          </AlertDialogBody>
          <AlertDialogFooter gridGap="4">
            <Button ref={resetRef} onClick={() => resetErrorBoundary()}>Try Again</Button>
            <Button variant="outline" as={Link} to="/">Go Home</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ErrorFallback;