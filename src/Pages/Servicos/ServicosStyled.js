import styled from 'styled-components'

export const DivServicos = styled.div`
width:100%;
`
export const InfoServico = styled.div`
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
export const OptionsServicos = styled.div`
with:100%;
`
export const ButtonServico = styled.button`
border:0;
outline:0;
`

export const TableServico =styled.div`
width:100%;
`

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px; 
  max-height: 80vh; 
  overflow-y: auto; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

export const ModalContent = styled.div`
  h2 {
    margin-top: 0;
  }

  .form-group {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 5px;
    }

    input,
    select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }
`;

export const ButtonCancel = styled.div`
display:block;
width: 100%;
max-width: 100%;
`