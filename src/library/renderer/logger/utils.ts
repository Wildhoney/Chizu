export function getColour(): string {
  return [...Array(6)].map(() => Math.floor(Math.random() * 14).toString(16)).join("");
}
