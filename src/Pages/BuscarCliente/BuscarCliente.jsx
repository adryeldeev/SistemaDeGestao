import React, { Fragment, useEffect, useState } from "react";
import { FaListUl, FaPowerOff, FaSearch, FaUser } from "react-icons/fa";
import Buttons from "../../Components/Buttons/Buttons";
import {
  ButtonSearch,
  ContainerInfo,
  ContainerInput,
  ContentInputSearch,
  ContentResultSearch,
  InfoBuscar,
  ModalBackDroop,
  ModalBuscarContainer,
  ModalBuscarContent,
  NavbarIten,
} from "./BuscarclienteStyled";
import { useNavigate } from "react-router-dom";
import Table from "../../Components/Table/Table";
import Api from "../../Api/Api";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useUI } from "../../Context/UIContext";
import NavItens from "../../Components/NavItens/NavItens";

const BuscarCliente = () => {
  const { isOpen, openModal, closeModal } = useUI();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
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
        setSearchResults(response.data); // Inicialmente, mostrar todos os clientes
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se já está enviando para evitar duplicações
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true); // Inicia o envio

    try {
      let response;
      if (editingClient) {
        response = await Api.put(
          `/updateCliente/${editingClient.id}`,
          newClient
        );
      } else {
        response = await Api.post("/createCliente", newClient);
      }

      if (response.status === 201 || response.status === 200) {
        fetchClients();
        closeModal();
        setNewClient({
          nome: "",
          sobrenome: "",
          celular: "",
          dataCadastro: "",
          horario: "",
        }); // Limpa os campos do formulário após o envio
      } else {
        console.log("Erro ao cadastrar cliente");
      }
    } catch (error) {
      if (error.response) {
        console.error("Erro ao enviar dados para API:", error.response.data);
      } else {
        console.error("Erro ao enviar dados para API:", error.message);
      }
    } finally {
      setIsSubmitting(false); // Finaliza o envio
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      const response = await Api.delete(`/deleteCliente/${id}`);
      if (response.status === 200) {
        setClients(clients.filter((client) => client.id !== id));
      } else {
        console.log(`Erro ao deletar cliente com ID ${id}:`, response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error(
          `Erro ao deletar cliente com ID ${id}:`,
          error.response.data
        );
      } else {
        console.error(`Erro ao deletar cliente com ID ${id}:`, error.message);
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prevClient) => ({ ...prevClient, [name]: value }));
  };
  const handleEditClient = (client) => {
    setEditingClient(client);
    setNewClient(client);
    openModal();
  };

  const searchName = () => {
    const filteredClients = clients.filter((client) =>
      client.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredClients);
  };

  const handleListClients = () => {
    navigate("/page1");
  };

  const handleSearchClient = () => {
    navigate("/buscarCliente");
  };

  const buttons = [
    { label: "Cadastrar cliente" },
    { label: "Lista de Clientes", icon: FaListUl, onClick: handleListClients },
    { label: "Buscar Cliente", icon: FaSearch, onClick: handleSearchClient },
  ];

  return (
    <Fragment>
      <NavItens />
      <InfoBuscar>
        <div className="Infocomunic">
          <FaSearch />
          <h2>Buscar Cliente</h2>
        </div>
        <span>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur,
          animi?
        </span>
      </InfoBuscar>
      <Buttons buttons={buttons} className="buttons" />
      <ContentInputSearch>
        <ContainerInput>
          <label htmlFor="search" id="search">
            Qual cliente você procura?
          </label>
          <input
            type="text"
            id="search"
            placeholder="Digite o nome do cliente"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ButtonSearch>
            <button className="btnSearch" onClick={searchName}>
              <FaSearch className="faSearch" />
              <span>Procurar</span>
            </button>
          </ButtonSearch>
        </ContainerInput>
      </ContentInputSearch>
      <ContentResultSearch>
        <ContainerInfo>
          <span>
            Resultado da pesquisa <strong>{`"${searchQuery}"`}</strong>
          </span>
          <button onClick={() => setSearchResults(clients)} className="buttonDelete">
            <RiDeleteBin6Line className="riDeleteBin6Line" />
            EXCLUIR PESQUISA
          </button>
        </ContainerInfo>
        <Table
          clients={searchResults}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
        {isOpen && (
          <ModalBackDroop onClick={closeModal}>
            <ModalBuscarContainer onClick={(e) => e.stopPropagation()}>
              <ModalBuscarContent>
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
              </ModalBuscarContent>
            </ModalBuscarContainer>
          </ModalBackDroop>
        )}
      </ContentResultSearch>
    </Fragment>
  );
};

export default BuscarCliente;
