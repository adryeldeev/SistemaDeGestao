import styled from "styled-components";

export const NavbarItens = styled.div`
display:flex;
justify-content:space-between;
border-bottom:1px solid #ccc;
padding:20px;
.FaUserGear{
    font-size:20px;
}
.FaPowerOff{
    font-size:20px;
    
}
.itens{
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    .iten{
        padding-left:40px;
    }
}

`

export const InfoTitulo = styled.div`
display:flex;
flex-direction:column;
padding:50px 0;

.Infocomunic{
    display:flex;

    align-items:center;
    text-align:center;
 
    h2{
        padding-left:20px;
    }
}
`

export const ModalBackDro = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalCadastroContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 100%;
`;

export const ModalCadastroContent = styled.div`
  display: flex;
  flex-direction: column;

  form {
    display: flex;
    flex-direction: column;

    div {
      margin-bottom: 10px;

      label {
        display: block;
        margin-bottom: 5px;
      }

      input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
      }
    }

    button {
      margin-top: 10px;
      padding: 10px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:nth-child(2) {
        background: #6c757d;
      }
    }
  }
`