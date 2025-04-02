import styled from "@emotion/styled";

export const Container = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  place-content: center;
  place-items: center;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #efefef;
`;

export const Enclosure = styled.div`
  width: 100%;
  max-width: 30vw;
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  border-bottom: 3px solid #ddd;
  background-color: white;
  padding: 10px 10px 0 10px;
  box-shadow:
    0 12px 24px rgba(51, 51, 51, 0.05),
    0 15px 28px rgba(25, 25, 25, 0.05);
`;
