import { expect, it } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "../example/counter";

it("should increment and decrement the counter", async () => {
  render(<Counter />);

  expect(screen.getByText("1")).toBeTruthy();

  fireEvent.click(screen.getByText("Increment"));
  expect(await screen.findByText("2")).toBeTruthy();

  fireEvent.click(screen.getByText("Decrement"));
  expect(await screen.findByText("1")).toBeTruthy();

  fireEvent.click(screen.getByText("Reset"));
  expect(await screen.findByText("0")).toBeTruthy();

  fireEvent.click(screen.getByText("Decrement"));
  expect(await screen.findByText("-1")).toBeTruthy();
});
