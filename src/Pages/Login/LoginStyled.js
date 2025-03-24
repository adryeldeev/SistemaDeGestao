import styled from "styled-components";

export const ContentLogin = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ccc;
`;

export const InfoContentLogin = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 20px;

  @media (min-width: 768px) {
    height: 70%;
  }

  @media (min-width: 1024px) {
    height: 80%;
  }
`;



export const TitleLogin = styled.h1`
  font-size: 20px;
  color: #333;

  @media (min-width: 768px) {
    font-size: 25px;
  }

  @media (min-width: 1024px) {
    font-size: 30px;
  }
`;

export const FormLogin = styled.form`
  max-width: 100%;
  height: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (min-width: 768px) {
    height: 50%;
  }
`;

export const DivInputsLogin = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  padding: 5px;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: #666;
`;

export const InputLogin = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 10px;
  font-size: 16px;
  background: transparent;

  &::placeholder {
    color: #aaa;
  }
`;

export const ButtonLogin = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 10px 20px;
  background-color: yellow;
  border: 1px solid #ccc;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  transition: background 0.3s;

  &:hover {
    background-color: #ffcc00;
  }
`;

export const LinkPassword = styled.a`
  margin-top: 20px;
  text-decoration: none;
  cursor: pointer;
`;

export const DivLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  max-width: 100%;
`;
