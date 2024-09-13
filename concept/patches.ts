import { enablePatches, produceWithPatches } from "immer";

enablePatches();

const model = {
  name: "Adam",
  friends: [
    {
      name: "John",
      age: 20,
    },
    {
      name: "Jenny",
      age: 25,
    },
    {
      name: "Lucas",
      age: 30,
    },
  ],
};

const [state, patches] = produceWithPatches(model, (draft) => {
  //   draft.name = "Maria"
  //   draft.friends[1].name = "Peter";
  //   delete draft.friends[2];
  draft.friends[0].age = 22;
  draft.friends.sort((a, b) => a.name.localeCompare(b.name));
  draft.friends.push({ name: "Sarah", age: 35 });
});

console.log(JSON.stringify(patches, null, 4));
