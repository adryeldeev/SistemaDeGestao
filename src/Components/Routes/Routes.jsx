import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import Page1 from "../Page1/Page1.jsx";

import { ContentContainer, MainContainer } from "../../Layout/styled.js";
import Servicos from "../../Pages/Servicos/Servicos.jsx";
import CadastrarServico from "../../Pages/CadastroServico/CadastrarServico.jsx";
import Financeiro from "../../Pages/Financeiro/Financeiro.jsx";
import BuscarCliente from "../../Pages/BuscarCliente/BuscarCliente.jsx";
import BuscarServico from "../../Pages/BuscarServico/BuscarServico.jsx";
import BuscarServicoDoCliente from "../../Pages/BuscarServicoDoCliente/BuscarServicoDoCliente.jsx";

function RouterApp() {
  return (
    <BrowserRouter>
      <MainContainer>
        <Navbar>
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
        </Navbar>
      </MainContainer>
    </BrowserRouter>
  );
}

export default RouterApp;
