import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import perfil from "../../assets/img/Avatar.png";
import { InfoButtons, InfoDash, InfoPerfil, Perfil } from "./Navbar";

const Navbar = ({ children }) => {
  return (
    <Fragment>
      <InfoDash>
        <Perfil>
          <InfoPerfil>
            <img src={perfil} alt="Avatar" />
            <strong>Carlos Alfano</strong>
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
                    Accordion Item #1
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <NavLink to="/page1">Page 1</NavLink>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Accordion Item #2
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <NavLink to="/servicos">Page 2</NavLink>
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
                    Accordion Item #3
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <NavLink to="/cadastroServico">Page 3</NavLink>
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    Accordion Item #4
                  </button>
                </h2>
                <div
                  id="collapseFour"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <NavLink to="/page2">Page 4</NavLink>
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
      {children}
    </Fragment>
  );
};

export default Navbar;
