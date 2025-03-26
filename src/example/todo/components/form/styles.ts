import styled from "@emotion/styled";

export const Container = styled.section`
  display: flex;
  flex: 1;
  border-radius: 10px;
`;

export const Input = styled.input`
  padding: 0;
  margin: 0;
  flex: 1;
  padding: 20px 15px;
  outline: none;
  border: 0;

  &::placeholder {
    color: #cccccc;
  }
`;

export const Button = styled.button`
  padding: 0;
  margin: 0;
  padding: 20px;
  background: black;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  border: 0;
  outline: none;
  cursor: pointer;
  display: flex;
  place-content: center;
  place-items: center;
  gap: 8px;
  transition: background 0.3s;

  &:disabled {
    cursor: not-allowed;
    background: #cccccc;
  }
`;
