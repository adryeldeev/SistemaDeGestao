import  { Fragment } from "react";
import PropTypes from 'prop-types'
import { NavLink } from "react-router-dom";
import perfil from "../../assets/img/Avatar.png";
import { InfoDash, InfoPerfil, Perfil } from "./Navbar";
import { useUI } from "../../Context/UIContext";
import { InfoButtons } from "./Navbar";
import { useAuth } from './../../Context/authHelpers.jsx';

const Navbar = ({ children }) => {
  const auth  = useAuth()
  const { isOpenSidebar } = useUI();

  return (
    <Fragment>
      <InfoDash isOpen={isOpenSidebar}>
        <Perfil>
          <InfoPerfil>
            <img src={perfil} alt="Avatar" />
            <strong>{auth.user?.username}</strong>
            <span>Cabeleireiro</span>
          </InfoPerfil>
          <InfoButtons>
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Clientes
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <NavLink to="/listadecliente" className="navLink">
                      Lista de clientes
                    </NavLink>
                  </div>
                  <div className="accordion-body">
                    <NavLink to="/buscarCliente" className="navLink">
                      Buscar cliente
                    </NavLink>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    Serviços
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <NavLink to="/cadastroServico" className="navLink">
                      Lista de serviços
                    </NavLink>
                  </div>
                </div>
              </div>

              <h2 className="accordion-header">
                <NavLink to="/financeiro" className="nav-link">
                  Financeiro
                </NavLink>
              </h2>
            </div>
          </InfoButtons>
        </Perfil>
      </InfoDash>
      <main className={`content ${!isOpenSidebar ? "full-width" : ""}`}>
        {children}
      </main>
    </Fragment>
  );
};

Navbar.propTypes = {
  children: PropTypes.node.isRequired,
};


export default Navbar;
