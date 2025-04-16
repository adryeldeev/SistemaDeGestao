import styled from "styled-components";

export const ContentLogin = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #f3f4f6; /* Cor de fundo clara */
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentInfoLogin = styled.div`
  width: 400px;
  padding: 20px;
  background-color: #fff; /* Fundo branco */
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const TituloCadastro = styled.h2`
  text-align: center;
  color: #1e3a8a; /* Azul escuro */
  margin-bottom: 20px;
`;
export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espaçamento entre os elementos */
`;

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #f9fafb; /* Fundo claro para os inputs */
  border: 1px solid #d1d5db; /* Borda cinza clara */
  border-radius: 5px;
  padding: 10px;
  gap: 10px; /* Espaçamento entre o ícone e o input */

  .icon {
    color: #6b7280; /* Cor do ícone */
    font-size: 20px;
  }

  input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    color: #374151; /* Cor do texto */
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #1e3a8a; /* Azul escuro */
  color: #fff; /* Texto branco */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Sombra */

  &:hover {
    background-color: #1d4ed8; /* Azul mais claro no hover */
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.3); /* Sombra mais intensa no hover */
  }

  &:active {
    background-color: #1b3a70; /* Azul ainda mais escuro ao clicar */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* Sombra reduzida ao clicar */
  }
`;

export const Text = styled.p`
  color: #1e3a8a; /* Azul escuro */
  font-size: 14px;
  margin-top: 10px;
  text-align: center;

  a {
    color: #1d4ed8; /* Azul mais claro */
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;