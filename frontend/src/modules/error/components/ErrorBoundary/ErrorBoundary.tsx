import { Component, type ErrorInfo, type FC, type ReactNode } from "react";

import { useGlobalErrorRedirect } from "../../hooks";
import { ErrorPage } from "../../page/ErrorPage";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundaryBase extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Uncaught render error:", error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}

export const ErrorBoundary: FC<ErrorBoundaryProps> = ({ children }) => {
  useGlobalErrorRedirect();

  return <ErrorBoundaryBase>{children}</ErrorBoundaryBase>;
};

