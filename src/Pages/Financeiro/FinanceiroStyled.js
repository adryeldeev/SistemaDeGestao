import styled from 'styled-components';

export const ContentDate = styled.div`
  display: flex;
  margin: 20px 0;
  gap: 20px;

  label {
    margin-right: 10px;
    font-weight: bold;
  }

  input {
    outline: 0;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
    transition: border 0.3s;

    &:focus {
      border: 1px solid #007bff; /* Cor do foco */
    }
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  overflow-x: auto; /* Para permitir scroll em telas menores */
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const StyledHeader = styled.th`
  background-color: #007bff;
  color: white;
  padding: 12px;
  text-align: left;
`;

export const StyledCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: #f1f1f1; /* Cor ao passar o mouse */
  }
`;

export const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

export const NoDataMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #d9534f; /* Vermelho para destacar */
`;
