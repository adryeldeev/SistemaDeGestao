import { AiOutlineMail } from "react-icons/ai";
import { TbLockPassword } from "react-icons/tb";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ContentLogin,
  ContentInfoLogin,
  Form,
  InputContainer,
  Button,
  Text,
  TituloCadastro

} from "./LoginStyled";
import { useAuth } from "../../Context/authHelpers.jsx";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // Estado para armazenar erro
  const auth = useAuth();

  // Função para atualizar o estado dos inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [id]: value,
    }));
  };

  // Função de login
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setError(""); // Limpa qualquer erro anterior
    if (input.email && input.password) {
      try {
        // Chama a função loginAction que já está configurada no AuthContext
        await auth.loginAction({
          email: input.email,
          password: input.password,
        });
      } catch (error) {
        setError(error.message); // Exibe o erro caso o login falhe
      }
    } else {
      setError("Por favor, preencha ambos os campos");
    }
  };

  return (
    <ContentLogin>
   
     <ContentInfoLogin>
      <TituloCadastro>Faça login na sua conta </TituloCadastro>
      <Form onSubmit={handleSubmitEvent}>
        <InputContainer>
          <AiOutlineMail className="icon" />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={input.email}
            onChange={handleInputChange}
          />
        </InputContainer>
        <InputContainer>
          <TbLockPassword className="icon" />
          <input
            type="password"
            id="password"
            placeholder="Senha"
            value={input.password}
            onChange={handleInputChange}
          />
        </InputContainer>
        {error && <p className="error">{error}</p>}
        <Button type="submit">Entrar</Button>
        <Text className="text">Não tem uma conta? <NavLink to="/cadastrarUser">Crie uma</NavLink></Text>
        </Form>

     </ContentInfoLogin>



      
    </ContentLogin>
  );
};

export default Login;
