import { describe, expect, it } from "@jest/globals";
import * as React from "react";
import { Store } from "../hooks/types";
import { reconcile } from "./utils";
import { State } from "../types";

import * as immer from "immer";
import { faker } from "@faker-js/faker";
import annotate from ".";

faker.seed(8_008);

const process = Symbol("process");

type Model = {
  country: string;
  countries: string[];
};

describe("reconcile()", () => {
  it("x", () => {
    const produceModel = React.createRef<Model>() as React.RefObject<Model>;
    const annotationStore = React.createRef<Store>() as React.RefObject<Store>;

    const a = {
      country: annotate(
        faker.location.country(),
        [State.Operation.Adding],
        process,
      ),
      countries: [
        faker.location.country(),
        annotate(faker.location.country(), [State.Operation.Adding], process),
        faker.location.country(),
      ],
    };

    const b = reconcile(a, produceModel, annotationStore);
    expect(b).toMatchSnapshot();
    expect(annotationStore.current).toMatchSnapshot();

    const c = immer.produce(b, (d) => {
      d.country = faker.location.country();
      d.countries[1] = annotate(
        faker.location.country(),
        [State.Operation.Updating],
        process,
      );
      d.countries.push(faker.location.country());
    });

    const d = reconcile(c, produceModel, annotationStore);
    expect(d).toMatchSnapshot();
    expect(annotationStore.current).toMatchSnapshot();
  });
});
