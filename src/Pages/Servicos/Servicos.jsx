import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import useApi from "../../Api/Api";

const Servicos = () => {
  const api = useApi();
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

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [servicosResponse, catalogoResponse, clienteResponse] =
          await Promise.all([
            api.get(`/servico/cliente/${id}`),
            api.get("/servico-catalogo"),
            api.get(`/clientes/${id}`),
          ]);

        if (servicosResponse.status === 200) {
          const fetchedServicos = Array.isArray(servicosResponse.data)
            ? servicosResponse.data
            : [];
          setServicos(fetchedServicos);
          calculateTotal(fetchedServicos);
        }

        if (catalogoResponse.status === 200) {
          console.log("catalogoResponse:", catalogoResponse);

          // Verificando se o campo `data` dentro de `catalogoResponse` existe e está bem estruturado
          const catalogoData =
            catalogoResponse.data && catalogoResponse.data.data;
          if (Array.isArray(catalogoData)) {
            setServicosDisponiveis(catalogoData);
          } else {
            console.error(
              "Erro: `data` ou `data.data` não está bem estruturado."
            );
          }

          if (catalogoData && catalogoData.length > 0) {
            setSelectedServiceName("");
            setSelectedValue(catalogoData[0].preco);
          }
        }

        if (clienteResponse.status === 200) {
          setClienteNome(clienteResponse.data.nome);
        }
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const calculateTotal = (services) => {
    const totalValue = services.reduce((acc, servico) => {
      const valor = parseFloat(servico.valor) || 0; 
      const quantidade = parseInt(servico.quantidade, 10) || 0; 
      const desconto = parseFloat(servico.desconto) || 0; 
      return acc + valor * quantidade - desconto;
    }, 0);
    setTotal(totalValue);
  };

  const handleServiceChange = (e) => {
    const selectedName = e.target.value;
    const service = servicosDisponiveis.find(
      (servico) => servico.nome === selectedName
    );
    setSelectedServiceName(selectedName);
    setSelectedValue(service ? service.preco : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      selectedValue === undefined ||
      selectedServiceName === "" ||
      clienteNome === undefined
    ) {
      alert("Os dados necessários não foram carregados corretamente.");
      return;
    }
    if (submitting) return;
    setSubmitting(true);

    try {
      const service = servicosDisponiveis.find(
        (s) => s.nome === selectedServiceName
      );
      if (!service) {
        toast.error("Selecione um serviço válido.");
        return;
      }
      const valor = parseFloat(selectedValue) || 0;
      const quantidade = parseInt(e.target.quantidade.value, 10) || 0; // Garante que seja um número inteiro
      const desconto = parseFloat(e.target.desconto.value) || 0; // Garantir que seja número

      const serviceData = {
        produtoNome: selectedServiceName,
        realizadoEm: e.target.data.value,
        horario: e.target.horario.value,
        quantidade,
        valor,
        desconto,
        funcionario: e.target.funcionario.value,
        clienteId: parseInt(id, 10),
      };

      let response;
      if (isEditing && servicoAtual) {
        response = await api.put(
          `/updateServico/${servicoAtual.id}`,
          serviceData
        );
        toast.success("Serviço atualizado com sucesso!");
      } else {
        response = await api.post("/criarServico", serviceData);
        toast.success("Serviço cadastrado com sucesso!");
      }
      if (response.status === (isEditing ? 200 : 201)) {
        const updatedService = response.data;
        setServicos((prevServicos) => {
          const updatedServicos = isEditing
            ? prevServicos.map((servico) =>
                servico.id === updatedService.id ? updatedService : servico
              )
            : [...prevServicos, updatedService]; // Adiciona o serviço se não for edição
          calculateTotal(updatedServicos); // Atualiza o total após modificação
          return updatedServicos;
        });
        closeModalAndReset();
      } else {
        console.log("Erro ao salvar serviço");
      }
    } catch (error) {
      console.log("Erro ao enviar dados para API:", error);
      toast.error("Erro ao salvar serviço.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/deletarServico/${id}`);
      if (response.status === 200) {
        const updatedServicos = servicos.filter((servico) => servico.id !== id);
        setServicos(updatedServicos);
        calculateTotal(updatedServicos);
        toast.success("Serviço deletado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao excluir serviço.");
      console.error(error);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const response = await api.put(`/confirmarServico/${id}`, {
        realizado: true,
      });
      if (response.status === 200) {
        setServicos((prev) =>
          prev.map((servico) =>
            servico.id === id ? { ...servico, realizado: true } : servico
          )
        );
        toast.success("Serviço confirmado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao confirmar serviço.");
      console.error(error);
    }
  };

  const handleEdit = (servico) => {
    setServicoAtual(servico);
    setIsEditing(true);
    setSelectedServiceName(servico.produtoNome);
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

  const buttons = [
    {
      label: "Lista de serviço do cliente",
      icon: FaListUl,
      onClick: () => navigate(`/servicos/${id}`),
    },
    {
      label: "Buscar serviço do cliente",
      icon: FaSearch,
      onClick: () => navigate(`/buscarservicodocliente/${id}`),
    },
  ];

  if (loading) return <p>Carregando...</p>;
  if (!servicos || !servicosDisponiveis || clienteNome === undefined) {
    return <div>Carregando dados necessários...</div>;
  }
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
            </span>
          </InfoServico>
          <Buttons buttons={buttons} />
          <ButtonServico>
            <button className="btn btn-primary" onClick={openModal}>
              + Adicionar
            </button>
          </ButtonServico>
          {servicos.length > 0 ? (
            <TableServico>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Serviço</th>
                    <th>Realizado em</th>
                    <th>Horário</th>
                    <th>Qtd</th>
                    <th>Valor</th>
                    <th>Desconto</th>
                    <th>Total</th>
                    <th>Funcionário</th>
                    <th>Ações</th>
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
                        {servico.realizadoEm &&
                        !isNaN(new Date(servico.realizadoEm).getTime())
                          ? new Date(servico.realizadoEm).toLocaleDateString()
                          : "Data inválida"}
                      </td>
                      <td>{servico.horario}</td>
                      <td>{servico.quantidade || 0}</td>
                      <td>
                        {servico.valor ? servico.valor.toFixed(2) : "0.00"}
                      </td>
                      <td>
                        {servico.desconto
                          ? Number(servico.desconto).toFixed(2)
                          : "0.00"}
                      </td>
                      <td>
                        {(
                          (servico.valor || 0) * (servico.quantidade || 0) -
                          (servico.desconto || 0)
                        ).toFixed(2)}
                      </td>
                      <td>{servico.funcionario}</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleConfirm(servico.id)}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(servico)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(servico.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Total: R${total ? total.toFixed(2) : "0.00"}</p>
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
                  <label htmlFor="horario">Horário:</label>
                  <input
                    type="time"
                    id="horario"
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
