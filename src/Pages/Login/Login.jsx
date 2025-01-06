
  import { AiOutlineMail } from "react-icons/ai";
  import { TbLockPassword } from "react-icons/tb";
  import { useState } from 'react';
  import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { ButtonLogin, ContentLogin, DivInputsLogin, DivLinks, FormLogin, InfoContentLogin, InputLogin, LinkPassword, TitleLogin } from "./LoginStyled";
  
  const Login = () => {
    const [input, setInput] = useState({
      email: '',
      password: '',
    });
    const [error, setError] = useState('');  // Estado para armazenar erro
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
      setError('');  // Limpa qualquer erro anterior
      if (input.email && input.password) {
        try {
          // Chama a função loginAction que já está configurada no AuthContext
          await auth.loginAction({
            email: input.email,
            password: input.password,
          });
        } catch (error) {
          setError(error.message);  // Exibe o erro caso o login falhe
        }
      } else {
        setError('Por favor, preencha ambos os campos');
      }
    };
  
    return (
      <ContentLogin>
        <InfoContentLogin>
          <TitleLogin>Faça seu login</TitleLogin>
          <FormLogin onSubmit={handleSubmitEvent}>
            <DivInputsLogin>
              <InputLogin
                type="email"
                id="email"
                placeholder="Email"
                value={input.email}
                onChange={handleInputChange}  // Atualiza o estado quando o usuário digita
              />
                <AiOutlineMail />
            </DivInputsLogin>
            <DivInputsLogin>
              <InputLogin
                type="password"
                id="password"
                placeholder="Senha"
                value={input.password}
                onChange={handleInputChange}  // Atualiza o estado quando o usuário digita
              />
               <TbLockPassword />
            </DivInputsLogin>
            <ButtonLogin type="submit">Entrar</ButtonLogin>
          </FormLogin>
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe o erro, se houver */}
          <DivLinks>
          <LinkPassword>Não é cadastrado? <NavLink to="/cadastrarUser" style={{color:'#000'}}>Cadastrar-se aqui</NavLink></LinkPassword>
          <LinkPassword>Esqueceu a senha?</LinkPassword>
          </DivLinks>
        </InfoContentLogin>
      </ContentLogin>
    );
  };
  
  export default Login;
  