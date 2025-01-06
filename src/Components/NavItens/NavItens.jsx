import React, { Fragment } from "react";
import { NavbarIten } from "./NavitensStyled";
import { FaPowerOff, FaExchangeAlt } from "react-icons/fa";
import { useUI } from "../../Context/UIContext";
import useApi from "../../Api/Api";

const NavItens = () => {
  const auth = useApi()
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
          
          <div className="iten">
            <button  onClick={() => auth.logOut()}>
            <FaPowerOff className="FaPowerOff" />
            </button>
          </div>
        </div>
      </NavbarIten>
    </Fragment>
  );
};

export default NavItens;
