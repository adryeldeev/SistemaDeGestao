import styled from "styled-components";

export const TableIcon = styled.div`
  .table-icons {
    text-align: center;
    justify-content: center;
    align-items: center;
  }

  .linkTable {
    text-decoration: none;
    color: #000;
  }

  .linkTable:hover {
    color: #03a9f4;
    transition: 1s ease-in-out;
  }

  .table-container {
    width: 100%;
    overflow-x: auto; /* Adiciona a barra de rolagem horizontal */
    margin: 0 auto; /* Centraliza a tabela */
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    white-space: nowrap; /* Evita quebra de linha e força a barra de rolagem */
  }

  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  
  
`;
