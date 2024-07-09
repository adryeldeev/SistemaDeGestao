import React, { useState, useEffect, Fragment } from "react";
import { FaListUl, FaPowerOff, FaUser, FaPlus, FaSearch } from "react-icons/fa";
import Buttons from "../Buttons/Buttons.jsx";
import Table from "./../Table/Table";
import {
  InfoTitulo,
  ModalBackDro,
  ModalCadastroContainer,
  ModalCadastroContent,
  NavbarItens,
} from "./ListaCliente.js";
import { useModal } from "../../Context/ModalContext.jsx";
import Api from "../../Api/Api.js";

const Page1 = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    nome: "",
    sobrenome: "",
    celular: "",
    dataCadastro: "",
    horario: "",
  });

  const fetchClients = async () => {
    try {
      const response = await Api.get("/clientes");
      if (response.status === 200) {
        setClients(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prevClient) => ({ ...prevClient, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Enviando dados para API:", newClient);
      const response = await Api.post("/createCliente", newClient);

      if (response.status === 201) {
        setClients((prevClients) => [...prevClients, response.data.cliente]);
        closeModal();
      } else {
        console.log("Erro ao cadastrar cliente");
      }
    } catch (error) {
      if (error.response) {
        console.error("Erro ao enviar dados para API:", error.response.data);
      } else {
        console.error("Erro ao enviar dados para API:", error.message);
      }
    }
  };

  const handleListClients = () => {
    console.log("Lista de Clientes");
  };

  const handleSearchClient = () => {
    console.log("Buscar Cliente");
  };

  const buttons = [
    { label: "Cadastrar cliente", icon: FaPlus, onClick: openModal },
    { label: "Lista de Clientes", icon: FaListUl, onClick: handleListClients },
    { label: "Buscar Cliente", icon: FaSearch, onClick: handleSearchClient },
  ];

  return (
    <Fragment>
      <NavbarItens>
        <FaListUl />
        <div className="itens">
          <FaUser className="FaUser" />
          <div className="iten">
            <FaPowerOff className="FaPowerOff" />
          </div>
        </div>
      </NavbarItens>
      <InfoTitulo>
        <div className="Infocomunic">
          <FaListUl />
          <h2>Lista de Clientes</h2>
        </div>
        <span>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur,
          animi?
        </span>
      </InfoTitulo>
      <Buttons buttons={buttons} />
      <Table clients={clients} />
      {isOpen && (
        <ModalBackDro onClick={closeModal}>
          <ModalCadastroContainer onClick={(e) => e.stopPropagation()}>
            <ModalCadastroContent>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Nome do cliente:</label>
                  <input
                    type="text"
                    name="nome"
                    value={newClient.nome}
                    onChange={handleInputChange}
                    placeholder="Digite o nome do cliente"
                    required
                  />
                </div>
                <div>
                  <label>Sobrenome:</label>
                  <input
                    type="text"
                    name="sobrenome"
                    value={newClient.sobrenome}
                    onChange={handleInputChange}
                    placeholder="Digite o sobrenome do cliente"
                    required
                  />
                </div>
                <div>
                  <label>Celular:</label>
                  <input
                    type="text"
                    name="celular"
                    value={newClient.celular}
                    onChange={handleInputChange}
                    placeholder="Digite o número do cliente"
                    required
                  />
                </div>
                <div>
                  <label>Data:</label>
                  <input
                    type="date"
                    name="dataCadastro"
                    value={newClient.dataCadastro}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label>Horário:</label>
                  <input
                    type="time"
                    name="horario"
                    value={newClient.horario}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit">Salvar</button>
                <button type="button" onClick={closeModal}>
                  Cancelar
                </button>
              </form>
            </ModalCadastroContent>
          </ModalCadastroContainer>
        </ModalBackDro>
      )}
    </Fragment>
  );
};

export default Page1;
