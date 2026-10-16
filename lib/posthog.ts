import Constants from "expo-constants";
import PostHog from "posthog-react-native";

type PostHogExtra = {
  posthogProjectToken?: string;
  posthogHost?: string;
};

const posthogExtra = Constants.expoConfig?.extra as PostHogExtra | undefined;
const projectToken = posthogExtra?.posthogProjectToken;
const host = posthogExtra?.posthogHost;

if (!projectToken) {
  if (__DEV__) {
    throw new Error(
      "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN is configured",
    );
  }
} else if (!host) {
  if (__DEV__) {
    throw new Error(
      "POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_HOST is configured",
    );
  }
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
          },
        },
        logs: {
          serviceName: "recurly-mobile",
        },
      })
    : undefined;

export const posthogLog = {
  info: (message: string, attributes?: Record<string, string | number | boolean>) =>
    posthog?.logger.info(message, attributes),
};
