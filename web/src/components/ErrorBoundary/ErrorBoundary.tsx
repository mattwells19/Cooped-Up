import * as React from "react";
import { ErrorBoundary as ErrorBoundaryComponent } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

const ErrorBoundary: React.FC = ({ children }) => {
  return (
    <ErrorBoundaryComponent FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundaryComponent>
  );
};

export default ErrorBoundary;