import styled from 'styled-components'

export const Button = styled.div`
display: flex;
justify-content: center;  // Centraliza os itens horizontalmente
align-items: center;      // Centraliza os itens verticalmente
text-align: center;
padding-top: 40px;

gap: 30px;                // Espaço entre os botões (ajuste conforme necessário)

h2 {
  font-size: 20px;
}

.botao {
  display: flex;
  align-items: center;
  text-align: center;
  border: 0;
  background: none;
  padding: 10px;
}
    @media (min-width:375px) and (max-width:575px) {
      width:80%;
      display:flex;
      justify-content:center;
      flex-direction:column;
   .buttonContainer{
   height: 23px;
    line-height: 23px;
   
   }
}
`