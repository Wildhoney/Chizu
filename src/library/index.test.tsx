import { expect, it } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "../example/counter";

it("should increment and decrement the counter", async () => {
  render(<Counter />);

  expect(screen.getByLabelText("1")).toBeTruthy();

  fireEvent.click(screen.getByText("+"));
  expect(await screen.findByLabelText("2")).toBeTruthy();

  fireEvent.click(screen.getByText("−"));
  expect(await screen.findByLabelText("1")).toBeTruthy();

  fireEvent.click(screen.getByText("−"));
  expect(await screen.findByLabelText("0")).toBeTruthy();

  fireEvent.click(screen.getByText("−"));
  expect(await screen.findByLabelText("-1")).toBeTruthy();
});
