const app = require("./app.json");

module.exports = {
  ...app.expo,
  extra: {
    ...app.expo.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
    eas: {
      projectId: "a73ef329-9305-4eb3-b681-fb8bf8f24632",
    },
  },
};
