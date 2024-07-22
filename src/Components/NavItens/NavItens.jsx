import React, { Fragment } from "react";
import { NavbarIten } from "./NavitensStyled";
import { FaPowerOff, FaUser, FaExchangeAlt } from "react-icons/fa";
import { useUI } from "../../Context/UIContext";

const NavItens = () => {
  const { isOpenSidebar, openSidebar, closeSidebar } = useUI();

  const toggleSidebar = () => {
    if (isOpenSidebar) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  return (
    <Fragment>
      <NavbarIten>
        <FaExchangeAlt style={{ cursor: "pointer" }} onClick={toggleSidebar} />
        <div className="itens">
          <FaUser className="FaUser" />
          <div className="iten">
            <FaPowerOff className="FaPowerOff" />
          </div>
        </div>
      </NavbarIten>
    </Fragment>
  );
};

export default NavItens;
