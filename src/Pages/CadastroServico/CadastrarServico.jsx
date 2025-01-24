import  { Fragment, useRef, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ButtonAddServico,
  DivServico,
  InfoCadastrarServico,
  ModalBackDrop,
  ModalContainerr,
  ModalContentt,
  OptionsServico,
  TableCadastro,
} from "./CadastroServicoStyle";

import { FaEdit, FaListUl, FaSearch, FaTrash } from "react-icons/fa";
import NavItens from "../../Components/NavItens/NavItens";
import Buttons from "../../Components/Buttons/Buttons";
import { useNavigate } from "react-router-dom";
import { useUI } from "../../Context/UIContext";
import  useApi from '../../Api/Api'

const CadastrarServico = () => {
  const api =  useApi()
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useUI();
  const [servicos, setServicos] = useState([]);
  const [servicoAtual, setServicoAtual] = useState(null);
  const nomeServicoRef = useRef(null);
  const precoServicoRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchServicos() {
      try {
        const response = await api.get("/servico-catalogo");
        console.log("Serviços recebidos da API:", response.data);
  
        if (Array.isArray(response.data.data)) {
          setServicos(response.data.data); 
        } else {
          console.log("Erro: A resposta não contém um array esperado", response.data);
        }
      } catch (error) {
        console.log("Erro ao buscar serviços:", error);
      }
    }
    fetchServicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isSubmitting) return;
  
    setIsSubmitting(true); // Define como true antes da requisição
  
    const nomeServico = nomeServicoRef.current.value.trim();
    const precoServico = parseFloat(precoServicoRef.current.value);
  
    if (!nomeServico || isNaN(precoServico)) {
      toast.error("Nome e preço do serviço são obrigatórios.");
      setIsSubmitting(false);
      return;
    }

  
  
    const servicoExistente = servicos.some(
      (servico) =>
        servico.nome.toLowerCase() === nomeServico.toLowerCase() &&
        (!servicoAtual || servico.id !== servicoAtual.id) 
    );
  
    if (servicoExistente) {
      toast.error("Já existe um serviço com este nome.");
      setIsSubmitting(false);
      return;
    }
  
    const servicoAtualizado = {
      nome: nomeServico,
      preco: precoServico,
    };
  
    try {
      if (servicoAtual) {
        // Atualiza o serviço
        const response = await api.put(
          `/servicoCatalogoUpdate/${servicoAtual.id}`,
          servicoAtualizado
        );
  
        if (response.status === 200) {
          const servicoAtualizadoData = response.data.servicoCatalogo;
          setServicos((prevServicos) =>
            prevServicos.map((servico) =>
              servico.id === servicoAtual.id ? servicoAtualizadoData : servico
            )
          );
          toast.success("Serviço atualizado com sucesso!");
        } else {
          throw new Error("Erro ao atualizar serviço");
        }
      } else {
        // Adiciona um novo serviço
        const response = await api.post(
          "/criarServico-catalogo",
          servicoAtualizado
        );
  
        if (response.status === 201){
          const novoServicoAdicionado = response.data.servicoCatalogo;
          setServicos((prevServicos) => [
            ...prevServicos,
            novoServicoAdicionado,
          ]);
          toast.success("Serviço cadastrado com sucesso!");
        } else {
          throw new Error("Erro ao cadastrar serviço");
        }
      }
  
      closeModal();
    } catch (error) {
      toast.error("Erro ao enviar dados para API");
      console.error(error);
    } finally {
      setIsSubmitting(false); // Define como false ao finalizar
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/servicoCatalogoDelete/${id}`);
      if (response.status === 200) {
        setServicos((prevServicos) =>
          prevServicos.filter((servico) => servico.id !== id)
        );
        toast.success("Serviço deletado com sucesso!");
      } else {
        console.log("Erro ao excluir serviço");
      }
    } catch (error) {
      console.log("Erro ao excluir serviço:", error);
    }
  };

  const handleEdit = (servico) => {
    setServicoAtual(servico);
    if (nomeServicoRef.current && precoServicoRef.current) {
      nomeServicoRef.current.value = servico.nome;
      precoServicoRef.current.value = servico.preco;
    }
    openModal();
  };

  const handleListServico = () => {
    navigate("/cadastroServico");
  };

  const handleSearchServico = () => {
    navigate("/buscarServico");
  };

  const buttons = [
    { label: "Lista de Servico", icon: FaListUl, onClick: handleListServico },
    { label: "Buscar Servico", icon: FaSearch, onClick: handleSearchServico },
  ];

  return (
    <Fragment>
      <ToastContainer />
      <NavItens />

      <DivServico>
        <OptionsServico>
          <InfoCadastrarServico>
            <div className="Infocomunic">
              <FaListUl />
              <h2>Lista de Serviço</h2>
            </div>
            <span>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Aspernatur, animi?
            </span>
          </InfoCadastrarServico>
          <Buttons buttons={buttons} />
          <ButtonAddServico>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setServicoAtual(null);
                if (nomeServicoRef.current && precoServicoRef.current) {
                  nomeServicoRef.current.value = "";
                  precoServicoRef.current.value = "";
                }
                openModal();
              }}
            >
              + Adicionar
            </button>
          </ButtonAddServico>
          <TableCadastro>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Serviços</th>
                  <th scope="col">Valor</th>

                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((servico, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{servico.nome}</td>
                    <td>
                      {servico.preco !== undefined
                        ? servico.preco.toFixed(2)
                        : "N/A"}
                    </td>

                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(servico)}
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                          border: "0",
                          outline: "none",
                        }}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(servico.id)}
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                          border: "0",
                          outline: "none",
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableCadastro>
        </OptionsServico>
      </DivServico>

      {isOpen && (
        <ModalBackDrop onClick={closeModal}>
          <ModalContainerr onClick={(e) => e.stopPropagation()}>
            <ModalContentt>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Nome do serviço:</label>
                  <input
                    type="text"
                    placeholder="Digite o nome do serviço"
                    required
                    ref={nomeServicoRef}
                  />
                </div>
                <div>
                  <label>Preço do serviço:</label>
                  <input
                    type="number"
                    placeholder="Digite o preço do serviço"
                    required
                    ref={precoServicoRef}
                  />
                </div>
                <button type="submit">Salvar</button>
                <button type="button" onClick={closeModal}>
                  Cancelar
                </button>
              </form>
            </ModalContentt>
          </ModalContainerr>
        </ModalBackDrop>
      )}
    </Fragment>
  );
};

export default CadastrarServico;
