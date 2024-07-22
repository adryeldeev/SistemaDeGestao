import styled from 'styled-components';

export const Perfil = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%; /* Ajuste se necessário */
  transition: width 0.3s ease; /* Para suavizar a transição de largura */
  img {
    width: 90px;
  }
  .nav-link {
    outline: 0;
    padding-left: 15px;
    font-size: 25px;
    text-decoration: none;
  }
`;

export const InfoPerfil = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

export const InfoDash = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed; /* Fica fixo na tela para que não mova com o conteúdo */
  top: 0; /* Começa no topo da tela */
  left: 0; /* Alinha à esquerda */
  height: 100vh; /* Ocupa toda a altura da tela */
  width: 300px; /* Largura do sidebar quando aberto */
  transition: transform 0.3s ease; /* Suaviza a transição de deslocamento */
  transform: ${props => (props.isOpen ? 'translateX(0)' : 'translateX(-100%)')}; /* Ajusta a posição */
  background: white; /* Defina a cor de fundo conforme necessário */
  z-index: 1000; /* Garante que o sidebar fique acima do conteúdo */
  @media (min-width:375px) and (max-width:575px) {
  display:none;
}
`;

export const InfoButtons = styled.div`
  padding: 60px 0;
  .accordion {
    border-top: 3px solid #ccc;
    padding-top: 10px;
  }
  .navLink {
    text-decoration: none;
    color: #000;
  }
  .navLink:hover {
    border-bottom: 1px solid #ccc;
    transition: margin-right 4s ease-in-out;
  }
`;


