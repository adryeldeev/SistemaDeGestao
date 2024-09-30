import React from "react";
import { TableIcon } from "./TableStyled";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const Table = ({ clients, onEdit, onDelete }) => {
  if (!Array.isArray(clients)) {
    return null; // Ou uma mensagem de erro, se preferir
  }

  return (
    <TableIcon>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Nome</th>
              <th scope="col">Sobrenome</th>
              <th scope="col">Celular</th>
              <th scope="col">Data</th>
              <th scope="col">Horário</th>
              <th scope="col">Relevância</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="7">Nenhum cliente cadastrado</td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id}>
                  <th scope="row">{client.id}</th>
                  <td>
                    <Link to={`/servicos/${client.id}`} className="linkTable">
                      {client.nome}
                    </Link>
                  </td>
                  <td>{client.sobrenome}</td>
                  <td>{client.celular}</td>
                  <td>
                    {new Date(client.dataCadastro).toLocaleDateString("pt-BR")}
                  </td>
                  <td>{client.horario}</td>
                  <td>{client.relevante}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      style={{
                        cursor: "pointer",
                        marginRight: "10px",
                        border: "0",
                        outline: "none",
                      }}
                      onClick={() => onEdit(client)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => onDelete(client.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TableIcon>
  );
};

export default Table;
