// InfoCadastrarServico.js
import styled from 'styled-components'

export const InfoCadastrarServico = styled.div`
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
`

export const DivServico = styled.div`
  width: 100%;
  @media (max-width: 576px) {
    padding: 20px;
  }
`

export const OptionsServico = styled.div`
  width: 100%;
 
`

export const ButtonAddServico = styled.button`
  border: 0;
  outline: 0;

  input {
    outline: 0;
    border: 0;
    border-bottom: 1px solid #ccc;
    padding: 10px;
  }

  .inputSearch {
    margin-left: 10px;
  }

 
`

export const TableCadastro = styled.div`
  width: 100%;
`

export const ModalBackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ModalContainerr = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 100%;
`

export const ModalContentt = styled.div`
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
