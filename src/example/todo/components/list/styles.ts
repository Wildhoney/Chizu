import styled from "@emotion/styled";

export const Container = styled.ol`
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  padding: 20px 0 0 0;
  list-style-type: none;
  border-top: 1px solid #eaeaea;
  margin-top: 10px;
  padding-bottom: 20px;
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
  gap: 10px;
  flex: 1;
  font-style: ${({ pending }) => (pending ? "italic" : "normal")};
`;

export const Task = styled.label`
  cursor: pointer;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Name = styled.div<{ completed: boolean }>`
  transition: color 0.3s;
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  color: ${({ completed }) => (completed ? "grey" : "black")};
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: 14px;
`;

export const Date = styled.div`
  font-size: 11px;
  color: darkgrey;
  font-family: "Lato", sans-serif;
  font-weight: 300;
`;

export const Empty = styled.div`
  padding: 10px 20px 10px 10px;
  font-size: 14px;
`;
