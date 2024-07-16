import React, { Fragment, useEffect, useState } from "react";
import { FaEdit, FaListUl, FaSearch, FaTrash } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useModal } from "../../Context/ModalContext";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../Api/Api";
import Buttons from "../../Components/Buttons/Buttons";
import NavItens from "../../Components/NavItens/NavItens";
import {
  ButtonBuscarServicoCliente,
  ContainerBuscarServicoCliente,
  ContainerServicoInfoCliente,
  ContentBuscarServicoCliente,
  ContentResultServicoCliente,
  InfoBuscarServicoCliente,
  ModalBackdropServicoCliente,
  ModalContainerServicoCliente,
  ModalContentServicoCliente,
  TableServicoCliente,
} from "./BuscarServCliente";

const BuscarServicoDoCliente = () => {
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
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

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
          setSearchResults(servicosArray);
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

  const searchName = () => {
    const filteredServicos = servicos.filter((servico) =>
      servico.produtoNome.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchResults(filteredServicos);
  };

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
  const handleListServico = () => {
    navigate(`/servicos/${id}`);
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
    },
  ];

  return (
    <Fragment>
      <NavItens />
      <InfoBuscarServicoCliente>
        <div className="Infocomunic">
          <FaSearch />
          <h2>Buscar serviço do cliente</h2>
        </div>
        <span>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur,
          animi?
        </span>
      </InfoBuscarServicoCliente>
      <Buttons buttons={buttons} />
      <ContentBuscarServicoCliente>
        <ContainerBuscarServicoCliente>
          <label htmlFor="search" id="search">
            Qual cliente você procura?
          </label>
          <input
            type="text"
            placeholder="Digite o nome do serviço"
            className="inputSearch"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <ButtonBuscarServicoCliente>
            <button className="btnSearch" onClick={searchName}>
              <FaSearch className="faSearch" />
              <span>Procurar</span>
            </button>
          </ButtonBuscarServicoCliente>
        </ContainerBuscarServicoCliente>
      </ContentBuscarServicoCliente>
      <ContentResultServicoCliente>
        <ContainerServicoInfoCliente>
          <span>
            Resultado da pesquisa <strong>{`"${searchValue}"`}</strong>
          </span>
          <button onClick={() => setSearchResults(servicos)}>
            <RiDeleteBin6Line className="riDeleteBin6Line" />
            EXCLUIR PESQUISA
          </button>
        </ContainerServicoInfoCliente>
        {searchResults.length > 0 ? (
          <TableServicoCliente>
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
                {searchResults.map((servico) => (
                  <tr key={servico.id}>
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
              </tbody>
            </table>
            <div className="total-value">
              <span>
                <strong>Total:</strong> R$ {total.toFixed(2)}
              </span>
            </div>
          </TableServicoCliente>
        ) : (
          <p>Nenhum serviço encontrado.</p>
        )}
      </ContentResultServicoCliente>
      {isOpen && (
        <ModalBackdropServicoCliente>
          <ModalContainerServicoCliente>
            <ModalContentServicoCliente>
              <form onSubmit={handleSubmit}>
                <h2>{isEditing ? "Editar Serviço" : "Adicionar Serviço"}</h2>
                <div>
                  <label htmlFor="servico">Serviço</label>
                  <select
                    id="servico"
                    value={selectedServiceId}
                    onChange={handleServiceChange}
                    required
                  >
                    <option value="" disabled>
                      Selecione um serviço
                    </option>
                    {servicosDisponiveis.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {servico.preco.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="data">Data</label>
                  <input
                    type="date"
                    id="data"
                    defaultValue={
                      servicoAtual
                        ? new Date(servicoAtual.realizadoEm)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quantidade">Quantidade</label>
                  <input
                    type="number"
                    id="quantidade"
                    defaultValue={servicoAtual ? servicoAtual.quantidade : 1}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="valor">Valor</label>
                  <input
                    type="number"
                    id="valor"
                    value={selectedValue}
                    onChange={(e) =>
                      setSelectedValue(parseFloat(e.target.value))
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="desconto">Desconto</label>
                  <input
                    type="number"
                    id="desconto"
                    defaultValue={servicoAtual ? servicoAtual.desconto : 0}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="funcionario">Funcionário</label>
                  <input
                    type="text"
                    id="funcionario"
                    defaultValue={servicoAtual ? servicoAtual.funcionario : ""}
                    required
                  />
                </div>
                <div>
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
                </div>
              </form>
            </ModalContentServicoCliente>
          </ModalContainerServicoCliente>
        </ModalBackdropServicoCliente>
      )}
    </Fragment>
  );
};

export default BuscarServicoDoCliente;
