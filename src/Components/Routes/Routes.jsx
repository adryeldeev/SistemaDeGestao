import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import Page1 from "../Page1/Page1.jsx";
import { ContentContainer, MainContainer } from "../../Layout/styled.js";
import Servicos from "../../Pages/Servicos/Servicos.jsx";
import CadastrarServico from "../../Pages/CadastroServico/CadastrarServico.jsx";
import Financeiro from "../../Pages/Financeiro/Financeiro.jsx";
import BuscarCliente from "../../Pages/BuscarCliente/BuscarCliente.jsx";
import BuscarServico from "../../Pages/BuscarServico/BuscarServico.jsx";
import BuscarServicoDoCliente from "../../Pages/BuscarServicoDoCliente/BuscarServicoDoCliente.jsx";
import AuthProvider from './../../Context/AuthProvider';
import Login from "../../Pages/Login/Login.jsx";
import CadastroUser from "../../Pages/CadastrarUser/CadastrarUser.jsx";
import RecuperarSenha from "../../Pages/RecuperarSenha/RecuperarSenha.jsx";
import RedefinirSenha from './../../Pages/RedefinirSenha/RedefinirSenha';
import PrivateRoute from './PrivateRoute.jsx';

function RouterApp() {
  return (
    <Router basename="/SistemaDeGestao">
    <AuthProvider>
      <MainContainer>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastrarUser" element={<CadastroUser />} />
          <Route path="/recuperarSenha" element={<RecuperarSenha />} />
          <Route path="/resetarSenha" element={<RedefinirSenha />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <ContentContainer>
                    <Routes>
                      <Route path="/listadecliente" element={<Page1 />} />
                      <Route
                        path="/buscarservicodocliente/:id"
                        element={<BuscarServicoDoCliente />}
                      />
                      <Route path="/buscarCliente" element={<BuscarCliente />} />
                      <Route path="/servicos/:id" element={<Servicos />} />
                      <Route path="/cadastroServico" element={<CadastrarServico />} />
                      <Route path="/buscarServico" element={<BuscarServico />} />
                      <Route path="/financeiro" element={<Financeiro />} />
                      <Route path="/" element={<Page1 />} />
                    </Routes>
                  </ContentContainer>
                </>
              }
            />
          </Route>
        </Routes>
      </MainContainer>
    </AuthProvider>
  </Router>
  );
}

export default RouterApp;
