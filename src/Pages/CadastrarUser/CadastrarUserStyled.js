import styled from "styled-components";

export const ContentCadastro = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
`;
export const InfoCadastro = styled.div`
  display: flex;
  flex-direction: column;
  margin:0 auto;
  justify-content:center;
  align-items:center;
   max-width: 100%;
`;

export const ImgLogo = styled.img`
  width: 100px;
  height: 100px;

  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
  }

  @media (min-width: 1024px) {
    width: 150px;
    height: 150px;
  }
`;

export const TituloCadastro = styled.h2`
  text-align: center;
`;

export const FormCadastro = styled.form`
position:relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
   max-width: 100%;
  margin-top: 20px;

`

export const DivInput = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px; /* Tamanho máximo para o input */
  margin-bottom: 15px;

  svg {
    position: absolute;
    left: 10px;
    top: 40%;
    transform: translateY(-50%);
    color: #ccc;
    pointer-events: none; /* Garante que o clique não atinge o ícone */
  }
`;


