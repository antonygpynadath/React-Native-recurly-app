# Recurly

Recurly is an Expo mobile app for tracking subscriptions in one place. It shows each subscription’s renewal date and cost, and helps you see monthly and yearly spend across everything you pay for.

Subscription data lives on-device (Zustand + AsyncStorage). Authentication uses [Clerk](https://clerk.com); product analytics use [PostHog](https://posthog.com).

<video src="./assets/video/Recurly.webm" controls width="360" title="Recurly demo">
  <a href="./assets/video/Recurly.webm">Watch the Recurly demo</a>
</video>

## Features

- **Authentication (Clerk)** — Email/password sign-in and sign-up with email verification, plus a forgot-password flow. Sessions are cached with SecureStore (`@clerk/expo/token-cache`). Signed-in and signed-out users are routed by auth and tab layouts.
- **Analytics (PostHog)** — Users are identified after Clerk login. Auth and subscription lifecycle events are tracked, with error autocapture enabled.
- **Local notifications** — Built with `expo-notifications` (not PostHog). Requests permission, sets up an Android channel, sends a confirmation when a subscription is added, and schedules day-before renewal reminders at 09:00 local time with deep links into the subscriptions screen.
- **Insights** — Monthly recurring spend, yearly projection, category breakdown, a 6-month renewal forecast, and top subscriptions by monthly equivalent cost.
- **Home & subscriptions** — Upcoming renewals, pending (past due) items, search, and filters so you can manage everything from a single list.
- **Theme** — Light and dark mode, persisted in SecureStore.
- **Code review (CodeRabbit)** — [CodeRabbit](https://www.coderabbit.ai) reviews pull requests before they merge to `main`.

## Stack

| Piece | Detail |
| --- | --- |
| Framework | Expo SDK ~54, React Native 0.81, React 19.1 |
| Routing | Expo Router |
| Styling | NativeWind (Tailwind) |
| State | Zustand |
| Auth | Clerk (`@clerk/expo`) |
| Analytics | PostHog (`posthog-react-native`) |
| Notifications | `expo-notifications` |
| Builds | EAS + `expo-dev-client` |
| Code review | CodeRabbit (PR checks before merge to `main`) |

## Requirements

| Tool | Version |
| --- | --- |
| Node.js | **≥ 20.19.4** (Expo SDK 54 minimum) |
| npm | Comes with Node (project uses `package-lock.json`) |
| Expo SDK | **~54.0** |

You will also need a [Clerk](https://clerk.com) publishable key and a [PostHog](https://posthog.com) project token and host. Missing PostHog env vars throw in development.

For local notifications and other native modules, use a **development build** (`expo-dev-client`) or a compatible Expo Go client for SDK 54.

## Setup

1. **Install Node.js** ≥ 20.19.4 if you do not already have it.

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Copy the example env file and fill in your keys:

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   | --- | --- |
   | `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
   | `POSTHOG_PROJECT_TOKEN` | PostHog project API key |
   | `POSTHOG_HOST` | PostHog host (e.g. `https://us.i.posthog.com`) |

4. **Start the app**

   ```bash
   npx expo start
   ```

   Or use `npm start`. From the Expo CLI you can open a development build, Android emulator, iOS simulator, or Expo Go.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` / `npx expo start` | Start the Expo dev server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
| `npm run web` | Start and open in the browser |
| `npm run lint` | Run ESLint |

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Clerk Expo](https://clerk.com/docs/expo/getting-started/quickstart)
- [PostHog React Native](https://posthog.com/docs/libraries/react-native)
- [CodeRabbit](https://www.coderabbit.ai)
