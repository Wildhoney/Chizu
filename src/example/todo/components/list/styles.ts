import { css } from "@emotion/css";

export const container = css`
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  padding: 20px 0 0 0;
  list-style-type: none;
  border-top: 1px solid #eaeaea;
  margin-top: 10px;
  padding-bottom: 20px;
`;

export const row = css`
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  padding: 5px 15px;
  gap: 10px;
`;

export const button = css`
  background: none;
  border: 0;
  outline: none;
  cursor: pointer;
  color: black;
  font-size: 14px;
`;

export const details = (pending: boolean) => css`
  display: flex;
  place-items: center;
  display: flex;
  gap: 10px;
  flex: 1;
  font-style: ${pending ? "italic" : "normal"};
`;

export const task = css`
  cursor: pointer;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const name = (completed: boolean) => css`
  transition: color 0.3s;
  text-decoration: ${completed ? "line-through" : "none"};
  color: ${completed ? "grey" : "black"};
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 14px;
`;

export const date = css`
  font-size: 11px;
  color: darkgrey;
  font-family: "Lato", sans-serif;
  font-weight: 300;
`;

export const empty = css`
  padding: 10px 20px 10px 10px;
  font-size: 14px;
`;
