import styled from "styled-components";

export const NavbarIten = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 20px;
  .FaUserGear {
    font-size: 20px;
  }
  .FaPowerOff {
    font-size: 20px;
  }
  .itens {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    .iten {
      padding-left: 40px;
    }
  }
`;

export const InfoBuscarServico = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 0;

  .Infocomunic {
    display: flex;
    align-items: center;
    text-align: center;

    h2 {
      padding-left: 20px;
    }
  }
`;

export const ContentBuscarServico= styled.div`
  width: 100%;
  height: 30vh;
  border: 1px solid #ccc;
`;

export const ContainerBuscarServico = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 50px 150px;
input{
padding: .28125rem 0;
line-height: 1.5;
outline:0;
border:0;
border-bottom:1px solid #ccc;
}
  button {
    display: flex;
    align-items: center; /* Ensure icon and text are aligned */
    margin-top: 15px;
    border: 0;
    outline: 0;
    padding: 8px 30px;
background-color: #03a9f4;
color:#fff;

    .faSearch {
      font-size: 12.5px;
      margin-right: 10px; /* Add space between icon and text */
    }
  }
`;

export const ButtonBuscarServico= styled.div`
  display: flex;
  padding: 10px;
`;

      
export const ContentResultServico = styled.div`
width:100%;

`

export const ContainerServicoInfo= styled.div`
width:100%;
display:flex;
flex-direction: column;
justify-content: center;
align-items:center;
text-align: center;
margin:0 auto;
button {
    display: flex;
    align-items: center; /* Ensure icon and text are aligned */
    margin-top: 15px;
    border: 0;
    outline: 0;
    padding: 8px 30px;
background-color: #f44336;
color:#fff;
font-size:12.5px;

    .riDeleteBin6Line{
      font-size: 12.5px;
      margin-right: 10px; /* Add space between icon and text */
    }
  }
`

export const ModalBackDropServico = styled.div`
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

export const ModalContainerServico = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 100%;
`;

export const ModalContentServico = styled.div`
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