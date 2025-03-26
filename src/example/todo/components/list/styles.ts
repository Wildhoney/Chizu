import styled from "@emotion/styled";

export const Container = styled.ol`
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  padding: 20px 0 0 0;
  list-style-type: none;
  border-top: 1px solid lightgrey;
  margin-top: 10px;
  box-shadow: inset 0 10px 10px -10px rgba(0, 0, 0, 0.1);
`;

export const Row = styled.li`
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  padding: 5px 15px;
`;

export const Button = styled.button`
  background: none;
  border: 0;
  outline: none;
  cursor: pointer;
  color: black;
  font-size: 14px;
`;

export const Details = styled.div<{ pending: boolean }>`
  display: flex;
  place-items: center;
  display: flex;
  gap: 5px;
  font-style: ${({ pending }) => (pending ? "italic" : "normal")};
`;

export const Summary = styled.label<{ completed: boolean }>`
  cursor: pointer;
  transition: color 0.3s;
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  color: ${({ completed }) => (completed ? "grey" : "black")};
`;

export const Empty = styled.div`
  padding: 10px 20px 20px;
  font-size: 14px;
`;
