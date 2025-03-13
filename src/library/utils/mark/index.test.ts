import { inspect, mark } from ".";
import { State } from "../../types";
import { describe, expect, it } from "@jest/globals";

describe("mark", () => {
  describe("inspect", () => {
    it("handles primitives", () => {
      const model = {
        name: "Adam",
        age: mark(25, State.Adding),
      };

      expect(inspect(model)).toEqual([
        {
          name: "Adam",
          age: 25,
        },
        new Set([
          {
            path: ".age",
            state: State.Adding,
          },
        ]),
      ]);
    });

    it("handles arrays", () => {
      const model = {
        name: "Adam",
        locations: [
          mark("New York", State.Adding),
          "Los Angeles",
          mark("San Francisco", State.Removing),
        ],
      };
      
      expect(inspect(model)).toEqual([
        {
          name: "Adam",
          locations: ["New York", "Los Angeles", "San Francisco"],
        },
        new Set([
          {
            path: ".locations[0]",
            state: State.Adding,
          },
          {
            path: ".locations[2]",
            state: State.Removing,
          },
        ])
      ])

    });

    it("handles objects", () => {
      const model = {
        name: "Adam",
        location: {
          city: mark("New York", State.Adding),
          state: "NY",
        },
      };

      expect(inspect(model)).toEqual([
        {
          name: "Adam",
          location: {
            city: "New York",
            state: "NY",
          },
        },
        new Set([
          {
            path: ".location.city",
            state: State.Adding,
          },
        ])
      ])
    });

    it("handles maps", () => {
      const model = {
        name: "Adam",
        location: new Map([
          ["city", mark("New York", State.Adding)],
          ["state", "NY"],
        ]),
      };
      
      expect(inspect(model)).toEqual([
        {
          name: "Adam",
          location: new Map([
            ["city", "New York"],
            ["state", "NY"],
          ]),
        },
        new Set([
          {
            path: ".location.city",
            state: State.Adding,
          },
        ])])


    });

    it("handles sets", () => {
      const model = {
        name: "Adam",
        locations: new Set([
          mark("New York", State.Adding),
          "Los Angeles",
          mark("San Francisco", State.Removing),
        ]),
      };

      
      expect(inspect(model)).toEqual([
        {
          name: "Adam",
          locations: new Set([
            "New York",
            "Los Angeles",
            "San Francisco",
          ]),
        },
        new Set([
          {
            path: ".locations[0]",
            state: State.Adding,
          },
          {
            path: ".locations[2]",
            state: State.Removing,
          },
        ])])

    });
  });
});
