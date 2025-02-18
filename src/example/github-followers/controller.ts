import { create } from "../../library/index.ts";
import { Events, Module } from "./types.ts";

const usernames = ["Wildhoney", "LinuxJS", "XiaomingX", "nholuongut", "san-ghun"];

type Profile = [string, { followers: number }];

export default create.controller<Module>((self) => {
  return {
    *[Events.Profile]() {
      const profile: Profile = yield self.actions.io<Profile>(async () => {
        const username = usernames[Math.floor(Math.random() * usernames.length)];

        // const response = await fetch(`https://api.github.com/users/${username}`).then(
        //   (response) => response.json(),
        // );

        const response: { followers: number } = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({ followers: 100 });
          }, 2_000);
        });

        return [username, { followers: response.followers }];
      }, ["–", { followers: 0 }]);

      return self.actions.produce((draft) => {
        draft.username = profile[0];
        draft.followers = profile[1].followers;
      });
    },
  };
});
