import { useEffect } from "react";
import { useNavigate } from "react-router";

const isAbortError = (value: unknown): boolean => {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    (value as { name?: unknown }).name === "AbortError"
  );
};

export const useGlobalErrorRedirect = (): void => {
  const navigate = useNavigate();

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (isAbortError(event.error)) {
        return;
      }
      console.error("Unhandled error:", event.error);
      navigate("/error");
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (isAbortError(event.reason)) {
        return;
      }
      console.error("Unhandled promise rejection:", event.reason);
      navigate("/error");
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [navigate]);
};

