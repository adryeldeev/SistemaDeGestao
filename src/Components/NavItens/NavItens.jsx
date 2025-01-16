import { Fragment } from "react";
import { Button, NavbarIten } from "./NavitensStyled";
import { FaPowerOff, FaExchangeAlt } from "react-icons/fa";
import { useUI } from "../../Context/UIContext";
import { useAuth } from "../../Context/authHelpers.jsx";
const NavItens = () => {
  const auth = useAuth(); // Use o hook correto aqui
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
            <Button onClick={() => auth.logOut()}> {/* Agora auth.logOut estará definido */}
              <FaPowerOff className="FaPowerOff" />
            </Button>
          </div>
        </div>
      </NavbarIten>
    </Fragment>
  );
};

export default NavItens;
