import { Maybe, create } from "../../library/index.ts";
import { Events, Module } from "./types.ts";

const usernames = ["Wildhoney", "LinuxJS", "XiaomingX", "nholuongut", "san-ghun"];

type Profile = { username: string; followers: number };

async function fetch(): Promise<Profile> {
  const username = usernames[Math.floor(Math.random() * usernames.length)];

  const response: { followers: number } = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ followers: Math.round(100 * Math.random()) });
    }, 2_000);
  });

  return { username, followers: response.followers };
}

export default create.controller<Module>((self) => {
  return {
    *[Events.Profile]() {
      const profile: Maybe<Profile> = yield self.actions.io(fetch);

      const { username, followers } = profile.otherwise({ username: "Unknown", followers: 0 });

      return self.actions.produce((draft) => {
        draft.username = username;
        draft.followers = followers;
      });
    },
  };
});
