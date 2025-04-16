import { useReducer, useEffect, Fragment } from "react";
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

// Initial state for useReducer
const initialState = {
  loading: true,
  servicos: [],
  servicosDisponiveis: [],
  selectedServiceName: "",
  selectedValue: 0,
  total: 0,
  submitting: false,
  isEditing: false,
  servicoAtual: null,
  clienteNome: "",
  quantidade: 0,
  desconto: 0,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SERVICOS":
      return { ...state, servicos: action.payload };
    case "SET_SERVICOS_DISPONIVEIS":
      return { ...state, servicosDisponiveis: action.payload };
    case "SET_SELECTED_SERVICE":
      return {
        ...state,
        selectedServiceName: action.payload.name,
        selectedValue: action.payload.value,
      };
    case "SET_CLIENTE_NOME":
      return { ...state, clienteNome: action.payload };
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.payload };
    case "SET_EDITING":
      return {
        ...state,
        isEditing: action.payload.isEditing,
        servicoAtual: action.payload.servicoAtual,
      };
    case "RESET_FORM":
      return {
        ...state,
        selectedServiceName: "",
        selectedValue: 0,
        quantidade: 0,
        desconto: 0,
        isEditing: false,
        servicoAtual: null,
      };
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};

const Servicos = () => {
  const api = useApi();
  const { isOpen, openModal, closeModal } = useUI();
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchInitialData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
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
        dispatch({ type: "SET_SERVICOS", payload: fetchedServicos });
        calculateTotal(fetchedServicos);
      }

      if (catalogoResponse.status === 200) {
        const catalogoData =
          catalogoResponse.data && catalogoResponse.data.data;
        if (Array.isArray(catalogoData)) {
          dispatch({ type: "SET_SERVICOS_DISPONIVEIS", payload: catalogoData });
        }
      }

      if (clienteResponse.status === 200) {
        dispatch({
          type: "SET_CLIENTE_NOME",
          payload: clienteResponse.data.nome,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados iniciais:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const handleServiceChange = (e) => {
    const selectedName = e.target.value;
    const service = state.servicosDisponiveis.find(
      (servico) => servico.nome === selectedName
    );
    dispatch({
      type: "SET_SELECTED_SERVICE",
      payload: { name: selectedName, value: service ? service.preco : 0 },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (state.submitting) return;
    dispatch({ type: "SET_SUBMITTING", payload: true });
  
    try {
      // Monta o objeto de dados para envio
      const serviceData = {
        produtoNome: state.selectedServiceName || state.servicoAtual?.produtoNome, // Mantém o valor atual se não preenchido
        realizadoEm: e.target.data.value || state.servicoAtual?.realizadoEm, // Mantém o valor atual se não preenchido
        horario: e.target.horario.value || state.servicoAtual?.horario, // Mantém o valor atual se não preenchido
        quantidade: state.quantidade || state.servicoAtual?.quantidade, // Mantém o valor atual se não preenchido
        valor: state.selectedValue || state.servicoAtual?.valor, // Mantém o valor atual se não preenchido
        desconto: state.desconto || state.servicoAtual?.desconto, // Mantém o valor atual se não preenchido
        funcionario: e.target.funcionario.value || state.servicoAtual?.funcionario, // Mantém o valor atual se não preenchido
        clienteId:Number(id)
      };
  
      let response;
      if (state.isEditing && state.servicoAtual) {
        // Atualiza o serviço existente
        response = await api.put(
          `/updateServico/${state.servicoAtual.id}`,
          serviceData
        );
        toast.success("Serviço atualizado com sucesso!");
      } else {
        // Cria um novo serviço
        response = await api.post("/criarServico", serviceData);
        toast.success("Serviço cadastrado com sucesso!");
      }
  
      if (response.status === (state.isEditing ? 200 : 201)) {
        // Atualiza os dados chamando a função de busca inicial
        await fetchInitialData();
        closeModalAndReset();
      }
    } catch (error) {
      console.error("Erro ao enviar dados para API:", error);
      toast.error("Erro ao salvar serviço.");
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const handleEdit = (servico) => {
    dispatch({
      type: "SET_SELECTED_SERVICE",
      payload: { name: servico.produtoNome, value: servico.valor },
    });
    dispatch({
      type: "SET_EDITING",
      payload: { isEditing: true, servicoAtual: servico },
    });
    openModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Você tem certeza que deseja excluir este serviço?")) {
      try {
        const response = await api.delete(`/deletarServico/${id}`);
        if (response.status === 200) {
          dispatch({
            type: "SET_SERVICOS",
            payload: state.servicos.filter((servico) => servico.id !== id),
          });
          calculateTotal(state.servicos);
          toast.success("Serviço excluído com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        toast.error("Erro ao excluir serviço.");
      }
    }
  };
  const calculateTotal = (services) => {
    const totalValue = services.reduce((acc, servico) => {
      const valor = parseFloat(servico.valor) || 0;
      const quantidade = parseInt(servico.quantidade, 10) || 0;
      const desconto = parseFloat(servico.desconto) || 0;
      return acc + valor * quantidade - desconto;
    }, 0);
    dispatch({ type: "SET_TOTAL", payload: totalValue });
  };

  useEffect(() => {
    calculateTotal(state.servicos);
  }, [state.servicos]);

  const handleConfirm = async (id) => {
    const servico = state.servicos.find((servico) => servico.id === id);
    if (servico && servico.realizado) {
      toast.info("Este serviço já foi confirmado!");
    return; // Interrompe o fluxo
    }
      if(window.confirm("Você tem certeza que deseja confirmar este serviço?")) {
        try {
          const response = await api.put(`/confirmarServico/${id}`);
          if (response.status === 200 || response.status === 201) {
            dispatch({
              type: "SET_SERVICOS",
              payload: state.servicos.map((servico) =>
                servico.id === id ? { ...servico, realizado: true } : servico
              ),
            });
            toast.success("Serviço confirmado com sucesso!");
          }
        } catch (error) {
          console.error("Erro ao confirmar serviço:", error);
          toast.error("Erro ao confirmar serviço.");
        }
      }
  };

  const closeModalAndReset = () => {
    dispatch({ type: "RESET_FORM" });
    closeModal();
  };

  if (state.loading) return <p>Carregando...</p>;
  if (
    !state.servicos ||
    !state.servicosDisponiveis ||
    state.clienteNome === undefined
  ) {
    return <div>Carregando dados necessários...</div>;
  }

  return (
    <Fragment>
      <ToastContainer />
      <NavItens />
      <h1>Serviços do Cliente {state.clienteNome}</h1>
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
          <Buttons
            buttons={[
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
            ]}
          />
          <ButtonServico>
            <button className="btn btn-primary" onClick={openModal}>
              + Adicionar
            </button>
          </ButtonServico>
          {state.servicos.length > 0 ? (
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
                  {state.servicos.map((servico) => (
                    <tr key={servico.id}>
                      <td>{servico.id}</td>
                      <td>{servico.produtoNome}</td>
                      <td>
                        {new Date(servico.realizadoEm).toLocaleDateString("pt-BR")}</td>
                      <td>{servico.horario}</td>
                      <td>{servico.quantidade}</td>
                      <td>{servico.valor}</td>
                      <td>{servico.desconto}</td>
                      <td>
                        {servico.valor * servico.quantidade - servico.desconto}
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
            </TableServico>
          ) : (
            <p>Nenhum serviço cadastrado.</p>
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
                    value={state.selectedServiceName}
                    onChange={handleServiceChange}
                    
                  >
                    <option value="">Selecione um serviço</option>
                    {state.servicosDisponiveis.map((servico) => (
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
                    
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="horario">Horário:</label>
                  <input
                    type="time"
                    id="horario"
                    className="form-control"
                    
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantidade">Quantidade:</label>
                  <input
                    type="number"
                    name="quantidade"
                    value={state.quantidade}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "quantidade",
                        value: Number(e.target.value) || 0,
                      })
                    }
                    
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="valor">Valor:</label>
                  <input
                    type="number"
                    id="valor"
                    className="form-control"
                    value={state.selectedValue}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="desconto">Desconto:</label>
                  <input
                    type="number"
                    name="desconto"
                    value={state.desconto}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "desconto",
                        value: Number(e.target.value) || 0,
                      })
                    }
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="funcionario">Funcionário:</label>
                  <input
                    type="text"
                    id="funcionario"
                    className="form-control"
                    
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={state.submitting}
                >
                  {state.submitting
                    ? "Salvando..."
                    : state.isEditing
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
