import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import Api from "../../Api/Api";
import { useModal } from "../../Context/ModalContext";
import {
  ButtonServico,
  DivServicos,
  ModalBackdrop,
  ModalContainer,
  ModalContent,
  OptionsServicos,
  TableServico,
} from "./ServicosStyled";
import { FaEdit, FaTrash } from "react-icons/fa";

const Servicos = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [servicos, setServicos] = useState([]);
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedValue, setSelectedValue] = useState(0);
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [servicoAtual, setServicoAtual] = useState(null);

  useEffect(() => {
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

    const fetchServicosCatalogo = async () => {
      try {
        const response = await Api.get("/servico-catalogo");
        if (response.status === 200) {
          setServicosDisponiveis(response.data);
          if (response.data.length > 0) {
            setSelectedServiceId(""); // Inicializa sem serviço selecionado
            setSelectedValue(response.data[0].preco);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar catálogo de serviços:", error);
      }
    };

    fetchServicos();
    fetchServicosCatalogo();
  }, [id]);

  const handleServiceChange = (e) => {
    const selectedId = e.target.value;
    const service = servicosDisponiveis.find(
      (servico) => servico.id === parseInt(selectedId)
    );
    setSelectedServiceId(selectedId);
    setSelectedValue(service.preco);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    const service = servicosDisponiveis.find(
      (servico) => servico.id === parseInt(selectedServiceId)
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
      } else {
        response = await Api.post("/criarServico", serviceData);
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
        setServicos(updatedServicos);
        calculateTotal(updatedServicos); // Atualiza o total após a exclusão
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

  const handleEdit = (servico) => {
    const service = servicosDisponiveis.find(
      (servicoCatalogo) => servicoCatalogo.nome === servico.produtoNome
    );
    setServicoAtual(servico);
    setIsEditing(true);
    setSelectedServiceId(service ? service.id : "");
    setSelectedValue(servico.valor); // Define o valor atual do serviço
    openModal();
  };

  const closeModalAndReset = () => {
    setServicoAtual(null);
    setIsEditing(false);
    setSelectedServiceId(""); // Limpa o serviço selecionado ao fechar o modal
    setSelectedValue(0); // Limpa o valor selecionado ao fechar o modal
    closeModal();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <Fragment>
      <h1>Serviços do Cliente {id}</h1>
      <DivServicos>
        <OptionsServicos>
          <h1>Serviços</h1>
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
                    <tr key={servico.id}>
                      <th scope="row">{servico.id}</th>
                      <td>{servico.produtoNome}</td>
                      <td>
                        {new Date(servico.realizadoEm).toLocaleDateString(
                          "pt-BR"
                        )}
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
                        <FaEdit
                          onClick={() => handleEdit(servico)}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        />
                        <FaTrash
                          onClick={() => handleDelete(servico.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="6">Total:</td>
                    <td>{total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </TableServico>
          ) : (
            <p>Não há serviços cadastrados.</p>
          )}
        </OptionsServicos>
      </DivServicos>
      {isOpen && (
        <ModalBackdrop onClick={closeModalAndReset}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalContent>
              <h2>{isEditing ? "Editar Serviço" : "Cadastrar Serviço"}</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Serviço:</label>
                  <select
                    name="servico"
                    value={selectedServiceId}
                    onChange={handleServiceChange}
                    required
                  >
                    <option value="" disabled>
                      Selecione um serviço
                    </option>
                    {servicosDisponiveis.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Data (realizada em):</label>
                  <input
                    type="date"
                    name="data"
                    required
                    defaultValue={
                      isEditing
                        ? new Date(servicoAtual.realizadoEm)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </div>
                <div>
                  <label>Quantidade:</label>
                  <input
                    type="number"
                    name="quantidade"
                    required
                    defaultValue={isEditing ? servicoAtual.quantidade : ""}
                  />
                </div>
                <div>
                  <label>Valor:</label>
                  <input
                    type="number"
                    name="valor"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)} // Permitir edição do valor
                    readOnly={!isEditing} // Somente leitura se não estiver editando
                  />
                </div>
                <div>
                  <label>Desconto:</label>
                  <input
                    type="number"
                    name="desconto"
                    defaultValue={isEditing ? servicoAtual.desconto : 0}
                  />
                </div>
                <div>
                  <label>Funcionário:</label>
                  <input
                    type="text"
                    name="funcionario"
                    required
                    defaultValue={isEditing ? servicoAtual.funcionario : ""}
                  />
                </div>
                <button type="submit" disabled={submitting}>
                  {submitting ? "Enviando..." : "Salvar"}
                </button>
                <button type="button" onClick={closeModalAndReset}>
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
