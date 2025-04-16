import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { TbLockPassword } from "react-icons/tb";
import {
  ContentCadastro,
  InfoCadastro,
  TituloCadastro,
  FormCadastro,
  DivInput,
  Button,
  Text,
} from "./CadastrarUserStyled";
import useApi from "../../Api/Api";

const CadastroUser = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      formData.password !== formData.confirmPassword
    ) {
      setError("Todos os campos são obrigatórios e as senhas devem ser iguais");
      return;
    }

    setError("");

    try {
      const response = await api.post("/createUser", formData);

      if (response.status === 201) {
        navigate("/login"); // Redireciona após sucesso
      } else {
        throw new Error(response.data.message || "Erro ao cadastrar usuário");
      }
    } catch (err) {
      console.error("Cadastro falhou:", err);
      setError(err.response?.data?.message || "Erro ao cadastrar usuário");
    }
  };

  return (
    <ContentCadastro>
      <InfoCadastro>
        <TituloCadastro>Cadastre-se</TituloCadastro>
        <FormCadastro onSubmit={handleSubmit}>
          <DivInput>
            <FaRegUser />
            <input
              type="text"
              placeholder="Digite seu nome"
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
          </DivInput>
          <DivInput>
            <AiOutlineMail />
            <input
              type="email"
              placeholder="Digite seu e-mail"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </DivInput>
          <DivInput>
            <TbLockPassword />
            <input
              type="password"
              placeholder="Digite sua senha"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </DivInput>
          <DivInput>
            <TbLockPassword />
            <input
              type="password"
              placeholder="Confirme sua senha"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </DivInput>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button type="submit">Cadastrar</Button>
          <Text>
            Já tem uma conta? <NavLink to="/login">Faça login</NavLink>
          </Text>
        </FormCadastro>
      </InfoCadastro>
    </ContentCadastro>
  );
};

export default CadastroUser;