import React, { Fragment } from "react";
import { NavbarIten } from "./NavitensStyled";
import { FaListUl, FaPowerOff, FaUser } from "react-icons/fa";

const NavItens = () => {
  return (
    <Fragment>
      <NavbarIten>
        <FaListUl />
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
