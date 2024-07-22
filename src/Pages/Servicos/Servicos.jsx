import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../Api/Api";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ButtonServico,
  DivServicos,
  InfoServico,
  ModalBackdrop,
  ModalContainer,
  ModalContent,
  OptionsServicos,
  TableServico,
} from "./ServicosStyled";
import { FaCheck, FaEdit, FaListUl, FaSearch, FaTrash } from "react-icons/fa";
import Buttons from "../../Components/Buttons/Buttons";
import NavItens from "../../Components/NavItens/NavItens";
import { useUI } from "../../Context/UIContext";

const Servicos = () => {
  const { isOpen, openModal, closeModal } = useUI();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [servicos, setServicos] = useState([]);
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [selectedValue, setSelectedValue] = useState(0);
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [servicoAtual, setServicoAtual] = useState(null);
  const [clienteNome, setClienteNome] = useState("");

  const fetchServicos = async () => {
    try {
      const response = await Api.get(`/servico/cliente/${id}`);
      if (response.status === 200) {
        const fetchedServicos = response.data;
        const servicosArray = Array.isArray(fetchedServicos)
          ? fetchedServicos
          : [];
        setServicos(servicosArray);
        calculateTotal(servicosArray);
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchServicosCatalogo = async () => {
      try {
        const response = await Api.get("/servico-catalogo");
        if (response.status === 200) {
          setServicosDisponiveis(response.data);
          if (response.data.length > 0) {
            setSelectedServiceName("");
            setSelectedValue(response.data[0].preco);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar catálogo de serviços:", error);
      }
    };

    const fetchClienteNome = async () => {
      try {
        const response = await Api.get(`/clientes/${id}`);
        if (response.status === 200) {
          setClienteNome(response.data.nome);
        }
      } catch (error) {
        console.error("Erro ao buscar nome do cliente:", error);
      }
    };

    fetchServicos();
    fetchServicosCatalogo();
    fetchClienteNome();
  }, [id]);

  const handleServiceChange = (e) => {
    const selectedName = e.target.value;
    const service = servicosDisponiveis.find(
      (servico) => servico.nome === selectedName
    );
    setSelectedServiceName(selectedName);
    setSelectedValue(service.preco);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    const service = servicosDisponiveis.find(
      (servico) => servico.nome === selectedServiceName
    );

    const serviceData = {
      produtoNome: service.nome,
      realizadoEm: e.target.data.value,
      quantidade: parseInt(e.target.quantidade.value),
      valor: parseFloat(selectedValue),
      desconto: parseFloat(e.target.desconto.value || 0),
      funcionario: e.target.funcionario.value,
      clienteId: parseInt(id),
    };

    try {
      let response;
      if (isEditing && servicoAtual) {
        response = await Api.put(
          `/updateServico/${servicoAtual.id}`,
          serviceData
        );
        toast.success("Serviço atualizado com sucesso!");
      } else {
        response = await Api.post("/criarServico", serviceData);
        toast.success("Serviço cadastrado com sucesso!");
      }

      if (response.status === (isEditing ? 200 : 201)) {
        const updatedService = response.data;
        setServicos((prevServicos) => {
          const updatedServicos = isEditing
            ? prevServicos.map((servico) =>
                servico.id === updatedService.id ? updatedService : servico
              )
            : [...prevServicos, updatedService];
          calculateTotal(updatedServicos);
          return updatedServicos;
        });
        closeModalAndReset();
      } else {
        console.log("Erro ao salvar serviço");
      }
    } catch (error) {
      console.log("Erro ao enviar dados para API:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await Api.delete(`/deletarServico/${id}`);
      if (response.status === 200) {
        const updatedServicos = servicos.filter((servico) => servico.id !== id);
        toast.success("Serviço deletado com sucesso!");
        setServicos(updatedServicos);
        calculateTotal(updatedServicos);
      } else {
        console.log("Erro ao excluir serviço");
      }
    } catch (error) {
      console.log("Erro ao excluir serviço:", error);
    }
  };

  const calculateTotal = (services) => {
    const servicesArray = Array.isArray(services) ? services : [];
    const totalValue = servicesArray.reduce((acc, servico) => {
      return acc + servico.valor * servico.quantidade - servico.desconto;
    }, 0);
    setTotal(totalValue);
  };

  const handleConfirm = async (id) => {
    const servico = servicos.find((servico) => servico.id === id);

    if (servico && servico.realizado) {
      toast.warning("Serviço já está confirmado.");
      return;
    }

    try {
      const response = await Api.put(`/confirmarServico/${id}`, {
        realizado: true,
      });
      console.log("Resposta da API:", response);
      if (response.status === 200) {
        setServicos((prevServicos) =>
          prevServicos.map((servico) =>
            servico.id === id ? { ...servico, realizado: true } : servico
          )
        );
        fetchServicos(); // Atualize a lista de serviços após confirmação
        toast.success("Serviço confirmado com sucesso!");
      } else {
        console.error("Erro ao confirmar serviço");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao confirmar serviço.");
    }
  };

  const handleEdit = (servico) => {
    const service = servicosDisponiveis.find(
      (servicoCatalogo) => servicoCatalogo.nome === servico.produtoNome
    );

    setServicoAtual(servico);
    setIsEditing(true);
    setSelectedServiceName(service ? service.nome : "");
    setSelectedValue(servico.valor);
    openModal();
  };

  const closeModalAndReset = () => {
    setServicoAtual(null);
    setIsEditing(false);
    setSelectedServiceName("");
    setSelectedValue(0);
    closeModal();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  const handleListServico = () => {
    navigate(`/servicos/${id}`);
  };

  const handleSearchServico = () => {
    navigate(`/buscarservicodocliente/${id}`);
  };

  const buttons = [
    {
      label: "Lista de servico do cliente",
      icon: FaListUl,
      onClick: handleListServico,
    },
    {
      label: "Buscar servico do cliente",
      icon: FaSearch,
      onClick: handleSearchServico,
    },
  ];

  return (
    <Fragment>
      <ToastContainer />
      <NavItens />
      <h1>Serviços do Cliente {clienteNome}</h1>
      <DivServicos>
        <OptionsServicos>
          <InfoServico>
            <div className="Infocomunic">
              <FaListUl />
              <h2>Lista de Serviços</h2>
            </div>
            <span>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Aspernatur, animi?
            </span>
          </InfoServico>
          <Buttons buttons={buttons} />
          <ButtonServico>
            <button
              type="button"
              className="btn btn-primary"
              onClick={openModal}
            >
              + Adicionar
            </button>
          </ButtonServico>
          {servicos.length > 0 ? (
            <TableServico>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Serviço</th>
                    <th scope="col">Realizado em</th>
                    <th scope="col">Qtd</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Desconto</th>
                    <th scope="col">Total</th>
                    <th scope="col">Funcionário</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {servicos.map((servico) => (
                    <tr
                      key={servico.id}
                      style={{
                        backgroundColor: servico.realizado ? "#ccc" : "inherit",
                      }}
                    >
                      <td>{servico.id}</td>
                      <td>{servico.produtoNome}</td>
                      <td>
                        {new Date(servico.realizadoEm).toLocaleDateString()}
                      </td>
                      <td>{servico.quantidade}</td>
                      <td>{servico.valor.toFixed(2)}</td>
                      <td>{servico.desconto.toFixed(2)}</td>
                      <td>
                        {(
                          servico.valor * servico.quantidade -
                          servico.desconto
                        ).toFixed(2)}
                      </td>
                      <td>{servico.funcionario}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleConfirm(servico.id)}
                          style={{ border: "0", outline: "0" }}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(servico)}
                          style={{ border: "0", outline: "0" }}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(servico.id)}
                          style={{ border: "0", outline: "0" }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Total: R${total.toFixed(2)}</p>
            </TableServico>
          ) : (
            <p>Nenhum serviço cadastrado para este cliente.</p>
          )}
        </OptionsServicos>
      </DivServicos>

      {isOpen && (
        <ModalBackdrop onClick={closeModalAndReset}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalContent>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="servico">Serviço:</label>
                  <select
                    name="produtoNome"
                    id="servico"
                    className="form-control"
                    value={selectedServiceName}
                    onChange={handleServiceChange}
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    {servicosDisponiveis.map((servico) => (
                      <option key={servico.id} value={servico.nome}>
                        {servico.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="data">Data:</label>
                  <input
                    type="date"
                    id="data"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantidade">Quantidade:</label>
                  <input
                    type="number"
                    id="quantidade"
                    className="form-control"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="valor">Valor:</label>
                  <input
                    type="number"
                    id="valor"
                    className="form-control"
                    value={selectedValue}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="desconto">Desconto:</label>
                  <input
                    type="number"
                    id="desconto"
                    className="form-control"
                    defaultValue="0"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="funcionario">Funcionário:</label>
                  <input
                    type="text"
                    id="funcionario"
                    className="form-control"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Salvando..."
                    : isEditing
                    ? "Atualizar Serviço"
                    : "Adicionar Serviço"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModalAndReset}
                >
                  Cancelar
                </button>
              </form>
            </ModalContent>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </Fragment>
  );
};

export default Servicos;
