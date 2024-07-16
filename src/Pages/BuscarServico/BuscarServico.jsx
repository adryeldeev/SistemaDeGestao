import React, { Fragment, useEffect, useRef, useState } from "react";
import { FaEdit, FaListUl, FaSearch, FaTrash } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

import Buttons from "../../Components/Buttons/Buttons";
import NavItens from "../../Components/NavItens/NavItens";

import Api from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import {
  ButtonBuscarServico,
  ContainerBuscarServico,
  ContainerServicoInfo,
  ContentBuscarServico,
  ContentResultServico,
  InfoBuscarServico,
  ModalBackDropServico,
  ModalContainerServico,
  ModalContentServico,
} from "./BuscarServico";
import { useModal } from "../../Context/ModalContext";

const BuscarServico = () => {
  const navigate = useNavigate();
  const [servico, setServico] = useState([]);
  const [servicoAtual, setServicoAtual] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const nomeServicoRef = useRef(null);
  const precoServicoRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const servicoAtualizado = {
      nome: nomeServicoRef.current.value,
      preco: parseFloat(precoServicoRef.current.value),
    };

    try {
      if (servicoAtual) {
        const response = await Api.put(
          `/servicoCatalogoUpdate/${servicoAtual.id}`,
          servicoAtualizado
        );

        if (response.status === 200) {
          setServicos((prevServicos) =>
            prevServicos.map((servico) =>
              servico.id === servicoAtual.id
                ? response.data.servicoCatalogo
                : servico
            )
          );
        } else {
          console.log("Erro ao atualizar serviço");
        }
      } else {
        const response = await Api.post(
          "/criarServico-catalogo",
          servicoAtualizado
        );

        if (response.status === 200) {
          const novoServicoAdicionado = response.data.servicoCatalogo;
          setServico((prevServicos) => [
            ...prevServicos,
            novoServicoAdicionado,
          ]);
        } else {
          console.log("Erro ao cadastrar serviço");
        }
      }
      closeModal();
    } catch (error) {
      console.log("Erro ao enviar dados para API:", error);
    }
  };

  useEffect(() => {
    async function fetchServicos() {
      try {
        const response = await Api.get("/servico-catalogo");
        if (response.status === 200) {
          setServico(response.data);
          setSearchResults(response.data); // Inicialmente, mostrar todos os serviços
        } else {
          console.log("Erro ao buscar serviços:", response.error);
        }
      } catch (error) {
        console.log("Erro ao buscar serviços:", error);
      }
    }
    fetchServicos();
  }, []);
  const searchName = () => {
    const filteredClients = servico.filter((servico) =>
      servico.nome.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSearchResults(filteredClients);
  };
  const handleDelete = async (id) => {
    try {
      const response = await Api.delete(`/servicoCatalogoDelete/${id}`);
      if (response.status === 200) {
        setServico((prevServicos) =>
          prevServicos.filter((servico) => servico.id !== id)
        );
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
      <NavItens />
      <InfoBuscarServico>
        <div className="Infocomunic">
          <FaSearch />
          <h2>Buscar Serviço</h2>
        </div>
        <span>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur,
          animi?
        </span>
      </InfoBuscarServico>
      <Buttons buttons={buttons} />
      <ContentBuscarServico>
        <ContainerBuscarServico>
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
          <ButtonBuscarServico>
            <button className="btnSearch" onClick={searchName}>
              <FaSearch className="faSearch" />
              <span>Procurar</span>
            </button>
          </ButtonBuscarServico>
        </ContainerBuscarServico>
      </ContentBuscarServico>
      <ContentResultServico>
        <ContainerServicoInfo>
          <span>
            Resultado da pesquisa <strong>{`"${searchValue}"`}</strong>
          </span>
          <button onClick={() => setSearchResults(servico)}>
            <RiDeleteBin6Line className="riDeleteBin6Line" />
            EXCLUIR PESQUISA
          </button>
        </ContainerServicoInfo>
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
            {searchResults.map((servico, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{servico.nome}</td>
                <td>
                  {servico.preco !== undefined
                    ? servico.preco.toFixed(2)
                    : "N/A"}
                </td>
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
        {isOpen && (
          <ModalBackDropServico onClick={closeModal}>
            <ModalContainerServico onClick={(e) => e.stopPropagation()}>
              <ModalContentServico>
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
              </ModalContentServico>
            </ModalContainerServico>
          </ModalBackDropServico>
        )}
      </ContentResultServico>
    </Fragment>
  );
};

export default BuscarServico;
