import React from "react";
import { GrUpdate } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TableIcon } from "./TableStyled";
import { Link } from "react-router-dom";

const Table = ({ clients }) => {
  if (!Array.isArray(clients)) {
    return null; // Ou uma mensagem de erro, se preferir
  }

  return (
    <TableIcon>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nome</th>
            <th scope="col">Sobrenome</th>
            <th scope="col">Celular</th>
            <th scope="col">Data</th>
            <th scope="col">Horário</th>
            <th scope="col">Atualizar</th>
            <th scope="col">Deletar</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="8">Nenhum cliente cadastrado</td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id}>
                <th scope="row">{client.id}</th>
                <td>
                  <Link to={`/servicos/${client.id}`}>{client.nome}</Link>
                </td>
                <td>{client.sobrenome}</td>
                <td>{client.celular}</td>
                <td>
                  {new Date(client.dataCadastro).toLocaleDateString("pt-BR")}
                </td>
                <td>{client.horario}</td>
                <td className="table-icons">
                  <GrUpdate />
                </td>
                <td className="table-icons">
                  <RiDeleteBin6Line />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </TableIcon>
  );
};

export default Table;
