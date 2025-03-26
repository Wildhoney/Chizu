import styled from "@emotion/styled";

export const Container = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  place-content: center;
  place-items: center;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #ff3cac;
  background-image: linear-gradient(
    225deg,
    #ff3cac 0%,
    #784ba0 50%,
    #2b86c5 100%
  );
`;

export const Enclosure = styled.div`
  width: 100%;
  max-width: 30vw;
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  border-bottom: 3px solid #ddd;
  background-color: white;
  background-image: linear-gradient(
    to bottom,
    #ffffff 80%,
    rgb(245, 245, 245) 100%
  );
  padding: 10px;
  box-shadow:
    0 12px 24px rgba(51, 51, 51, 0.25),
    0 15px 28px rgba(255, 102, 102, 0.35);
`;
