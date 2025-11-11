import { describe, expect, it } from "@jest/globals";

import { faker } from "@faker-js/faker";
import { Models, annotate } from ".";
import { times } from "ramda";
import { State } from "../types";

describe("Models()", () => {
  const process = Symbol("process");

  it("reverses the order of the countries", () => {
    faker.seed(8_008);

    const models = new Models({
      countries: [
        // ...times(
        //   () => ({
        //     name: faker.airline.airport().name,
        //   }),
        //   1,
        // ),
        {
          name: annotate(
            faker.airline.airport().name,
            [State.Operation.Adding],
            process,
          ),
        },
      ],
    });

    console.log(JSON.stringify(models.shadow, null, 4));

    // models.produce((draft) => {
    //   draft.countries.reverse();
    // });

    // expect(models.model).toMatchSnapshot();
    // console.log(models.shadow);
    // expect(models.shadow).toMatchSnapshot();
  });
});
