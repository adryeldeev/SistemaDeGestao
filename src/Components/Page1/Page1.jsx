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

import Api from "../../Api/Api.js";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUI } from "../../Context/UIContext.jsx";
import NavItens from "../NavItens/NavItens.jsx";

const Page1 = () => {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useUI();
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [newClient, setNewClient] = useState({
    nome: "",
    sobrenome: "",
    celular: "",
    dataCadastro: "",
    horario: "",
    relevante: 0,
    frequencia: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetching clients
  const fetchClients = async () => {
    try {
      const response = await Api.get("/clientes");
      if (response.status === 200) {
        const clientsWithRelevancia = await Promise.all(
          response.data.map(async (client) => {
            // Obtém os serviços do cliente usando a rota apropriada
            const servicesResponse = await Api.get(
              `/servico/cliente/${client.id}`
            );
            const services = servicesResponse.data || [];

            // Calcula a relevância com base na quantidade de serviços
            const relevancia = calculateRelevancia(services);

            return {
              ...client,
              servicos: services,
              relevante: relevancia,
            };
          })
        );
        setClients(clientsWithRelevancia);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const calculateRelevancia = (servicos) => {
    const totalServicos = servicos.length;
    if (totalServicos >= 10) return 10;
    if (totalServicos >= 5) return 5;
    if (totalServicos == 0) return 0;
    return 0;
  };

  useEffect(() => {
    fetchClients();

    const intervalId = setInterval(() => {
      fetchClients();
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prevClient) => ({ ...prevClient, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (editingClient) {
        response = await Api.put(
          `/updateCliente/${editingClient.id}`,
          newClient
        );
        toast.success("Cliente atualizado com sucesso!");
      } else {
        response = await Api.post("/createCliente", newClient);
        console.log(newClient),
          toast.success("Cliente cadastrado com sucesso!");
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
          relevante: 0,
        });
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
      setIsSubmitting(false);
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setNewClient(client);
    openModal();
  };

  const handleDeleteClient = async (id) => {
    try {
      const response = await Api.delete(`/deleteCliente/${id}`);
      if (response.status === 200) {
        setClients(clients.filter((client) => client.id !== id));
        toast.success("Cliente deletado com sucesso!");
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

  const handleListClients = () => {
    console.log("Lista de Clientes");
  };

  const handleSearchClient = () => {
    navigate("/buscarCliente");
  };

  const buttons = [
    {
      label: "Cadastrar cliente",
      icon: FaPlus,
      onClick: () => {
        setEditingClient(null);
        setNewClient({
          nome: "",
          sobrenome: "",
          celular: "",
          dataCadastro: "",
          horario: "",
        });
        openModal();
      },
    },
    { label: "Lista de Clientes", icon: FaListUl, onClick: handleListClients },
    { label: "Buscar Cliente", icon: FaSearch, onClick: handleSearchClient },
  ];

  return (
    <Fragment>
      <ToastContainer />
      <NavItens />
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
      <Table
        clients={clients}
        onEdit={handleEditClient}
        onDelete={handleDeleteClient}
      />
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
